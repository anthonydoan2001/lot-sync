import { NextRequest, NextResponse } from "next/server";
import { palletRepository } from "@/server/repositories/palletRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const updated = palletRepository.retire(id);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Pallet not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("POST /api/pallets/[id]/retire failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retire pallet" },
      { status: 500 },
    );
  }
}
