import { getUserTeams } from "@/app/actions/team";
import { requireUser } from "@/lib/session";
import { TeamManager } from "./TeamManager";

export default async function TeamPage() {
  const user = await requireUser();
  const teams = await getUserTeams(user.id);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">Manage your team and collaborate on GEO audits.</p>
      </div>
      <TeamManager teams={teams} />
    </div>
  );
}
