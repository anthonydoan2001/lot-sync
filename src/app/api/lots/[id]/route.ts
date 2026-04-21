import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lotRepository } from "@/server/repositories/lotRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  lot_number: z.string().min(1).optional(),
  contents: z.string().min(1).optional(),
  io: z.string().nullable().optional(),
});

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const updated = lotRepository.update(id, parsed);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }
    console.error("PATCH /api/lots/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lot" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const removed = lotRepository.remove(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/lots/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lot" },
      { status: 500 },
    );
  }
}
