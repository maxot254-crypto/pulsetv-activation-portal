import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db, activationLogsTable, devicesTable } from "@workspace/db";
import {
  ActivateDeviceBody,
  DevicePinInput,
} from "@workspace/api-zod";

const router: IRouter = Router();

function hashDeviceKey(key: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(key, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyDeviceKey(key: string, encoded: string): boolean {
  const [salt, storedHash] = encoded.split(":");
  if (!salt || !storedHash) return false;
  const actualHash = scryptSync(key, salt, 64);
  const expectedHash = Buffer.from(storedHash, "hex");
  return expectedHash.length === actualHash.length && timingSafeEqual(actualHash, expectedHash);
}

function verifySecret(secret: string, encoded: string | null): boolean {
  return Boolean(encoded && verifyDeviceKey(secret, encoded));
}

function trimOptional(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

router.post("/activate", async (req, res) => {
  const parsed = ActivateDeviceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Check the required fields and try again." });
    return;
  }

  const data = parsed.data;
  const pin = data.pin.trim();
  const m3uUrl = trimOptional(data.m3uUrl);
  const xtreamServer = trimOptional(data.xtreamServer);
  const xtreamUsername = trimOptional(data.xtreamUsername);
  const xtreamPassword = trimOptional(data.xtreamPassword);
  const epgUrl = trimOptional(data.epgUrl);

  if (!m3uUrl && !xtreamServer) {
    res.status(400).json({ error: "Add an M3U URL or Xtream server to continue." });
    return;
  }

  if (xtreamServer && (!xtreamUsername || !xtreamPassword)) {
    res.status(400).json({ error: "Xtream server, username, and password are all required." });
    return;
  }

  const deviceId = data.deviceId.trim();
  const playlistName = data.playlistName.trim();
  const existing = await db.select().from(devicesTable).where(eq(devicesTable.deviceId, deviceId)).limit(1);
  const current = existing[0];

  if (current && !verifyDeviceKey(data.deviceKey, current.deviceKeyHash)) {
    res.status(403).json({ error: "That device key does not match this device ID." });
    return;
  }

  const updatedAt = new Date();
  let deviceIdForLog = deviceId;
  if (current) {
    await db
      .update(devicesTable)
      .set({
        playlistName,
        pinHash: hashDeviceKey(pin),
        m3uUrl,
        xtreamServer,
        xtreamUsername,
        xtreamPassword,
        epgUrl,
        updatedAt,
      })
      .where(eq(devicesTable.id, current.id));

    await db.insert(activationLogsTable).values({
      deviceId,
      changedByIp: req.ip ?? "unknown",
      oldM3uUrl: current.m3uUrl,
      newM3uUrl: m3uUrl,
      oldXtreamServer: current.xtreamServer,
      newXtreamServer: xtreamServer,
      createdAt: new Date(),
    });
  } else {
    const inserted = await db
      .insert(devicesTable)
      .values({
        deviceId,
        deviceKeyHash: hashDeviceKey(data.deviceKey),
        pinHash: hashDeviceKey(pin),
        playlistName,
        m3uUrl,
        xtreamServer,
        xtreamUsername,
        xtreamPassword,
        epgUrl,
        updatedAt,
        createdAt: new Date(),
      })
      .returning({ deviceId: devicesTable.deviceId });
    deviceIdForLog = inserted[0]?.deviceId ?? deviceId;

    await db.insert(activationLogsTable).values({
      deviceId: deviceIdForLog,
      changedByIp: req.ip ?? "unknown",
      oldM3uUrl: null,
      newM3uUrl: m3uUrl,
      oldXtreamServer: null,
      newXtreamServer: xtreamServer,
      createdAt: new Date(),
    });
  }

  res.json({
    success: true,
    deviceId: deviceIdForLog,
    message: "Activation saved. Restart your TV app or wait for it to refresh.",
    updatedAt: updatedAt.toISOString(),
  });
});

router.post("/device/:deviceId/verify", async (req, res) => {
  const parsed = DevicePinInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid PIN." });
    return;
  }

  const deviceId = req.params.deviceId.trim();
  const device = (
    await db
      .select()
      .from(devicesTable)
      .where(and(eq(devicesTable.deviceId, deviceId)))
      .limit(1)
  )[0];

  if (!device) {
    res.status(404).json({ error: "Device not found or not activated." });
    return;
  }

  if (!verifySecret(parsed.data.pin, device.pinHash)) {
    res.status(403).json({ error: "That PIN is incorrect." });
    return;
  }

  const updatedAt = new Date();
  await db
    .update(devicesTable)
    .set({ lastSeenAt: updatedAt })
    .where(eq(devicesTable.id, device.id));

  res.json({
    deviceId: device.deviceId,
    playlistName: device.playlistName,
    m3uUrl: device.m3uUrl,
    xtreamServer: device.xtreamServer,
    xtreamUsername: device.xtreamUsername,
    xtreamPassword: device.xtreamPassword,
    epgUrl: device.epgUrl,
    updatedAt: device.updatedAt.toISOString(),
  });
});

export default router;
