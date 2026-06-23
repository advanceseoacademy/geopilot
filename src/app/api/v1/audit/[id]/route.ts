import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/validate-api-key";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const privateNoStore = { "Cache-Control": "private, no-cache, no-store" };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = await validateApiKey(request.headers.get("authorization"));
  if (!apiKey) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401, headers: privateNoStore });
  }

  const { id } = await params;

  const audit = await db.audit.findUnique({
    where: { id },
    include: {
      entities: { orderBy: { count: "desc" }, take: 20 },
      topics: true,
      project: true,
    },
  });

  if (!audit || audit.project.userId !== apiKey.userId) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404, headers: privateNoStore });
  }

  return NextResponse.json({
    id: audit.id,
    url: audit.url,
    status: audit.status,
    title: audit.title,
    scores: {
      geo: audit.geoScore,
      aiReadiness: audit.aiReadinessScore,
      citation: audit.citationScore,
      authority: audit.authorityScore,
      entity: audit.entityScore,
      eeat: audit.eeatScore,
      contentStructure: audit.contentStructureScore,
      internalLinks: audit.internalLinkScore,
      readability: audit.readabilityScore,
      faq: audit.faqScore,
    },
    crawlData: audit.crawlData,
    recommendations: audit.recommendations,
    entities: audit.entities,
    topics: audit.topics,
    pdfUrl: `/api/report/${audit.id}/pdf`,
    createdAt: audit.createdAt,
  }, { headers: privateNoStore });
}
