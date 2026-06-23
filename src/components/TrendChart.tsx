export function TrendChart({ scores }: { scores: number[] }) {
  if (!scores.length) {
    return <div className="text-sm text-muted-foreground">Run more audits to see trends</div>;
  }

  const max = Math.max(...scores, 1);

  return (
    <div className="flex items-end gap-2 h-20">
      {[...scores].reverse().map((score, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-indigo-500 transition-all hover:from-purple-500 hover:to-indigo-400 opacity-80 group-hover:opacity-100"
            style={{ height: `${Math.max(8, (score / max) * 100)}%`, minHeight: "8px" }}
            title={`Score: ${score}`}
          />
          <span className="text-[10px] text-muted-foreground font-medium">{score}</span>
        </div>
      ))}
    </div>
  );
}
