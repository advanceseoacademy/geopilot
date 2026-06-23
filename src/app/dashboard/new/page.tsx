"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startAudit } from "@/app/actions/audit";
import { AuditProgress } from "@/components/AuditProgress";

export default function NewAuditPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auditId, setAuditId] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await startAudit(formData);

    if (result.success && "auditId" in result && result.auditId) {
      setAuditId(result.auditId);
    } else {
      setError(result.error || "Failed to run audit");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Run GEO Audit</CardTitle>
          <CardDescription>
            Multi-page crawl (up to 50 pages), sitemap parsing, robots.txt & AI bot analysis included.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditId ? (
            <AuditProgress auditId={auditId} />
          ) : (
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://example.com"
                  required
                  type="url"
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
              {error && (
                <div className="text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? "Starting audit..." : "Analyze Website"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
