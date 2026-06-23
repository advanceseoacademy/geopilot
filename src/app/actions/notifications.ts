"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({ where: { userId, read: false } });
}

export async function markAllRead() {
  const session = await requireSession();
  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markRead(id: string) {
  const session = await requireSession();
  await db.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });
  return { success: true };
}

export async function fetchMyNotifications() {
  const session = await requireSession();
  return getNotifications(session.user.id);
}

export async function fetchUnreadCount() {
  const session = await requireSession();
  return getUnreadCount(session.user.id);
}
