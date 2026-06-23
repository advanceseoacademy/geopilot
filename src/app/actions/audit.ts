"use server";

import { db } from "@/lib/db";
import { crawlSite } from "@/lib/geo/crawler";
import { runFullAnalysis } from "@/lib/geo/analyze";
import { buildReportSummary } from "@/lib/geo/recommendations";
import { fetchSitemapUrls } from "@/lib/geo/sitemap-parser";
import { analyzeRobotsTxt } from "@/lib/geo/robots-analyzer";
import { requireSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { createNotification, sendWebhook } from "@/lib/notifications";
import { revalidatePath } from "next/cache";
import type { ScoringWeights } from "@/lib/geo/types";

async function getUserSettings(userId: string) {
  return db.userSettings.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

async function getOrCreateProject(userId: string, domain: string, teamId?: string) {
  let project = await db.project.findFirst({
    where: { userId, domain, teamId: teamId || null },
  });
  if (!project) {
    project = await db.project.create({
      data: { name: domain, domain, userId, teamId: teamId || null },
    });
  }
  return project;
}

async function updateProgress(auditId: string, progress: number, msg: string) {
  await db.audit.update({
    where: { id: auditId },
    data: { progress, progressMsg: msg, status: "PROCESSING" },
  });
}

export async function startAudit(formData: FormData) {
  const url = formData.get("url") as string;
  if (!url) return { success: false, error: "URL is required" };

  try {
    const session = await requireSession();
    if (!rateLimit(`audit:${session.user.id}`, 30, 60_000)) {
      return { success: false, error: "Rate limit exceeded. Try again in a minute." };
    }

    const targetUrl = url.startsWith("http") ? url : `https://${url}`;
    const domain = new URL(targetUrl).hostname;
    const project = await getOrCreateProject(session.user.id, domain);

    const result = await runGeoAudit(targetUrl, project.id, session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/audits");
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Unauthorized") return { success: false, error: "Please log in to run audits" };
    return { success: false, error: message };
  }
}

export async function runGeoAudit(url: string, projectId: string, userId?: string) {
  try {
    new URL(url);

    const audit = await db.audit.create({
      data: { url, projectId, status: "PROCESSING", progress: 0, progressMsg: "Starting..." },
    });

    const settings = userId ? await getUserSettings(userId) : null;
    const scoringWeights = settings?.scoringWeights as ScoringWeights | undefined;

    await updateProgress(audit.id, 5, "Checking robots.txt...");
    const robots = await analyzeRobotsTxt(url);

    await updateProgress(audit.id, 10, "Fetching sitemap...");
    const sitemapUrls = await fetchSitemapUrls(url, robots.sitemapUrls);

    await updateProgress(audit.id, 15, "Crawling site...");
    const siteCrawl = await crawlSite(url, 50, sitemapUrls, async (pct, msg) => {
      await updateProgress(audit.id, 15 + Math.round(pct * 0.6), msg);
    });

    if (!siteCrawl.mainPageHtml) {
      await db.audit.update({ where: { id: audit.id }, data: { status: "FAILED", progress: 0 } });
      return { success: false, error: "Failed to crawl URL. Ensure it is accessible." };
    }

    await updateProgress(audit.id, 85, "Analyzing content...");
    const analysis = await runFullAnalysis(url, siteCrawl, scoringWeights);
    const { scores, data, entities, topics, recommendations, crawlData, robots: robotsResult, language, webVitals } = analysis;
    const summary = buildReportSummary(analysis, url);

    await updateProgress(audit.id, 95, "Saving results...");

    await db.$transaction(async (tx) => {
      await tx.audit.update({
        where: { id: audit.id },
        data: {
          status: "COMPLETED",
          progress: 100,
          progressMsg: "Complete",
          title: data.title,
          description: data.description,
          wordCount: data.wordCount,
          geoScore: scores.geoScore,
          aiReadinessScore: scores.aiReadinessScore,
          citationScore: scores.citationScore,
          authorityScore: scores.authorityScore,
          entityScore: scores.entityScore,
          eeatScore: scores.eeatScore,
          contentStructureScore: scores.contentStructureScore,
          internalLinkScore: scores.internalLinkScore,
          readabilityScore: scores.readabilityScore,
          faqScore: scores.faqScore,
          scoreBreakdown: JSON.parse(JSON.stringify(scores.breakdown)),
          recommendations: JSON.parse(JSON.stringify(recommendations)),
          crawlData: crawlData ? JSON.parse(JSON.stringify(crawlData)) : undefined,
          robotsData: JSON.parse(JSON.stringify(robotsResult)),
          webVitals: JSON.parse(JSON.stringify(webVitals)),
          languageData: JSON.parse(JSON.stringify(language)),
        },
      });

      if (entities.entities.length > 0) {
        await tx.entity.createMany({
          data: entities.entities.map((e) => ({
            auditId: audit.id, name: e.name, type: e.type, count: e.count,
          })),
        });
      }

      const allTopics = [
        ...topics.primary.map((t) => ({ ...t, type: "Primary" })),
        ...topics.secondary.map((t) => ({ ...t, type: "Secondary" })),
        ...topics.supporting.map((t) => ({ ...t, type: "Supporting" })),
      ];
      if (allTopics.length > 0) {
        await tx.topic.createMany({
          data: allTopics.map((t) => ({
            auditId: audit.id, name: t.name, type: t.type, relevance: t.relevance,
          })),
        });
      }

      await tx.report.create({
        data: { auditId: audit.id, summary, pdfUrl: `/api/report/${audit.id}/pdf` },
      });
    });

    if (userId && settings?.notifyOnComplete) {
      await createNotification(
        userId,
        "Audit Complete",
        `GEO score: ${scores.geoScore}/100 for ${data.title || url}`,
        "audit_complete",
        `/dashboard/audit/${audit.id}`
      );
    }

    if (settings?.webhookUrl) {
      await sendWebhook(settings.webhookUrl, {
        event: "audit.complete",
        auditId: audit.id,
        url,
        geoScore: scores.geoScore,
        timestamp: new Date().toISOString(),
      });
    }

    return { success: true, auditId: audit.id };
  } catch (error: unknown) {
    console.error("Audit error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during the audit.";
    return { success: false, error: message };
  }
}

export async function runGeoAuditForUser(url: string, userId: string, teamId?: string) {
  const targetUrl = url.startsWith("http") ? url : `https://${url}`;
  const domain = new URL(targetUrl).hostname;
  const project = await getOrCreateProject(userId, domain, teamId);
  return runGeoAudit(targetUrl, project.id, userId);
}

export async function getAuditProgress(auditId: string) {
  const audit = await db.audit.findUnique({
    where: { id: auditId },
    select: { status: true, progress: true, progressMsg: true },
  });
  return audit;
}

const auditListSelect = {
  id: true,
  title: true,
  url: true,
  status: true,
  geoScore: true,
  createdAt: true,
} as const;

const auditCompareSelect = {
  id: true,
  title: true,
  url: true,
  geoScore: true,
  aiReadinessScore: true,
  eeatScore: true,
  authorityScore: true,
  entityScore: true,
  citationScore: true,
  faqScore: true,
} as const;

const scoreSelect = {
  geoScore: true,
  aiReadinessScore: true,
  eeatScore: true,
  authorityScore: true,
  entityScore: true,
  citationScore: true,
  contentStructureScore: true,
  internalLinkScore: true,
  readabilityScore: true,
  faqScore: true,
} as const;

export async function getUserAuditsList(userId: string, take?: number) {
  return db.audit.findMany({
    where: { project: { userId } },
    orderBy: { createdAt: "desc" },
    select: auditListSelect,
    ...(take ? { take } : {}),
  });
}

export async function getUserAudits(userId: string) {
  return getUserAuditsList(userId);
}

export async function getUserStats(userId: string) {
  const [aggregate, entityCount, recentAudits] = await Promise.all([
    db.audit.aggregate({
      where: { project: { userId }, status: "COMPLETED" },
      _count: { id: true },
      _avg: { geoScore: true },
    }),
    db.entity.count({ where: { audit: { project: { userId } } } }),
    db.audit.findMany({
      where: { project: { userId }, status: "COMPLETED" },
      select: { geoScore: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    totalAudits: aggregate._count.id,
    avgScore: Math.round(aggregate._avg.geoScore ?? 0),
    entityCount,
    recentScores: recentAudits.map((a) => a.geoScore || 0),
  };
}

export async function compareAudits(ids: string[]) {
  return db.audit.findMany({
    where: { id: { in: ids }, status: "COMPLETED" },
    select: auditCompareSelect,
  });
}

export async function getAuditDiff(id1: string, id2: string) {
  const [a, b] = await Promise.all([
    db.audit.findUnique({ where: { id: id1 }, select: scoreSelect }),
    db.audit.findUnique({ where: { id: id2 }, select: scoreSelect }),
  ]);
  if (!a || !b) return null;

  const scoreKeys = ["geoScore", "aiReadinessScore", "eeatScore", "authorityScore", "entityScore", "citationScore", "contentStructureScore", "internalLinkScore", "readabilityScore", "faqScore"] as const;
  const diff = scoreKeys.map((key) => ({
    metric: key.replace("Score", "").replace(/([A-Z])/g, " $1").trim(),
    before: a[key],
    after: b[key],
    change: (b[key] || 0) - (a[key] || 0),
  }));

  return { auditA: a, auditB: b, diff };
}
