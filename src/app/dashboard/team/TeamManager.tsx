"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createTeam, inviteTeamMember } from "@/app/actions/team";
import { useRouter } from "next/navigation";

interface TeamData {
  id: string;
  role: string;
  team: {
    id: string;
    name: string;
    slug: string;
    members: { id: string; role: string; user: { name: string; email: string } }[];
    _count: { projects: number; apiKeys: number };
  };
}

export function TeamManager({ teams }: { teams: TeamData[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.team.id || "");
  const router = useRouter();

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("name", teamName);
    const result = await createTeam(formData);
    setLoading(false);
    if (result.success) {
      setTeamName("");
      router.refresh();
    } else {
      setError(result.error || "Failed to create team");
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeam) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("teamId", selectedTeam);
    formData.set("email", inviteEmail);
    const result = await inviteTeamMember(formData);
    setLoading(false);
    if (result.success) {
      setInviteEmail("");
      router.refresh();
    } else {
      setError(result.error || "Failed to invite");
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
          <CardDescription>Collaborate with others on GEO audits.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="flex gap-3">
            <Input
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="bg-zinc-950 border-zinc-800"
            />
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 shrink-0">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      {teams.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Invite Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <Label>Team</Label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full mt-1 h-9 rounded-lg border border-border bg-zinc-950 px-3 text-sm"
                >
                  {teams.map((t) => (
                    <option key={t.team.id} value={t.team.id}>{t.team.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="member@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="bg-zinc-950 border-zinc-800"
                />
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 shrink-0">
                  Invite
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {teams.map(({ team, role }) => (
        <Card key={team.id} className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>/{team.slug} · Your role: {role}</CardDescription>
              </div>
              <span className="text-xs text-muted-foreground">
                {team._count.projects} projects · {team._count.apiKeys} API keys
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {team.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{m.user.name}</p>
                    <p className="text-xs text-muted-foreground">{m.user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">{m.role}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {teams.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No teams yet. Create one to collaborate.</p>
      )}
    </div>
  );
}
