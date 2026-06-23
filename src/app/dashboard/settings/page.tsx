import { getUserApiKeys } from "@/app/actions/api-keys";
import { getUserSettings } from "@/app/actions/settings";
import { requireUser } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeyManager } from "./ApiKeyManager";
import { SettingsForms } from "./SettingsForms";

export default async function SettingsPage() {
  const user = await requireUser();

  const [apiKeys, settings] = await Promise.all([
    getUserApiKeys(user.id),
    getUserSettings(user.id),
  ]);

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
          <ApiKeyManager keys={apiKeys} />
        </CardContent>
      </Card>
    </div>
  );
}
