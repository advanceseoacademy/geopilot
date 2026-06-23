"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CompareForm({
  audits,
}: {
  audits: { id: string; url: string; title: string | null; geoScore: number | null }[];
}) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const selected = Array.from(form.querySelectorAll<HTMLInputElement>("input[name=audit]:checked")).map(
      (el) => el.value
    );
    if (selected.length < 2) return;
    router.push(`/dashboard/compare?ids=${selected.join(",")}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
      <p className="text-sm text-muted-foreground">Select 2-3 audits to compare:</p>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {audits.map((a) => (
          <label key={a.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer">
            <input type="checkbox" name="audit" value={a.id} className="accent-purple-600" />
            <span className="flex-1 text-sm truncate">{a.title || a.url}</span>
            <span className="text-purple-400 font-bold">{a.geoScore}</span>
          </label>
        ))}
      </div>
      {audits.length < 2 && <p className="text-sm text-yellow-400">Run at least 2 audits first.</p>}
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={audits.length < 2}>
        Compare Selected
      </Button>
    </form>
  );
}
