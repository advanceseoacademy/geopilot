"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function updateProfile(formData: FormData) {
  const session = await requireSession();
  const name = formData.get("name") as string;

  if (!name?.trim()) {
    return { success: false, error: "Name is required" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: name.trim(), updatedAt: new Date() },
  });

  return { success: true };
}
