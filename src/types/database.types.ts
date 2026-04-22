export interface Pallet {
  id: string;
  pallet_number: string;
  type: string | null;
  grade: string | null;
  description: string;
  generation: string | null;
  is_retired: boolean;
  created_at: string;
  retired_at: string | null;
  notes: string | null;
}

export interface Lot {
  id: string;
  lot_number: string;
  contents: string;
  io: string | null;
  is_retired: boolean;
  created_at: string;
  retired_at: string | null;
}

export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
}

export interface LotWorker {
  id: string;
  lot_id: string;
  user_id: string;
  joined_at: string;
}
