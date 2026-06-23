import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAuditPdf } from "@/lib/pdf/generate-audit-pdf";
import { getSession } from "@/lib/session";
import { validateApiKey } from "@/lib/validate-api-key";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const apiKey = await validateApiKey(request.headers.get("authorization"));

    const audit = await db.audit.findUnique({
      where: { id },
      include: {
        entities: { orderBy: { count: "desc" }, take: 15 },
        reports: { take: 1 },
        project: true,
      },
    });

    if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isOwner = session?.user?.id === audit.project.userId;
    const isApiOwner = apiKey?.userId === audit.project.userId;
    if (!isOwner && !isApiOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const recommendations = (audit.recommendations as { category: string; priority: string; title: string; description: string }[]) || [];
    const crawlData = audit.crawlData as { pagesCrawled: number; orphanPages: string[] } | null;

    const pdfBuffer = await generateAuditPdf({
      url: audit.url,
      title: audit.title,
      geoScore: audit.geoScore,
      aiReadinessScore: audit.aiReadinessScore,
      citationScore: audit.citationScore,
      authorityScore: audit.authorityScore,
      entityScore: audit.entityScore,
      eeatScore: audit.eeatScore,
      contentStructureScore: audit.contentStructureScore,
      internalLinkScore: audit.internalLinkScore,
      readabilityScore: audit.readabilityScore,
      faqScore: audit.faqScore,
      summary: audit.reports[0]?.summary || null,
      recommendations,
      entities: audit.entities,
      crawlData,
    });

    const filename = `geopilot-audit-${audit.id.slice(0, 8)}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
