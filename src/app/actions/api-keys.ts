"use server";

import { db } from "@/lib/db";
import { generateApiKey } from "@/lib/api-key";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createApiKey(formData: FormData) {
  const session = await requireSession();
  const name = (formData.get("name") as string)?.trim() || "Default";
  const teamId = (formData.get("teamId") as string) || null;

  if (teamId) {
    const member = await db.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: session.user.id } },
    });
    if (!member) return { success: false, error: "Not a team member" };
  }

  const { key, keyHash, keyPrefix } = generateApiKey();

  await db.apiKey.create({
    data: {
      name,
      keyHash,
      keyPrefix,
      userId: session.user.id,
      teamId,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, key };
}

export async function deleteApiKey(keyId: string) {
  const session = await requireSession();

  const apiKey = await db.apiKey.findFirst({
    where: { id: keyId, userId: session.user.id },
  });
  if (!apiKey) return { success: false, error: "API key not found" };

  await db.apiKey.delete({ where: { id: keyId } });
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function getUserApiKeys(userId: string) {
  return db.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      teamId: true,
      lastUsed: true,
      createdAt: true,
      team: { select: { name: true } },
    },
  });
}
