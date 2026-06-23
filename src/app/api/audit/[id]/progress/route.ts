import { NextRequest, NextResponse } from "next/server";
import { getAuditProgress } from "@/app/actions/audit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const progress = await getAuditProgress(id);
  if (!progress) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(progress);
}
