import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { devicesTable, activationLogsTable } from "./schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in project root or use in-memory for testing
const dbPath = process.env.DATABASE_URL || path.join(__dirname, "..", "..", "..", "pulsetv.db");

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export { devicesTable, activationLogsTable };
export type { Device, InsertDevice, ActivationLog, InsertActivationLog } from "./schema";
