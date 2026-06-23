"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Printer } from "lucide-react";

export function PrintButton({ auditId }: { auditId: string }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/report/${auditId}/pdf`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to generate PDF" }));
        alert(err.error || "Failed to download PDF");
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] || `geopilot-audit-${auditId.slice(0, 8)}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="print:hidden border-zinc-700"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button
        className="bg-purple-600 hover:bg-purple-700 print:hidden"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {downloading ? "Generating..." : "Download PDF"}
      </Button>
    </div>
  );
}
