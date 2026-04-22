import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireUser(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    const row = await ctx.db.query("announcements").first();
    if (!row) return null;
    return {
      id: row._id,
      content: row.content,
      updated_at: row.updated_at,
    };
  },
});

export const upsert = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    await requireUser(ctx);
    const existing = await ctx.db.query("announcements").first();
    const now = new Date().toISOString();
    if (existing) {
      await ctx.db.patch(existing._id, { content, updated_at: now });
      return existing._id;
    }
    return await ctx.db.insert("announcements", {
      content,
      updated_at: now,
    });
  },
});
