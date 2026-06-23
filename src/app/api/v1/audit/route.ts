import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/validate-api-key";
import { runGeoAuditForUser } from "@/app/actions/audit";

export async function POST(request: NextRequest) {
  const apiKey = await validateApiKey(request.headers.get("authorization"));
  if (!apiKey) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const result = await runGeoAuditForUser(body.url, apiKey.userId, apiKey.teamId || undefined);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({
    success: true,
    auditId: result.auditId,
    reportUrl: `/api/v1/audit/${result.auditId}`,
    pdfUrl: `/api/report/${result.auditId}/pdf`,
  });
}
