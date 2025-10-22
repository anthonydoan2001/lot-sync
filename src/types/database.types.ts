export interface Pallet {
  id: string;
  pallet_number: string;
  type: string | null;
  grade: string | null;
  description: string;
  is_retired: boolean;
  created_at: string;
  retired_at: string | null;
}

export interface Lot {
  id: string;
  lot_number: string;
  customer_name: string;
  contents: string;
  is_retired: boolean;
  created_at: string;
  retired_at: string | null;
}
