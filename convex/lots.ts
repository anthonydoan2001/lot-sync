import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireUser(ctx: {
  auth: { getUserIdentity: () => Promise<unknown> };
  db: unknown;
}) {
  const userId = await getAuthUserId(ctx as Parameters<typeof getAuthUserId>[0]);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export const list = query({
  args: { retired: v.boolean() },
  handler: async (ctx, { retired }) => {
    await requireUser(ctx);
    const lots = await ctx.db
      .query("lots")
      .withIndex(
        retired ? "by_retired_retired_at" : "by_retired_created",
        (q) => q.eq("is_retired", retired),
      )
      .order("desc")
      .collect();
    return lots.map((lot) => ({
      id: lot._id,
      lot_number: lot.lot_number,
      contents: lot.contents,
      io: lot.io,
      is_retired: lot.is_retired,
      created_at: lot.created_at,
      retired_at: lot.retired_at,
    }));
  },
});

export const create = mutation({
  args: {
    lot_number: v.string(),
    contents: v.string(),
    io: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { lot_number, contents, io }) => {
    const userId = await requireUser(ctx);

    const existing = await ctx.db
      .query("lots")
      .withIndex("by_lot_number", (q) => q.eq("lot_number", lot_number))
      .first();
    if (existing) throw new Error("Lot number already exists");

    const lotId = await ctx.db.insert("lots", {
      lot_number,
      contents,
      io,
      is_retired: false,
      created_at: new Date().toISOString(),
      retired_at: null,
    });

    await ctx.db.insert("lot_workers", { lotId, userId });

    return lotId;
  },
});

export const update = mutation({
  args: {
    id: v.id("lots"),
    lot_number: v.optional(v.string()),
    contents: v.optional(v.string()),
    io: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUser(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Lot not found");
    await ctx.db.patch(id, patch);
  },
});

export const retire = mutation({
  args: { id: v.id("lots") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, {
      is_retired: true,
      retired_at: new Date().toISOString(),
    });
  },
});

export const unretire = mutation({
  args: { id: v.id("lots") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, { is_retired: false, retired_at: null });
  },
});

export const remove = mutation({
  args: { id: v.id("lots") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    const workers = await ctx.db
      .query("lot_workers")
      .withIndex("by_lot", (q) => q.eq("lotId", id))
      .collect();
    for (const w of workers) await ctx.db.delete(w._id);
    await ctx.db.delete(id);
  },
});
