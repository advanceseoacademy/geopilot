import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import dynamic from "next/dynamic";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TotalScoreHero } from "@/components/TotalScoreHero";
import { RecommendationsList, ScoreBreakdown } from "@/components/AuditReport";
import { PrintButton } from "@/components/PrintButton";
import { ShareButton } from "@/components/ShareButton";
import { getBenchmarkComparison } from "@/lib/geo/benchmarks";

const EntityGraph = dynamic(
  () => import("@/components/EntityGraph").then((m) => m.EntityGraph),
  { loading: () => <div className="h-[200px] animate-pulse bg-zinc-800/50 rounded-xl" /> }
);

export default async function AuditDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [session, audit] = await Promise.all([
    getSession(),
    db.audit.findUnique({
      where: { id },
      include: {
        entities: { orderBy: { count: "desc" }, take: 30 },
        topics: { orderBy: { relevance: "desc" } },
        reports: { orderBy: { createdAt: "desc" }, take: 1 },
        project: { select: { userId: true } },
      },
    }),
  ]);

  if (!audit) return notFound();

  if (session?.user && audit.project.userId !== session.user.id) {
    return notFound();
  }

  const recommendations = (audit.recommendations as { category: string; priority: string; title: string; description: string }[]) || [];
  const breakdown = (audit.scoreBreakdown as Record<string, { label: string; score: number; maxScore: number; explanation: string }[]>) || {};
  const crawlData = audit.crawlData as { pagesCrawled: number; orphanPages: string[]; siteMap: { url: string; title: string; inboundLinks: number }[] } | null;
  const robotsData = audit.robotsData as { score: number; blockedBots: string[]; allowedBots: string[]; sitemapUrls: string[] } | null;
  const webVitals = audit.webVitals as { responseTimeMs: number; htmlSizeKb: number; score: number; rating: string } | null;
  const languageData = audit.languageData as { primaryLanguage: string; isMultilingual: boolean; languages: { code: string; percentage: number }[] } | null;
  const benchmarks = getBenchmarkComparison({
    geoScore: audit.geoScore,
    aiReadinessScore: audit.aiReadinessScore,
    eeatScore: audit.eeatScore,
    authorityScore: audit.authorityScore,
    entityScore: audit.entityScore,
    citationScore: audit.citationScore,
    contentStructureScore: audit.contentStructureScore,
    internalLinkScore: audit.internalLinkScore,
    readabilityScore: audit.readabilityScore,
    faqScore: audit.faqScore,
  });

  return (
    <div className="space-y-8 print:p-8 print:bg-white print:text-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GEO Audit Report</h1>
          <p className="text-muted-foreground break-all">{audit.url}</p>
          {audit.title && <p className="text-sm text-zinc-400 mt-1">{audit.title}</p>}
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
            Back
          </Link>
          <ShareButton auditId={audit.id} />
          <PrintButton auditId={audit.id} />
        </div>
      </div>

      {audit.status !== "COMPLETED" ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium text-zinc-300">Status: {audit.status}</h3>
            {audit.status === "FAILED" && (
              <p className="text-red-400 mt-2">The crawler was unable to process this URL.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <TotalScoreHero
            totalScore={audit.geoScore}
            title={audit.title || "GEO Audit Report"}
            subtitle={audit.url}
            scores={[
              { label: "AI Readiness", score: audit.aiReadinessScore },
              { label: "E-E-A-T", score: audit.eeatScore },
              { label: "Authority", score: audit.authorityScore },
              { label: "Entity", score: audit.entityScore },
              { label: "Citation", score: audit.citationScore },
              { label: "Content", score: audit.contentStructureScore },
              { label: "Links", score: audit.internalLinkScore },
              { label: "Readability", score: audit.readabilityScore },
              { label: "FAQ", score: audit.faqScore },
            ]}
          />

          {/* Page Meta */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-400">Word Count</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{audit.wordCount?.toLocaleString() ?? "—"}</div></CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800 md:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-400">Meta Description</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-zinc-300">{audit.description || "No meta description found"}</p></CardContent>
            </Card>
          </div>

          {/* Industry Benchmarks */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Industry Benchmarks</CardTitle>
              <CardDescription>How you compare to average GEO scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {benchmarks.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-zinc-300">{b.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{b.score}</span>
                    <span className="text-zinc-500">avg {b.benchmark}</span>
                    <span className={b.status === "above" ? "text-green-400" : b.status === "below" ? "text-red-400" : "text-yellow-400"}>
                      {b.diff > 0 ? "+" : ""}{b.diff}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Technical Analysis */}
          <div className="grid gap-4 md:grid-cols-3">
            {webVitals && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Web Vitals</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>Response: {webVitals.responseTimeMs}ms</p>
                  <p>HTML Size: {webVitals.htmlSizeKb}KB</p>
                  <p className="text-purple-400 font-bold">Score: {webVitals.score}/100 ({webVitals.rating})</p>
                </CardContent>
              </Card>
            )}
            {robotsData && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm">AI Bot Access</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="text-green-400">Allowed: {robotsData.allowedBots.length} bots</p>
                  <p className="text-red-400">Blocked: {robotsData.blockedBots.join(", ") || "None"}</p>
                  <p className="text-purple-400 font-bold">Score: {robotsData.score}/100</p>
                </CardContent>
              </Card>
            )}
            {languageData && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Language</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>Primary: {languageData.primaryLanguage}</p>
                  <p>{languageData.isMultilingual ? "Multilingual content" : "Single language"}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Site Crawl */}
          {crawlData && (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Multi-Page Site Crawl</CardTitle>
                <CardDescription>
                  {crawlData.pagesCrawled} pages crawled · {crawlData.orphanPages.length} orphan pages detected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {crawlData.orphanPages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-2">Orphan Pages (few inbound links)</p>
                    <ul className="space-y-1">
                      {crawlData.orphanPages.map((url) => (
                        <li key={url} className="text-sm text-zinc-400 truncate">• {url}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {crawlData.siteMap && crawlData.siteMap.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead>Page</TableHead>
                        <TableHead className="text-right">Inbound Links</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {crawlData.siteMap.map((page) => (
                        <TableRow key={page.url} className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableCell>
                            <p className="text-sm font-medium text-zinc-300 truncate">{page.title}</p>
                            <p className="text-xs text-zinc-500 truncate">{page.url}</p>
                          </TableCell>
                          <TableCell className="text-right text-zinc-400">{page.inboundLinks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Actionable improvements for better AI search visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationsList recommendations={recommendations} />
            </CardContent>
          </Card>

          {/* Score Breakdowns */}
          <div className="grid gap-6 md:grid-cols-2">
            {breakdown.eeat && <ScoreBreakdown title="E-E-A-T Breakdown" factors={breakdown.eeat} />}
            {breakdown.content && <ScoreBreakdown title="Content Structure Breakdown" factors={breakdown.content} />}
            {breakdown.aiReadiness && <ScoreBreakdown title="AI Readiness Breakdown" factors={breakdown.aiReadiness} />}
            {breakdown.links && <ScoreBreakdown title="Internal Links Breakdown" factors={breakdown.links} />}
          </div>

          {/* Entities + Topics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Entity Map</CardTitle>
                <CardDescription>Visual entity density graph</CardDescription>
              </CardHeader>
              <CardContent>
                {audit.entities.length > 0 ? (
                  <>
                    <EntityGraph entities={audit.entities} />
                    <Table className="mt-4">
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead>Entity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Mentions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audit.entities.map((entity) => (
                        <TableRow key={entity.id} className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableCell className="font-medium text-zinc-300">{entity.name}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                              {entity.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-zinc-400">{entity.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">No entities found.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Topical Clusters</CardTitle>
                <CardDescription>Primary, secondary, and supporting topics</CardDescription>
              </CardHeader>
              <CardContent>
                {audit.topics.length > 0 ? (
                  <div className="space-y-4">
                    {audit.topics.map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-zinc-300 font-medium">{topic.name}</span>
                          <span className="ml-2 text-xs text-purple-400">{topic.type}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: `${topic.relevance * 100}%` }} />
                          </div>
                          <span className="text-xs text-zinc-500 w-8 text-right">{Math.round(topic.relevance * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No topic clusters identified.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {audit.reports[0]?.summary && (
            <Card className="bg-zinc-900/50 border-zinc-800 print:border-gray-300">
              <CardHeader><CardTitle>Report Summary</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-zinc-300">{audit.reports[0].summary}</p></CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
