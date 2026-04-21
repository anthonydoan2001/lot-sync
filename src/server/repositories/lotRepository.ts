import { randomUUID } from "node:crypto";
import { getDb } from "@/server/db/client";
import { rowToLot } from "@/server/db/mappers";
import type { Lot } from "@/types/database.types";

export interface CreateLotInput {
  lot_number: string;
  contents: string;
  io?: string | null;
}

export interface UpdateLotInput {
  lot_number?: string;
  contents?: string;
  io?: string | null;
}

export const lotRepository = {
  findAll(isRetired: boolean): Lot[] {
    const orderCol = isRetired ? "retired_at" : "created_at";
    const rows = getDb()
      .prepare(
        `SELECT * FROM lots WHERE is_retired = ? ORDER BY ${orderCol} DESC`,
      )
      .all(isRetired ? 1 : 0) as Parameters<typeof rowToLot>[0][];
    return rows.map(rowToLot);
  },

  findById(id: string): Lot | null {
    const row = getDb()
      .prepare("SELECT * FROM lots WHERE id = ?")
      .get(id) as Parameters<typeof rowToLot>[0] | undefined;
    return row ? rowToLot(row) : null;
  },

  create(input: CreateLotInput): Lot {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    getDb()
      .prepare(
        `INSERT INTO lots (id, lot_number, contents, io, is_retired, created_at, retired_at)
         VALUES (?, ?, ?, ?, 0, ?, NULL)`,
      )
      .run(id, input.lot_number, input.contents, input.io ?? null, createdAt);
    const created = this.findById(id);
    if (!created) throw new Error("Insert succeeded but row not found");
    return created;
  },

  update(id: string, input: UpdateLotInput): Lot | null {
    const sets: string[] = [];
    const values: (string | null)[] = [];
    if (input.lot_number !== undefined) {
      sets.push("lot_number = ?");
      values.push(input.lot_number);
    }
    if (input.contents !== undefined) {
      sets.push("contents = ?");
      values.push(input.contents);
    }
    if (input.io !== undefined) {
      sets.push("io = ?");
      values.push(input.io);
    }
    if (sets.length === 0) return this.findById(id);
    values.push(id);
    getDb()
      .prepare(`UPDATE lots SET ${sets.join(", ")} WHERE id = ?`)
      .run(...values);
    return this.findById(id);
  },

  retire(id: string): Lot | null {
    getDb()
      .prepare(
        "UPDATE lots SET is_retired = 1, retired_at = ? WHERE id = ?",
      )
      .run(new Date().toISOString(), id);
    return this.findById(id);
  },

  unretire(id: string): Lot | null {
    getDb()
      .prepare(
        "UPDATE lots SET is_retired = 0, retired_at = NULL WHERE id = ?",
      )
      .run(id);
    return this.findById(id);
  },

  remove(id: string): boolean {
    const info = getDb().prepare("DELETE FROM lots WHERE id = ?").run(id);
    return info.changes > 0;
  },
};
