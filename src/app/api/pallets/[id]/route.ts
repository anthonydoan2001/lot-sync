import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { palletRepository } from "@/server/repositories/palletRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  pallet_number: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  generation: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const updated = palletRepository.update(id, parsed);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Pallet not found" },
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
    console.error("PATCH /api/pallets/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update pallet" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const removed = palletRepository.remove(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: "Pallet not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/pallets/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete pallet" },
      { status: 500 },
    );
  }
}
