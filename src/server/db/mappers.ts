import type { Lot, Pallet } from "@/types/database.types";

export interface Announcement {
  id: string;
  content: string;
  updated_at: string;
}

type LotRow = {
  id: string;
  lot_number: string;
  contents: string;
  io: string | null;
  is_retired: number;
  created_at: string;
  retired_at: string | null;
};

type PalletRow = {
  id: string;
  pallet_number: string;
  type: string | null;
  grade: string | null;
  description: string;
  generation: string | null;
  notes: string | null;
  is_retired: number;
  created_at: string;
  retired_at: string | null;
};

type AnnouncementRow = {
  id: string;
  content: string;
  updated_at: string;
};

export function rowToLot(row: LotRow): Lot {
  return {
    id: row.id,
    lot_number: row.lot_number,
    contents: row.contents,
    io: row.io,
    is_retired: row.is_retired === 1,
    created_at: row.created_at,
    retired_at: row.retired_at,
  };
}

export function rowToPallet(row: PalletRow): Pallet {
  return {
    id: row.id,
    pallet_number: row.pallet_number,
    type: row.type,
    grade: row.grade,
    description: row.description,
    generation: row.generation,
    notes: row.notes,
    is_retired: row.is_retired === 1,
    created_at: row.created_at,
    retired_at: row.retired_at,
  };
}

export function rowToAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    content: row.content,
    updated_at: row.updated_at,
  };
}

export function boolToInt(value: boolean | undefined): number | undefined {
  if (value === undefined) return undefined;
  return value ? 1 : 0;
}
