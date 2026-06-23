"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function createTeam(formData: FormData) {
  const session = await requireSession();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { success: false, error: "Team name is required" };

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let attempt = 0;
  while (await db.team.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const team = await db.team.create({
    data: {
      name,
      slug,
      ownerId: session.user.id,
      members: {
        create: { userId: session.user.id, role: "owner" },
      },
    },
  });

  revalidatePath("/dashboard/team");
  return { success: true, teamId: team.id };
}

export async function inviteTeamMember(formData: FormData) {
  const session = await requireSession();
  const teamId = formData.get("teamId") as string;
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!teamId || !email) return { success: false, error: "Team and email required" };

  const membership = await db.teamMember.findFirst({
    where: { teamId, team: { ownerId: session.user.id } },
  });
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { success: false, error: "Not authorized to invite members" };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { success: false, error: "User not found. They must sign up first." };

  const existing = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: user.id } },
  });
  if (existing) return { success: false, error: "User is already a team member" };

  await db.teamMember.create({
    data: { teamId, userId: user.id, role: "member" },
  });

  revalidatePath("/dashboard/team");
  return { success: true };
}

export async function getUserTeams(userId: string) {
  return db.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          members: { include: { user: { select: { id: true, name: true, email: true } } } },
          _count: { select: { projects: true, apiKeys: true } },
        },
      },
    },
  });
}
