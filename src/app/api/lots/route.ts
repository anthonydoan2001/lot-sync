import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { lotRepository } from "@/server/repositories/lotRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  lot_number: z.string().min(1),
  contents: z.string().min(1),
  io: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  const retired = request.nextUrl.searchParams.get("retired") === "1";
  try {
    const lots = lotRepository.findAll(retired);
    return NextResponse.json({ success: true, data: lots });
  } catch (error) {
    console.error("GET /api/lots failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lots" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const created = lotRepository.create({
      lot_number: parsed.lot_number,
      contents: parsed.contents,
      io: parsed.io ?? null,
    });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }
    console.error("POST /api/lots failed:", error);
    const message =
      error instanceof Error && /UNIQUE/.test(error.message)
        ? "Lot number already exists"
        : "Failed to create lot";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
