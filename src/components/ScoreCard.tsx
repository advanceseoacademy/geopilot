import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ScoreCard({
  label,
  score,
  large,
  className,
}: {
  label: string;
  score: number | null;
  large?: boolean;
  className?: string;
}) {
  const getColor = (s: number | null) => {
    if (s === null) return { text: "text-zinc-500", bar: "bg-zinc-700" };
    if (s >= 80) return { text: "text-green-400", bar: "bg-green-500" };
    if (s >= 60) return { text: "text-yellow-400", bar: "bg-yellow-500" };
    return { text: "text-red-400", bar: "bg-red-500" };
  };

  const colors = getColor(score);

  return (
    <Card className={cn(
      "bg-card/40 border-border/60 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className={cn("font-bold tabular-nums", colors.text, large ? "text-4xl" : "text-2xl")}>
            {score ?? "—"}
          </span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", colors.bar)}
            style={{ width: `${score ?? 0}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
