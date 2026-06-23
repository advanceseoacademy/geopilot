import { getUserAuditsList, getAuditDiff } from "@/app/actions/audit";
import { requireUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiffForm } from "./DiffForm";

export default async function DiffPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  const [audits, diff] = await Promise.all([
    getUserAuditsList(user.id, 100),
    params.a && params.b ? getAuditDiff(params.a, params.b) : Promise.resolve(null),
  ]);

  const completed = audits.filter((a) => a.status === "COMPLETED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit History Diff</h1>
        <p className="text-muted-foreground">Compare how scores changed between two audits of the same site.</p>
      </div>

      <DiffForm audits={completed.map((a) => ({ id: a.id, url: a.url, title: a.title, createdAt: a.createdAt.toISOString() }))} />

      {diff && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Score Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diff.diff.map((d) => (
                <div key={d.metric} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm capitalize">{d.metric}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{d.before ?? "—"}</span>
                    <span>→</span>
                    <span className="font-medium">{d.after ?? "—"}</span>
                    <span className={`font-bold ${(d.change || 0) > 0 ? "text-green-400" : (d.change || 0) < 0 ? "text-red-400" : "text-zinc-400"}`}>
                      {(d.change || 0) > 0 ? "+" : ""}{d.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
