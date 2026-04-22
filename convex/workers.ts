import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireUser(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export const forLots = query({
  args: { lotIds: v.array(v.id("lots")) },
  handler: async (ctx, { lotIds }) => {
    await requireUser(ctx);
    if (lotIds.length === 0) return [] as Array<{
      lotId: string;
      userId: string;
      displayName: string;
    }>;

    const out: Array<{ lotId: string; userId: string; displayName: string }> =
      [];
    for (const lotId of lotIds) {
      const rows = await ctx.db
        .query("lot_workers")
        .withIndex("by_lot", (q) => q.eq("lotId", lotId))
        .collect();
      for (const row of rows) {
        const user = await ctx.db.get(row.userId);
        out.push({
          lotId: lotId as unknown as string,
          userId: row.userId as unknown as string,
          displayName:
            (user as { name?: string | null } | null)?.name ?? "Unknown",
        });
      }
    }
    return out;
  },
});

export const join = mutation({
  args: { lotId: v.id("lots") },
  handler: async (ctx, { lotId }) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db
      .query("lot_workers")
      .withIndex("by_lot_user", (q) =>
        q.eq("lotId", lotId).eq("userId", userId),
      )
      .first();
    if (existing) return;
    await ctx.db.insert("lot_workers", { lotId, userId });
  },
});

export const leave = mutation({
  args: { lotId: v.id("lots") },
  handler: async (ctx, { lotId }) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db
      .query("lot_workers")
      .withIndex("by_lot_user", (q) =>
        q.eq("lotId", lotId).eq("userId", userId),
      )
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
