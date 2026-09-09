import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Devices table - stores activated devices and their playlist configurations
 */
export const devicesTable = sqliteTable("devices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull().unique(),
  deviceKeyHash: text("device_key_hash").notNull(),
  pinHash: text("pin_hash").notNull(),
  playlistName: text("playlist_name").notNull(),
  m3uUrl: text("m3u_url"),
  xtreamServer: text("xtream_server"),
  xtreamUsername: text("xtream_username"),
  xtreamPassword: text("xtream_password"),
  epgUrl: text("epg_url"),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/**
 * Activation logs table - tracks device activation and configuration changes
 */
export const activationLogsTable = sqliteTable("activation_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull(),
  changedByIp: text("changed_by_ip").notNull(),
  oldM3uUrl: text("old_m3u_url"),
  newM3uUrl: text("new_m3u_url"),
  oldXtreamServer: text("old_xtream_server"),
  newXtreamServer: text("new_xtream_server"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Device = typeof devicesTable.$inferSelect;
export type InsertDevice = typeof devicesTable.$inferInsert;
export type ActivationLog = typeof activationLogsTable.$inferSelect;
export type InsertActivationLog = typeof activationLogsTable.$inferInsert;
