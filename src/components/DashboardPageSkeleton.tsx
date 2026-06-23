export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted/60 rounded-lg" />
        <div className="h-4 w-64 bg-muted/40 rounded" />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/20 p-8">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] items-center">
          <div className="w-[180px] h-[180px] rounded-full bg-muted/50 mx-auto" />
          <div className="space-y-4">
            <div className="h-6 w-56 bg-muted/50 rounded" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-xl" />
              ))}
            </div>
            <div className="h-20 bg-muted/20 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/20 border border-border/40" />
        ))}
      </div>
    </div>
  );
}
