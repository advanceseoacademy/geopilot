import { cn } from "@/lib/utils";

function getGrade(score: number | null) {
  if (score === null) return { label: "N/A", color: "text-zinc-500" };
  if (score >= 80) return { label: "Excellent", color: "text-green-400" };
  if (score >= 60) return { label: "Good", color: "text-yellow-400" };
  if (score >= 40) return { label: "Fair", color: "text-orange-400" };
  return { label: "Poor", color: "text-red-400" };
}

function getRingColor(score: number | null) {
  if (score === null) return "#71717a";
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function GeoScoreRing({
  score,
  size = "lg",
  label = "Total GEO Score",
  showGrade = true,
  className,
}: {
  score: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  showGrade?: boolean;
  className?: string;
}) {
  const grade = getGrade(score);
  const value = score ?? 0;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;

  const sizes = {
    sm: { ring: 80, text: "text-xl", sub: "text-[10px]" },
    md: { ring: 110, text: "text-3xl", sub: "text-xs" },
    lg: { ring: 140, text: "text-5xl", sub: "text-sm" },
    xl: { ring: 180, text: "text-6xl", sub: "text-base" },
  };
  const s = sizes[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: s.ring, height: s.ring }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-800/80" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getRingColor(score)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${getRingColor(score)}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold tracking-tight", s.text, grade.color)}>
            {score ?? "—"}
          </span>
          <span className={cn("text-muted-foreground", s.sub)}>/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("font-semibold", size === "sm" ? "text-xs" : "text-sm")}>{label}</p>
        {showGrade && score !== null && (
          <p className={cn("text-xs font-medium mt-0.5", grade.color)}>{grade.label}</p>
        )}
      </div>
    </div>
  );
}
