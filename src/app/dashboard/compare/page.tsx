import { getUserAuditsList, compareAudits } from "@/app/actions/audit";
import { requireUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompareForm } from "./CompareForm";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const ids = params.ids?.split(",").filter(Boolean).slice(0, 3) ?? [];

  const [audits, comparison] = await Promise.all([
    getUserAuditsList(user.id, 100),
    ids.length > 0 ? compareAudits(ids) : Promise.resolve(null),
  ]);

  const completed = audits.filter((a) => a.status === "COMPLETED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Competitor Comparison</h1>
        <p className="text-muted-foreground">Compare GEO scores across multiple websites side-by-side.</p>
      </div>

      <CompareForm audits={completed.map((a) => ({ id: a.id, url: a.url, title: a.title, geoScore: a.geoScore }))} />

      {comparison && comparison.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {comparison.map((audit) => (
            <Card key={audit.id} className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-base truncate">{audit.title || audit.url}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-4xl font-bold text-purple-400">{audit.geoScore}</div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>AI: {audit.aiReadinessScore}</span>
                  <span>E-E-A-T: {audit.eeatScore}</span>
                  <span>Authority: {audit.authorityScore}</span>
                  <span>Entity: {audit.entityScore}</span>
                  <span>Citation: {audit.citationScore}</span>
                  <span>FAQ: {audit.faqScore}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
