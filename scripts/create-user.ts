import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

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

if (password.length < 6) {
  console.error("Password must be at least 6 characters.");
  process.exit(1);
}

const email = `${username.toLowerCase()}@lotsync.app`;
const name = displayNameArg ?? username;

const client = new ConvexHttpClient(url);

try {
  await client.action(api.auth.signIn, {
    provider: "password",
    params: { email, password, name, flow: "signUp" },
  });
  console.log(`Created user: ${username} (email=${email}, displayName=${name})`);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  if (/already exists|InvalidAccountId/.test(message)) {
    console.error(`User "${username}" already exists.`);
  } else {
    console.error("Failed to create user:", message);
  }
  process.exit(2);
}
