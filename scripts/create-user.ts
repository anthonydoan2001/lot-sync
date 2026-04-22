import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from "node:fs";
import { api } from "../convex/_generated/api";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return;
  const body = readFileSync(path, "utf8");
  for (const line of body.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*?)\s*(#.*)?$/);
    if (!m) continue;
    const [, k, rawV] = m;
    if (process.env[k] !== undefined) continue;
    let v = rawV.trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    process.env[k] = v;
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
const [username, password, displayNameArg] = process.argv.slice(2);

if (!url || !username || !password) {
  console.error(
    "Usage: bunx tsx scripts/create-user.ts <username> <password> [displayName]",
  );
  console.error(
    "  NEXT_PUBLIC_CONVEX_URL must be set (read from .env.local automatically when run via bun).",
  );
  process.exit(1);
}

if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
  console.error("Username must be 3-20 chars (letters, numbers, underscores).");
  process.exit(1);
}

if (
  password.length < 8 ||
  !/[a-z]/.test(password) ||
  !/[A-Z]/.test(password) ||
  !/[0-9]/.test(password)
) {
  console.error(
    "Password must be at least 8 characters and include an uppercase, a lowercase, and a digit.",
  );
  process.exit(1);
}

const email = `${username.toLowerCase()}@lotsync.app`;
const name = displayNameArg ?? username;

async function main() {
  const client = new ConvexHttpClient(url!);
  try {
    await client.action(api.auth.signIn, {
      provider: "password",
      params: { email, password, name, flow: "signUp" },
    });
    console.log(
      `Created user: ${username} (email=${email}, displayName=${name})`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already exists|InvalidAccountId/.test(message)) {
      console.error(`User "${username}" already exists.`);
    } else {
      console.error("Failed to create user:", message);
    }
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
