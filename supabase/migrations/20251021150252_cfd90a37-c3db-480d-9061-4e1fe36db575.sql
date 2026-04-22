-- Create Pallets table
CREATE TABLE public.pallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pallet_number TEXT NOT NULL UNIQUE,
  grade TEXT,
  description TEXT NOT NULL,
  is_retired BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  retired_at TIMESTAMP WITH TIME ZONE
);

-- Create Lots table
CREATE TABLE public.lots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lot_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  contents TEXT NOT NULL,
  is_retired BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  retired_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_pallets_is_retired ON public.pallets(is_retired);
CREATE INDEX idx_pallets_pallet_number ON public.pallets(pallet_number);
CREATE INDEX idx_lots_is_retired ON public.lots(is_retired);
CREATE INDEX idx_lots_lot_number ON public.lots(lot_number);

-- Enable Row Level Security
ALTER TABLE public.pallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;

-- Create policies allowing all operations (internal tool, no auth needed)
CREATE POLICY "Allow all operations on pallets" ON public.pallets
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on lots" ON public.lots
  FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time replication
ALTER TABLE public.pallets REPLICA IDENTITY FULL;
ALTER TABLE public.lots REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.pallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lots;