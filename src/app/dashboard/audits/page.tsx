import { getUserAuditsList } from "@/app/actions/audit";
import { requireUser } from "@/lib/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuditListItem } from "@/components/AuditListItem";

export default async function AuditsPage() {
  const user = await requireUser();
  const audits = await getUserAuditsList(user.id, 100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            My Audits
          </h1>
          <p className="text-muted-foreground mt-1">All audits with total GEO scores.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
            New Audit
          </Button>
        </Link>
      </div>

      {audits.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No audits found.</p>
          <Link href="/dashboard/new">
            <Button className="bg-purple-600 hover:bg-purple-700">Run Your First Audit</Button>
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
              date={new Date(audit.createdAt).toLocaleString()}
              status={audit.status}
              geoScore={audit.geoScore}
            />
          ))}
        </div>
      )}
    </div>
  );
}
