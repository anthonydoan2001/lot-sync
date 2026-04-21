# LotSync — Build & Install (Windows)

Local-only desktop app. Single user. No network, no Supabase, no login.

## Build the installer (on the Windows PC)

Requirements: Node.js 20+, Bun (or npm/pnpm) and the Visual Studio Build Tools for native module compilation (install with `npm install --global windows-build-tools` once if `@electron/rebuild` complains).

```cmd
git clone <repo-url> lot-sync
cd lot-sync
bun install
bun run dist:win
```

Output: `release\LotSync Setup 0.1.0.exe`

## Install the app

Double-click `LotSync Setup 0.1.0.exe`. Choose install location. Finish.

First launch creates an empty SQLite database at `%APPDATA%\LotSync\lotsync.db`.

## Import existing data (one-time, after install)

1. **Close the LotSync app** if it's running (releases the SQLite WAL lock).
2. Delete the empty DB that the first launch created:
   ```cmd
   del "%APPDATA%\LotSync\lotsync.db"
   del "%APPDATA%\LotSync\lotsync.db-wal"
   del "%APPDATA%\LotSync\lotsync.db-shm"
   ```
3. Run the importer:
   ```cmd
   bunx tsx scripts/import-to-sqlite.ts "%APPDATA%\LotSync\lotsync.db"
   ```
   Expected output: `Import complete: {"lots":44,"pallets":85,"announcements":1}`
4. Launch LotSync from the Start menu.

## Daily use

- Data lives in `%APPDATA%\LotSync\lotsync.db`. Back it up manually if you want a copy.
- The Chrome extension under `extension/` is separate — unchanged by this migration.

## Development (optional)

```cmd
bun run dev          # Next.js web server at http://localhost:3000
```

## Rebuilding the installer

Every time you change code and want a new `.exe`:
```cmd
bun run dist:win
```

The old install can be upgraded in-place by running the new installer.
