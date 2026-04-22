import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

const dir = join(process.cwd(), "scripts", "import-data");
const raw = readFileSync(join(dir, "export.json"), "utf8");
const data = JSON.parse(raw) as ExportFile;

const writeJsonl = (filename: string, rows: Record<string, unknown>[]) => {
  const path = join(dir, filename);
  writeFileSync(
    path,
    rows.map((r) => JSON.stringify(r)).join("\n") + "\n",
    "utf8",
  );
  console.log(`  ${filename}: ${rows.length} rows -> ${path}`);
};

const lots = data.lots.map((l) => ({
  lot_number: l.lot_number,
  contents: l.contents,
  io: l.io,
  is_retired: l.is_retired,
  created_at: l.created_at,
  retired_at: l.retired_at,
}));

const pallets = data.pallets.map((p) => ({
  pallet_number: p.pallet_number,
  type: p.type,
  grade: p.grade,
  description: p.description,
  generation: p.generation,
  notes: p.notes,
  is_retired: p.is_retired,
  created_at: p.created_at,
  retired_at: p.retired_at,
}));

const announcements = data.announcements.map((a) => ({
  content: a.content,
  updated_at: a.updated_at,
}));

console.log(`Transforming export.json (exported_at=${data.exported_at})`);
writeJsonl("lots.jsonl", lots);
writeJsonl("pallets.jsonl", pallets);
writeJsonl("announcements.jsonl", announcements);

console.log("\nDone. Next: run these to push into Convex (after `npx convex dev` is set up):\n");
console.log("  npx convex import --table lots scripts/import-data/lots.jsonl");
console.log(
  "  npx convex import --table pallets scripts/import-data/pallets.jsonl",
);
console.log(
  "  npx convex import --table announcements scripts/import-data/announcements.jsonl",
);
