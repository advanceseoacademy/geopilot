import { db } from "@/lib/db";
import { hashApiKey } from "@/lib/api-key";

export async function validateApiKey(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer gp_")) return null;

  const key = authHeader.replace("Bearer ", "").trim();
  const keyHash = hashApiKey(key);

  const apiKey = await db.apiKey.findUnique({
    where: { keyHash },
    include: { user: true, team: true },
  });

  if (!apiKey) return null;

  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date() },
  });

  return apiKey;
}
