import { getSharedAudit } from "@/app/actions/share";
import { notFound } from "next/navigation";
import { TotalScoreHero } from "@/components/TotalScoreHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PublicSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const shared = await getSharedAudit(token);
  if (!shared) return notFound();

  const audit = shared.audit;
  const recommendations = (audit.recommendations as { title: string; description: string; priority: string }[]) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-950/10 to-background p-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <p className="text-sm text-purple-400 mb-2 font-medium tracking-wide uppercase">GeoPilot Shared Report</p>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          {audit.title || "GEO Audit Report"}
        </h1>
      </div>

      <TotalScoreHero
        totalScore={audit.geoScore}
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

      {recommendations.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle>Top Recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recommendations.slice(0, 8).map((r, i) => (
              <div key={i} className="text-sm">
                <span className="text-purple-400 font-medium">[{r.priority}]</span> {r.title}
                <p className="text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Powered by GeoPilot — Generative Engine Optimization Platform
      </p>
    </div>
  );
}
