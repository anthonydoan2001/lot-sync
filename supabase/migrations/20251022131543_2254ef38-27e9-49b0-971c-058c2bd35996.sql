-- Add type column to pallets table
ALTER TABLE pallets ADD COLUMN type text;

-- Create index for better query performance
CREATE INDEX idx_pallets_type ON pallets(type);