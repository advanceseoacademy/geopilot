import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Recommendation {
  category: string;
  priority: string;
  title: string;
  description: string;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  if (!recommendations.length) {
    return <p className="text-sm text-zinc-500">No recommendations — great job!</p>;
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div
          key={i}
          className="flex gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800"
        >
          <span
            className={`shrink-0 text-xs font-medium px-2 py-1 rounded border h-fit ${priorityColors[rec.priority] || priorityColors.medium}`}
          >
            {rec.priority}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-400 font-medium">{rec.category}</span>
            </div>
            <p className="font-medium text-zinc-200 text-sm mt-0.5">{rec.title}</p>
            <p className="text-sm text-zinc-400 mt-1">{rec.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScoreBreakdown({
  title,
  factors,
}: {
  title: string;
  factors: { label: string; score: number; maxScore: number; explanation: string }[];
}) {
  if (!factors?.length) return null;

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Explainable score factors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {factors.map((factor, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-300">{factor.label}</span>
              <span className="text-zinc-400">
                {factor.score}/{factor.maxScore}
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (factor.score / factor.maxScore) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">{factor.explanation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
