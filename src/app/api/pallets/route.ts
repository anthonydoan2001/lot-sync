import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { palletRepository } from "@/server/repositories/palletRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  pallet_number: z.string().min(1),
  description: z.string().min(1),
  type: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  generation: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  const retired = request.nextUrl.searchParams.get("retired") === "1";
  try {
    const pallets = palletRepository.findAll(retired);
    return NextResponse.json({ success: true, data: pallets });
  } catch (error) {
    console.error("GET /api/pallets failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pallets" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const created = palletRepository.create({
      pallet_number: parsed.pallet_number,
      description: parsed.description,
      type: parsed.type ?? null,
      grade: parsed.grade ?? null,
      generation: parsed.generation ?? null,
      notes: parsed.notes ?? null,
    });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }
    console.error("POST /api/pallets failed:", error);
    const message =
      error instanceof Error && /UNIQUE/.test(error.message)
        ? "Pallet number already exists"
        : "Failed to create pallet";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
