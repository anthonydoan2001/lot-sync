import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { SCHEMA_SQL } from "./schema";

let instance: Database.Database | null = null;

function resolveDbPath(): string {
  const explicit = process.env.LOTSYNC_DB_PATH;
  if (explicit && explicit.length > 0) return explicit;
  return join(process.cwd(), "data", "lotsync.db");
}

export function getDb(): Database.Database {
  if (instance) return instance;

  const dbPath = resolveDbPath();
  mkdirSync(dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA_SQL);

  instance = db;
  return db;
}
