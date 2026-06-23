import { NextRequest, NextResponse } from "next/server";
import { getAuditProgress } from "@/app/actions/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "private, no-cache, no-store, must-revalidate" };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const progress = await getAuditProgress(id);
  if (!progress) return NextResponse.json({ error: "Not found" }, { status: 404, headers: noStore });
  return NextResponse.json(progress, { headers: noStore });
}
