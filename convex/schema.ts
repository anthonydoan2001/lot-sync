import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  lots: defineTable({
    lot_number: v.string(),
    contents: v.string(),
    io: v.union(v.string(), v.null()),
    is_retired: v.boolean(),
    created_at: v.string(),
    retired_at: v.union(v.string(), v.null()),
  })
    .index("by_retired_created", ["is_retired", "created_at"])
    .index("by_retired_retired_at", ["is_retired", "retired_at"])
    .index("by_lot_number", ["lot_number"]),

  pallets: defineTable({
    pallet_number: v.string(),
    type: v.union(v.string(), v.null()),
    grade: v.union(v.string(), v.null()),
    description: v.string(),
    generation: v.union(v.string(), v.null()),
    notes: v.union(v.string(), v.null()),
    is_retired: v.boolean(),
    created_at: v.string(),
    retired_at: v.union(v.string(), v.null()),
  })
    .index("by_retired_created", ["is_retired", "created_at"])
    .index("by_retired_retired_at", ["is_retired", "retired_at"])
    .index("by_pallet_number", ["pallet_number"]),

  announcements: defineTable({
    content: v.string(),
    updated_at: v.string(),
  }),

  lot_workers: defineTable({
    lotId: v.id("lots"),
    userId: v.id("users"),
  })
    .index("by_lot", ["lotId"])
    .index("by_lot_user", ["lotId", "userId"])
    .index("by_user", ["userId"]),
});
