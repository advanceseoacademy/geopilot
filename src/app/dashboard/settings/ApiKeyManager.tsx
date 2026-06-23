"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createApiKey, deleteApiKey } from "@/app/actions/api-keys";
import { useRouter } from "next/navigation";

interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  team: { name: string } | null;
  lastUsed: Date | null;
  createdAt: Date;
}

export function ApiKeyManager({ keys }: { keys: ApiKeyRow[] }) {
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.set("name", name);
    const result = await createApiKey(formData);
    setLoading(false);
    if (result.success && result.key) {
      setNewKey(result.key);
      setName("");
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await deleteApiKey(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {newKey && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-sm font-medium text-green-400 mb-2">API key created — copy it now, it won&apos;t be shown again:</p>
          <code className="text-xs bg-zinc-950 p-2 rounded block break-all text-zinc-300">{newKey}</code>
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-3">
        <div className="flex-1">
          <Label htmlFor="keyName" className="sr-only">Key name</Label>
          <Input
            id="keyName"
            placeholder="Key name (e.g. Production)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-950 border-zinc-800"
          />
        </div>
        <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? "Creating..." : "Create API Key"}
        </Button>
      </form>

      {keys.length === 0 ? (
        <p className="text-sm text-muted-foreground">No API keys yet.</p>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div>
                <p className="font-medium text-sm">{key.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{key.keyPrefix}••••••••</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created {new Date(key.createdAt).toLocaleDateString()}
                  {key.lastUsed && ` · Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete(key.id)} className="text-red-400 border-red-500/30">
                Revoke
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-lg bg-zinc-900/50 border border-border text-sm space-y-2">
        <p className="font-medium">API Usage</p>
        <pre className="text-xs text-muted-foreground overflow-x-auto">{`POST /api/v1/audit
Authorization: Bearer gp_your_key_here
Content-Type: application/json

{ "url": "https://example.com" }`}</pre>
        <pre className="text-xs text-muted-foreground overflow-x-auto">{`GET /api/v1/audit/{auditId}
Authorization: Bearer gp_your_key_here`}</pre>
      </div>
    </div>
  );
}
