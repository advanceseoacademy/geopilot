import { GeoScoreRing } from "@/components/GeoScoreRing";
import { TrendChart } from "@/components/TrendChart";
import { cn } from "@/lib/utils";

export function DashboardHero({
  avgScore,
  totalAudits,
  entityCount,
  recentScores,
}: {
  avgScore: number;
  totalAudits: number;
  entityCount: number;
  recentScores: number[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-background p-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] items-center">
        <GeoScoreRing
          score={totalAudits > 0 ? avgScore : null}
          size="xl"
          label="Average Total Score"
        />

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Your GEO Performance</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {totalAudits === 0
                ? "Run your first audit to see your total GEO score"
                : `${totalAudits} audits completed · ${entityCount} entities analyzed`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Audits", value: totalAudits, color: "text-foreground" },
              { label: "Avg Score", value: totalAudits > 0 ? `${avgScore}/100` : "—", color: "text-purple-400" },
              { label: "Entities", value: entityCount, color: "text-indigo-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          {recentScores.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Score Trend</p>
              <TrendChart scores={recentScores} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
