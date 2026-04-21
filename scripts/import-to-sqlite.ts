import Database from "better-sqlite3";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { SCHEMA_SQL } from "../src/server/db/schema";

interface ExportedLot {
  id: string;
  lot_number: string;
  contents: string;
  io: string | null;
  is_retired: boolean;
  created_at: string;
  retired_at: string | null;
}

interface ExportedPallet {
  id: string;
  pallet_number: string;
  type: string | null;
  grade: string | null;
  description: string;
  generation: string | null;
  notes: string | null;
  is_retired: boolean;
  created_at: string;
  retired_at: string | null;
}

interface ExportedAnnouncement {
  id: string;
  content: string;
  updated_at: string;
}

interface ExportFile {
  exported_at: string;
  lots: ExportedLot[];
  pallets: ExportedPallet[];
  announcements: ExportedAnnouncement[];
}

const dbPath = process.argv[2] ?? join(process.cwd(), "data", "lotsync.db");
const exportPath = join(process.cwd(), "scripts", "export.json");

mkdirSync(dirname(dbPath), { recursive: true });

const data = JSON.parse(readFileSync(exportPath, "utf8")) as ExportFile;

console.log(`Importing to: ${dbPath}`);
console.log(`Source snapshot: exported_at=${data.exported_at}`);
console.log(
  `  lots=${data.lots.length} pallets=${data.pallets.length} announcements=${data.announcements.length}`,
);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

const existingLots = db
  .prepare("SELECT COUNT(*) AS n FROM lots")
  .get() as { n: number };
const existingPallets = db
  .prepare("SELECT COUNT(*) AS n FROM pallets")
  .get() as { n: number };
if (existingLots.n > 0 || existingPallets.n > 0) {
  console.error(
    `Refusing to import: DB is not empty (lots=${existingLots.n}, pallets=${existingPallets.n}). Delete the file or use a fresh path.`,
  );
  process.exit(1);
}

const insertLot = db.prepare(
  `INSERT INTO lots (id, lot_number, contents, io, is_retired, created_at, retired_at)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
);
const insertPallet = db.prepare(
  `INSERT INTO pallets
    (id, pallet_number, type, grade, description, generation, notes, is_retired, created_at, retired_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);
const replaceAnnouncement = db.prepare(
  "UPDATE announcements SET id = ?, content = ?, updated_at = ? WHERE rowid = (SELECT rowid FROM announcements LIMIT 1)",
);

const tx = db.transaction(() => {
  for (const lot of data.lots) {
    insertLot.run(
      lot.id,
      lot.lot_number,
      lot.contents,
      lot.io,
      lot.is_retired ? 1 : 0,
      lot.created_at,
      lot.retired_at,
    );
  }
  for (const p of data.pallets) {
    insertPallet.run(
      p.id,
      p.pallet_number,
      p.type,
      p.grade,
      p.description,
      p.generation,
      p.notes,
      p.is_retired ? 1 : 0,
      p.created_at,
      p.retired_at,
    );
  }
  const ann = data.announcements[0];
  if (ann) {
    replaceAnnouncement.run(ann.id, ann.content, ann.updated_at);
  }
});

tx();

const after = {
  lots: (db.prepare("SELECT COUNT(*) AS n FROM lots").get() as { n: number }).n,
  pallets: (db.prepare("SELECT COUNT(*) AS n FROM pallets").get() as { n: number })
    .n,
  announcements: (
    db.prepare("SELECT COUNT(*) AS n FROM announcements").get() as {
      n: number;
    }
  ).n,
};

db.close();

console.log(`\nImport complete: ${JSON.stringify(after)}`);
