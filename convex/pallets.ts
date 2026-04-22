import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireUser(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export const list = query({
  args: { retired: v.boolean() },
  handler: async (ctx, { retired }) => {
    await requireUser(ctx);
    const rows = await ctx.db
      .query("pallets")
      .withIndex(
        retired ? "by_retired_retired_at" : "by_retired_created",
        (q) => q.eq("is_retired", retired),
      )
      .order("desc")
      .collect();
    return rows.map((p) => ({
      id: p._id,
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
  },
});

export const create = mutation({
  args: {
    pallet_number: v.string(),
    description: v.string(),
    type: v.optional(v.union(v.string(), v.null())),
    grade: v.optional(v.union(v.string(), v.null())),
    generation: v.optional(v.union(v.string(), v.null())),
    notes: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const existing = await ctx.db
      .query("pallets")
      .withIndex("by_pallet_number", (q) =>
        q.eq("pallet_number", args.pallet_number),
      )
      .first();
    if (existing) throw new Error("Pallet number already exists");
    await ctx.db.insert("pallets", {
      pallet_number: args.pallet_number,
      description: args.description,
      type: args.type ?? null,
      grade: args.grade ?? null,
      generation: args.generation ?? null,
      notes: args.notes ?? null,
      is_retired: false,
      created_at: new Date().toISOString(),
      retired_at: null,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("pallets"),
    pallet_number: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.string(), v.null())),
    grade: v.optional(v.union(v.string(), v.null())),
    generation: v.optional(v.union(v.string(), v.null())),
    notes: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { id, ...patch }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, patch);
  },
});

export const retire = mutation({
  args: { id: v.id("pallets") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, {
      is_retired: true,
      retired_at: new Date().toISOString(),
    });
  },
});

export const unretire = mutation({
  args: { id: v.id("pallets") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, { is_retired: false, retired_at: null });
  },
});

export const remove = mutation({
  args: { id: v.id("pallets") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
