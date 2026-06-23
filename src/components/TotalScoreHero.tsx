import { GeoScoreRing } from "./GeoScoreRing";
import { cn } from "@/lib/utils";

interface ScoreItem {
  label: string;
  score: number | null;
  icon?: string;
}

export function TotalScoreHero({
  totalScore,
  title,
  subtitle,
  scores,
  className,
}: {
  totalScore: number | null;
  title?: string;
  subtitle?: string;
  scores: ScoreItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-zinc-950/80 p-8",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        <GeoScoreRing score={totalScore} size="xl" label="Total GEO Score" />

        <div className="flex-1 w-full space-y-4">
          {title && <h2 className="text-xl font-bold text-zinc-100">{title}</h2>}
          {subtitle && <p className="text-sm text-zinc-400 break-all">{subtitle}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {scores.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-3 text-center hover:bg-white/8 transition-colors"
              >
                <p className="text-[11px] text-zinc-400 uppercase tracking-wide mb-1 truncate">{item.label}</p>
                <p className={cn(
                  "text-2xl font-bold",
                  item.score === null ? "text-zinc-600" :
                  item.score >= 80 ? "text-green-400" :
                  item.score >= 60 ? "text-yellow-400" : "text-red-400"
                )}>
                  {item.score ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
