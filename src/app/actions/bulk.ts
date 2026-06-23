"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { runGeoAuditForUser } from "@/app/actions/audit";
import { revalidatePath } from "next/cache";

export async function startBulkAudit(formData: FormData) {
  const session = await requireSession();
  const csv = formData.get("urls") as string;
  if (!csv?.trim()) return { success: false, error: "No URLs provided" };

  const urls = csv
    .split(/[\n,]/)
    .map((u) => u.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (urls.length === 0) return { success: false, error: "No valid URLs" };

  const job = await db.bulkJob.create({
    data: { userId: session.user.id, urls, status: "PROCESSING" },
  });

  const results: { url: string; auditId?: string; error?: string }[] = [];

  for (const url of urls) {
    const result = await runGeoAuditForUser(url, session.user.id);
    results.push({
      url,
      auditId: result.success && "auditId" in result ? result.auditId : undefined,
      error: result.success ? undefined : result.error,
    });
  }

  await db.bulkJob.update({
    where: { id: job.id },
    data: { status: "COMPLETED", results },
  });

  revalidatePath("/dashboard/bulk");
  return { success: true, jobId: job.id, results };
}

export async function getUserBulkJobs(userId: string) {
  return db.bulkJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
