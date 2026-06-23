"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createShareLink } from "@/app/actions/share";
import { Share2 } from "lucide-react";

export function ShareButton({ auditId }: { auditId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    setLoading(true);
    const result = await createShareLink(auditId);
    setLoading(false);
    if (result.success && result.url) {
      const full = `${window.location.origin}${result.url}`;
      setUrl(full);
      await navigator.clipboard.writeText(full);
    }
  }

  return (
    <div>
      <Button variant="outline" size="sm" onClick={handleShare} disabled={loading} className="border-border">
        <Share2 className="h-4 w-4 mr-2" />
        {loading ? "Creating..." : "Share Report"}
      </Button>
      {url && <p className="text-xs text-green-400 mt-2">Link copied: {url}</p>}
    </div>
  );
}
