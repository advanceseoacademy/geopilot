import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const user = await requireUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const [users, audits, schedules, recentAudits] = await Promise.all([
    db.user.count(),
    db.audit.count(),
    db.scheduledAudit.count({ where: { active: true } }),
    db.audit.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        url: true,
        status: true,
        geoScore: true,
        project: { select: { user: { select: { email: true } } } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{users}</div></CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Audits</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{audits}</div></CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Schedules</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{schedules}</div></CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border">
        <CardHeader><CardTitle>Recent Audits</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recentAudits.map((a) => (
            <div key={a.id} className="flex justify-between text-sm py-2 border-b border-border">
              <span className="truncate">{a.url}</span>
              <span className="text-muted-foreground">{a.project.user.email}</span>
              <span className={a.status === "COMPLETED" ? "text-green-400" : "text-yellow-400"}>{a.status}</span>
              <span className="text-purple-400 font-bold">{a.geoScore ?? "—"}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
