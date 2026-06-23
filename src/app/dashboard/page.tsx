import { getUserStats, getUserAuditsList } from "@/app/actions/audit";
import { getOnboardingStatus } from "@/app/actions/settings";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHero } from "@/components/DashboardHero";
import { AuditListItem } from "@/components/AuditListItem";

export default async function DashboardPage() {
  const user = await requireUser();

  const [onboardingDone, stats, audits] = await Promise.all([
    getOnboardingStatus(user.id),
    getUserStats(user.id),
    getUserAuditsList(user.id, 5),
  ]);

  if (!onboardingDone) redirect("/dashboard/onboarding");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="text-purple-400 font-medium">{user.name}</span>
        </p>
      </div>

      <DashboardHero
        avgScore={stats.avgScore}
        totalAudits={stats.totalAudits}
        entityCount={stats.entityCount}
        recentScores={stats.recentScores}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent Audits</h2>
          <Link href="/dashboard/audits" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View all →
          </Link>
        </div>

        {audits.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/20">
            <div className="w-16 h-16 rounded-full bg-purple-600/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
            <p className="text-muted-foreground mb-6 text-sm">Run your first GEO audit to see your total score.</p>
            <Link href="/dashboard/new">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-900/30">
                Run New Audit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {audits.map((audit) => (
              <AuditListItem
                key={audit.id}
                id={audit.id}
                title={audit.title}
                url={audit.url}
                date={new Date(audit.createdAt).toLocaleDateString()}
                status={audit.status}
                geoScore={audit.geoScore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
