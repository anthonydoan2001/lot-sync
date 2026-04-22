# LotSync Setup (Convex + Vercel)

## One-time setup

### 1. Install deps
```sh
bun install
```

### 2. Connect to Convex
```sh
npx convex dev
```
First run opens a browser to log in to your Convex account and links this repo to the `fastidious-sparrow-186` deployment. It:
- writes `CONVEX_DEPLOYMENT` into `.env.local`
- generates `convex/_generated/` (the typed API)
- pushes `convex/schema.ts` + functions
- prompts you to set up `@convex-dev/auth` keys (`JWT_PRIVATE_KEY`, `JWKS`) on the first function that needs them — accept the prompt, it stores them on the Convex backend

Leave `npx convex dev` running in a terminal tab. It hot-pushes changes.

### 3. Create a login
No sign-up page in the app — provision users from the terminal:
```sh
bunx tsx scripts/create-user.ts <username> <password> "<Display Name>"
```
Example:
```sh
bunx tsx scripts/create-user.ts anthony hunter2 "Anthony"
```
Repeat for each teammate.

### 4. Import existing data (one-time)
Build the JSONL files:
```sh
bunx tsx scripts/build-convex-import.ts
```
Push to Convex:
```sh
npx convex import --table lots scripts/import-data/lots.jsonl
npx convex import --table pallets scripts/import-data/pallets.jsonl
npx convex import --table announcements scripts/import-data/announcements.jsonl
```

### 5. Run
```sh
bun run dev
```
Open http://localhost:3000. Log in with the credentials from step 3.

## Deploy to Vercel

### First-time deploy
1. In the Convex dashboard → Settings → Deploy Keys → create a **Production Deploy Key**. Copy it.
2. Push this repo to GitHub.
3. Import the repo in Vercel. During setup:
   - Framework preset: **Next.js**
   - Build command: `npx convex deploy --cmd 'next build'`
   - Environment variables:
     - `CONVEX_DEPLOY_KEY` = the key from step 1 (keep secret)
     - `NEXT_PUBLIC_CONVEX_URL` = `https://fastidious-sparrow-186.convex.cloud`
4. Deploy.

After that, every `git push` redeploys.

### Production user + data
Repeat steps 3 and 4 above against the **production** deployment:
```sh
CONVEX_DEPLOYMENT=prod:... bunx tsx scripts/create-user.ts ...
CONVEX_DEPLOYMENT=prod:... npx convex import --prod --table lots scripts/import-data/lots.jsonl
# ...etc
```
(You can also copy the seed via the Convex dashboard → Data → clone/export/import.)

## Notes
- `scripts/import-data/export.json` has your original Supabase export (lots/pallets/announcements). Treat it as sensitive — delete it once Convex is seeded.
- Chrome extension under `extension/` is unchanged.
- Login maps `username` → `username@lotsync.app` internally, matching the old Supabase convention.
