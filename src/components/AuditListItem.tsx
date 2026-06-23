import Link from "next/link";
import { GeoScoreRing } from "./GeoScoreRing";
import { cn } from "@/lib/utils";

export function AuditListItem({
  id,
  title,
  url,
  date,
  status,
  geoScore,
}: {
  id: string;
  title: string | null;
  url: string;
  date: string;
  status: string;
  geoScore: number | null;
}) {
  return (
    <Link href={`/dashboard/audit/${id}`}>
      <div className="group flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:bg-card/60 hover:border-purple-500/40 transition-all duration-300">
        {status === "COMPLETED" && geoScore !== null ? (
          <GeoScoreRing score={geoScore} size="sm" label="" showGrade={false} />
        ) : (
          <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center shrink-0">
            <span className={cn(
              "text-xs font-medium",
              status === "FAILED" ? "text-red-400" : "text-yellow-400"
            )}>
              {status}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate group-hover:text-purple-300 transition-colors">
            {title || url}
          </h4>
          <p className="text-sm text-muted-foreground truncate">{url}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{date}</p>
        </div>

        {status === "COMPLETED" && geoScore !== null && (
          <div className="hidden sm:block text-right shrink-0">
            <p className="text-xs text-muted-foreground">Total Score</p>
            <p className={cn(
              "text-3xl font-bold tabular-nums",
              geoScore >= 80 ? "text-green-400" : geoScore >= 60 ? "text-yellow-400" : "text-red-400"
            )}>
              {geoScore}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
