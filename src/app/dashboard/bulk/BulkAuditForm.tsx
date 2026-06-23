"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startBulkAudit } from "@/app/actions/bulk";

export function BulkAuditForm() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ url: string; auditId?: string; error?: string }[] | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await startBulkAudit(formData);
    setLoading(false);
    if (result.success && result.results) setResults(result.results);
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>Bulk URL Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="urls">URLs (one per line, max 20)</Label>
              <textarea
                id="urls"
                name="urls"
                rows={8}
                required
                placeholder={"https://example.com\nhttps://competitor.com\nhttps://another-site.com"}
                className="w-full mt-2 rounded-lg border border-border bg-zinc-950 px-3 py-2 text-sm font-mono"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? "Running bulk audit..." : "Run Bulk Audit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle>Results</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-border">
                <span className="truncate">{r.url}</span>
                {r.auditId ? (
                  <a href={`/dashboard/audit/${r.auditId}`} className="text-purple-400 hover:underline">View</a>
                ) : (
                  <span className="text-red-400">{r.error}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
