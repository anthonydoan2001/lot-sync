import { randomUUID } from "node:crypto";
import { getDb } from "@/server/db/client";
import { rowToPallet } from "@/server/db/mappers";
import type { Pallet } from "@/types/database.types";

export interface CreatePalletInput {
  pallet_number: string;
  description: string;
  type?: string | null;
  grade?: string | null;
  generation?: string | null;
  notes?: string | null;
}

export interface UpdatePalletInput {
  pallet_number?: string;
  description?: string;
  type?: string | null;
  grade?: string | null;
  generation?: string | null;
  notes?: string | null;
}

export const palletRepository = {
  findAll(isRetired: boolean): Pallet[] {
    const orderCol = isRetired ? "retired_at" : "created_at";
    const rows = getDb()
      .prepare(
        `SELECT * FROM pallets WHERE is_retired = ? ORDER BY ${orderCol} DESC`,
      )
      .all(isRetired ? 1 : 0) as Parameters<typeof rowToPallet>[0][];
    return rows.map(rowToPallet);
  },

  findById(id: string): Pallet | null {
    const row = getDb()
      .prepare("SELECT * FROM pallets WHERE id = ?")
      .get(id) as Parameters<typeof rowToPallet>[0] | undefined;
    return row ? rowToPallet(row) : null;
  },

  create(input: CreatePalletInput): Pallet {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    getDb()
      .prepare(
        `INSERT INTO pallets
          (id, pallet_number, description, type, grade, generation, notes, is_retired, created_at, retired_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, NULL)`,
      )
      .run(
        id,
        input.pallet_number,
        input.description,
        input.type ?? null,
        input.grade ?? null,
        input.generation ?? null,
        input.notes ?? null,
        createdAt,
      );
    const created = this.findById(id);
    if (!created) throw new Error("Insert succeeded but row not found");
    return created;
  },

  update(id: string, input: UpdatePalletInput): Pallet | null {
    const sets: string[] = [];
    const values: (string | null)[] = [];
    const fields: (keyof UpdatePalletInput)[] = [
      "pallet_number",
      "description",
      "type",
      "grade",
      "generation",
      "notes",
    ];
    for (const f of fields) {
      if (input[f] !== undefined) {
        sets.push(`${f} = ?`);
        values.push(input[f] as string | null);
      }
    }
    if (sets.length === 0) return this.findById(id);
    values.push(id);
    getDb()
      .prepare(`UPDATE pallets SET ${sets.join(", ")} WHERE id = ?`)
      .run(...values);
    return this.findById(id);
  },

  retire(id: string): Pallet | null {
    getDb()
      .prepare(
        "UPDATE pallets SET is_retired = 1, retired_at = ? WHERE id = ?",
      )
      .run(new Date().toISOString(), id);
    return this.findById(id);
  },

  unretire(id: string): Pallet | null {
    getDb()
      .prepare(
        "UPDATE pallets SET is_retired = 0, retired_at = NULL WHERE id = ?",
      )
      .run(id);
    return this.findById(id);
  },

  remove(id: string): boolean {
    const info = getDb().prepare("DELETE FROM pallets WHERE id = ?").run(id);
    return info.changes > 0;
  },
};
