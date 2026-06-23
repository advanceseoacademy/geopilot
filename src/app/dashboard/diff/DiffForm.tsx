"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DiffForm({
  audits,
}: {
  audits: { id: string; url: string; title: string | null; createdAt: string }[];
}) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const a = fd.get("auditA") as string;
    const b = fd.get("auditB") as string;
    if (a && b) router.push(`/dashboard/diff?a=${a}&b=${b}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg bg-card/50">
      <select name="auditA" required className="flex-1 h-9 rounded-lg border border-border bg-zinc-950 px-3 text-sm">
        <option value="">Older audit...</option>
        {audits.map((a) => (
          <option key={a.id} value={a.id}>{a.title || a.url} — {new Date(a.createdAt).toLocaleDateString()}</option>
        ))}
      </select>
      <select name="auditB" required className="flex-1 h-9 rounded-lg border border-border bg-zinc-950 px-3 text-sm">
        <option value="">Newer audit...</option>
        {audits.map((a) => (
          <option key={a.id} value={a.id}>{a.title || a.url} — {new Date(a.createdAt).toLocaleDateString()}</option>
        ))}
      </select>
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700 shrink-0">Compare</Button>
    </form>
  );
}
