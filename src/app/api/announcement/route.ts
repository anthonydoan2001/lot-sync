import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { announcementRepository } from "@/server/repositories/announcementRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  id: z.string().min(1),
  content: z.string(),
});

export async function GET() {
  try {
    const announcement = announcementRepository.get();
    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    console.error("GET /api/announcement failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcement" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const updated = announcementRepository.update(parsed.id, parsed.content);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
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
    console.error("PUT /api/announcement failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update announcement" },
      { status: 500 },
    );
  }
}
