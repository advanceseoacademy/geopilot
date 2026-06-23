"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateScoringWeights, updateWebhook, updateBranding } from "@/app/actions/settings";

const WEIGHT_FIELDS = [
  { key: "aiReadiness", label: "AI Readiness" },
  { key: "citation", label: "Citation" },
  { key: "authority", label: "Authority" },
  { key: "entity", label: "Entity" },
  { key: "eeat", label: "E-E-A-T" },
  { key: "contentStructure", label: "Content Structure" },
  { key: "internalLink", label: "Internal Links" },
  { key: "faq", label: "FAQ" },
];

export function SettingsForms({
  settings,
}: {
  settings: {
    scoringWeights: Record<string, number> | null;
    webhookUrl: string | null;
    notifyOnComplete: boolean;
    brandName: string | null;
    brandLogoUrl: string | null;
  };
}) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const weights = (settings.scoringWeights as Record<string, number>) || {};

  async function handleWeights(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateScoringWeights(new FormData(e.currentTarget));
    setMsg("Scoring weights saved!");
    router.refresh();
  }

  async function handleWebhook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateWebhook(new FormData(e.currentTarget));
    setMsg("Webhook settings saved!");
    router.refresh();
  }

  async function handleBranding(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateBranding(new FormData(e.currentTarget));
    setMsg("Branding saved!");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {msg && <p className="text-sm text-green-400">{msg}</p>}

      <form onSubmit={handleWeights} className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
        <h3 className="font-medium">Custom Scoring Weights (%)</h3>
        <div className="grid grid-cols-2 gap-4">
          {WEIGHT_FIELDS.map((f) => (
            <div key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                name={f.key}
                type="number"
                min={0}
                max={100}
                defaultValue={Math.round((weights[f.key] || 0) * 100) || undefined}
                placeholder={f.key === "aiReadiness" ? "20" : "10"}
                className="bg-zinc-950 border-zinc-800 mt-1"
              />
            </div>
          ))}
        </div>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Weights</Button>
      </form>

      <form onSubmit={handleWebhook} className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
        <h3 className="font-medium">Webhook & Notifications</h3>
        <div>
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input id="webhookUrl" name="webhookUrl" defaultValue={settings.webhookUrl || ""} placeholder="https://your-app.com/webhook" className="bg-zinc-950 border-zinc-800 mt-1" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="notifyOnComplete" defaultChecked={settings.notifyOnComplete} className="accent-purple-600" />
          In-app notification when audit completes
        </label>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save</Button>
      </form>

      <form onSubmit={handleBranding} className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
        <h3 className="font-medium">White-label Branding</h3>
        <div>
          <Label htmlFor="brandName">Brand Name</Label>
          <Input id="brandName" name="brandName" defaultValue={settings.brandName || ""} className="bg-zinc-950 border-zinc-800 mt-1" />
        </div>
        <div>
          <Label htmlFor="brandLogoUrl">Logo URL</Label>
          <Input id="brandLogoUrl" name="brandLogoUrl" defaultValue={settings.brandLogoUrl || ""} className="bg-zinc-950 border-zinc-800 mt-1" />
        </div>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Branding</Button>
      </form>
    </div>
  );
}
