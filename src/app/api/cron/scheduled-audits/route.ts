import { NextRequest, NextResponse } from "next/server";
import { runDueSchedules } from "@/app/actions/schedule";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDueSchedules();
  return NextResponse.json({ ok: true, ...result });
}
