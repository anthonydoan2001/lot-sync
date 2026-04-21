export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS lots (
  id TEXT PRIMARY KEY,
  lot_number TEXT NOT NULL UNIQUE,
  contents TEXT NOT NULL,
  io TEXT,
  is_retired INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  retired_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_lots_is_retired ON lots(is_retired);
CREATE INDEX IF NOT EXISTS idx_lots_lot_number ON lots(lot_number);
CREATE INDEX IF NOT EXISTS idx_lots_created_at ON lots(created_at);
CREATE INDEX IF NOT EXISTS idx_lots_retired_at ON lots(retired_at);

CREATE TABLE IF NOT EXISTS pallets (
  id TEXT PRIMARY KEY,
  pallet_number TEXT NOT NULL UNIQUE,
  type TEXT,
  grade TEXT,
  description TEXT NOT NULL,
  generation TEXT,
  notes TEXT,
  is_retired INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  retired_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_pallets_is_retired ON pallets(is_retired);
CREATE INDEX IF NOT EXISTS idx_pallets_pallet_number ON pallets(pallet_number);
CREATE INDEX IF NOT EXISTS idx_pallets_type ON pallets(type);
CREATE INDEX IF NOT EXISTS idx_pallets_created_at ON pallets(created_at);
CREATE INDEX IF NOT EXISTS idx_pallets_retired_at ON pallets(retired_at);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT INTO announcements (id, content)
SELECT lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6))), ''
WHERE NOT EXISTS (SELECT 1 FROM announcements);
`;
