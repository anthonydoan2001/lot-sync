import { NextRequest, NextResponse } from "next/server";
import { lotRepository } from "@/server/repositories/lotRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const updated = lotRepository.unretire(id);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lot not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("POST /api/lots/[id]/unretire failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unretire lot" },
      { status: 500 },
    );
  }
}
