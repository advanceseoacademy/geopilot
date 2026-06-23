export async function sendWebhook(url: string, payload: Record<string, unknown>) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Webhook failed:", e);
  }
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) {
  const { db } = await import("@/lib/db");
  await db.notification.create({
    data: { userId, title, message, type, link },
  });
}
