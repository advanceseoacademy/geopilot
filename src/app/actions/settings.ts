"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { ScoringWeights } from "@/lib/geo/types";

export async function getUserSettings(userId: string) {
  const settings = await db.userSettings.findUnique({ where: { userId } });
  if (settings) return settings;
  return db.userSettings.create({ data: { userId } });
}

export async function getOnboardingStatus(userId: string) {
  const settings = await db.userSettings.findUnique({
    where: { userId },
    select: { onboardingDone: true },
  });
  return settings?.onboardingDone ?? false;
}

export async function updateScoringWeights(formData: FormData) {
  const session = await requireSession();
  const weights: ScoringWeights = {
    aiReadiness: Number(formData.get("aiReadiness")) / 100,
    citation: Number(formData.get("citation")) / 100,
    authority: Number(formData.get("authority")) / 100,
    entity: Number(formData.get("entity")) / 100,
    eeat: Number(formData.get("eeat")) / 100,
    contentStructure: Number(formData.get("contentStructure")) / 100,
    internalLink: Number(formData.get("internalLink")) / 100,
    faq: Number(formData.get("faq")) / 100,
  };

  const weightsJson = JSON.parse(JSON.stringify(weights));

  await db.userSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, scoringWeights: weightsJson },
    update: { scoringWeights: weightsJson },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateWebhook(formData: FormData) {
  const session = await requireSession();
  const webhookUrl = (formData.get("webhookUrl") as string)?.trim() || null;
  const notifyOnComplete = formData.get("notifyOnComplete") === "on";

  await db.userSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, webhookUrl, notifyOnComplete },
    update: { webhookUrl, notifyOnComplete },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBranding(formData: FormData) {
  const session = await requireSession();
  const brandName = (formData.get("brandName") as string)?.trim() || null;
  const brandLogoUrl = (formData.get("brandLogoUrl") as string)?.trim() || null;

  await db.userSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, brandName, brandLogoUrl },
    update: { brandName, brandLogoUrl },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function completeOnboarding() {
  const session = await requireSession();
  await db.userSettings.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, onboardingDone: true },
    update: { onboardingDone: true },
  });
  return { success: true };
}
