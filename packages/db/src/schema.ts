import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const devicesTable = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: text("device_id").notNull().unique(),
  deviceKeyHash: text("device_key_hash").notNull(),
  playlistName: text("playlist_name").notNull(),
  pinHash: text("pin_hash").notNull(),
  m3uUrl: text("m3u_url"),
  xtreamServer: text("xtream_server"),
  xtreamUsername: text("xtream_username"),
  xtreamPassword: text("xtream_password"),
  epgUrl: text("epg_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
});

export const activationLogsTable = pgTable("activation_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: text("device_id").notNull(),
  changedByIp: text("changed_by_ip").notNull(),
  oldM3uUrl: text("old_m3u_url"),
  newM3uUrl: text("new_m3u_url"),
  oldXtreamServer: text("old_xtream_server"),
  newXtreamServer: text("new_xtream_server"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
