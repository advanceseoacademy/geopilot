"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

function nextRunDate(frequency: string): Date {
  const d = new Date();
  if (frequency === "daily") d.setDate(d.getDate() + 1);
  else if (frequency === "weekly") d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

export async function createSchedule(formData: FormData) {
  const session = await requireSession();
  const url = (formData.get("url") as string)?.trim();
  const frequency = formData.get("frequency") as string;

  if (!url || !["daily", "weekly", "monthly"].includes(frequency)) {
    return { success: false, error: "Invalid input" };
  }

  const targetUrl = url.startsWith("http") ? url : `https://${url}`;

  await db.scheduledAudit.create({
    data: {
      userId: session.user.id,
      url: targetUrl,
      frequency,
      nextRunAt: nextRunDate(frequency),
    },
  });

  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function toggleSchedule(id: string, active: boolean) {
  const session = await requireSession();
  await db.scheduledAudit.updateMany({
    where: { id, userId: session.user.id },
    data: { active },
  });
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function deleteSchedule(id: string) {
  const session = await requireSession();
  await db.scheduledAudit.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function getUserSchedules(userId: string) {
  return db.scheduledAudit.findMany({
    where: { userId },
    orderBy: { nextRunAt: "asc" },
  });
}

export async function runDueSchedules() {
  const due = await db.scheduledAudit.findMany({
    where: { active: true, nextRunAt: { lte: new Date() } },
  });

  const { runGeoAuditForUser } = await import("@/app/actions/audit");
  const { createNotification } = await import("@/lib/notifications");

  for (const schedule of due) {
    try {
      const result = await runGeoAuditForUser(schedule.url, schedule.userId);
      await db.scheduledAudit.update({
        where: { id: schedule.id },
        data: {
          lastRunAt: new Date(),
          nextRunAt: nextRunDate(schedule.frequency),
        },
      });
      if (result.success) {
        await createNotification(
          schedule.userId,
          "Scheduled Audit Complete",
          `Audit finished for ${schedule.url}`,
          "schedule",
          `/dashboard/audit/${result.auditId}`
        );
      }
    } catch (e) {
      console.error("Schedule run failed:", e);
    }
  }

  return { processed: due.length };
}
