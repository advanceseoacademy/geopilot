"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { randomBytes } from "crypto";

export async function createShareLink(auditId: string) {
  const session = await requireSession();

  const audit = await db.audit.findUnique({
    where: { id: auditId },
    include: { project: true },
  });

  if (!audit || audit.project.userId !== session.user.id) {
    return { success: false, error: "Audit not found" };
  }

  const token = randomBytes(16).toString("hex");

  await db.sharedAudit.upsert({
    where: { auditId },
    create: { auditId, token },
    update: { token },
  });

  return { success: true, url: `/share/${token}` };
}

export async function getSharedAudit(token: string) {
  const { getCachedSharedAudit } = await import("@/lib/share-cache");
  return getCachedSharedAudit(token);
}
