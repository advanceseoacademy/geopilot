import { getUserApiKeys } from "@/app/actions/api-keys";
import { getUserSettings } from "@/app/actions/settings";
import { requireUser } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeyManager } from "./ApiKeyManager";
import { SettingsForms } from "./SettingsForms";

export default async function SettingsPage() {
  const user = await requireUser();

  let apiKeys: Awaited<ReturnType<typeof getUserApiKeys>> = [];
  let settings: Awaited<ReturnType<typeof getUserSettings>> | null = null;
  let dbError: string | null = null;

  try {
    [apiKeys, settings] = await Promise.all([
      getUserApiKeys(user.id),
      getUserSettings(user.id),
    ]);
  } catch (error) {
    console.error("Settings page DB error:", error);
    dbError = "Database tables are not synced. Please run prisma db push or sync-missing-tables.sql in Supabase.";
  }

  if (dbError || !settings) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Settings unavailable</h1>
        <p className="text-muted-foreground text-sm">{dbError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">API keys, scoring weights, webhooks, and branding.</p>
      </div>

      <SettingsForms settings={{
        scoringWeights: settings.scoringWeights as Record<string, number> | null,
        webhookUrl: settings.webhookUrl,
        notifyOnComplete: settings.notifyOnComplete,
        brandName: settings.brandName,
        brandLogoUrl: settings.brandLogoUrl,
      }} />

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>REST API access for programmatic audits.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyManager keys={apiKeys.map((k) => ({
            ...k,
            createdAt: k.createdAt.toISOString(),
            lastUsed: k.lastUsed?.toISOString() ?? null,
          }))} />
        </CardContent>
      </Card>
    </div>
  );
}
