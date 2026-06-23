"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuditProgress({ auditId }: { auditId: string }) {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("Starting...");
  const [status, setStatus] = useState("PROCESSING");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/audit/${auditId}/progress`);
      if (!res.ok) return;
      const data = await res.json();
      setProgress(data.progress || 0);
      setMsg(data.progressMsg || "");
      setStatus(data.status);
      if (data.status === "COMPLETED") {
        clearInterval(interval);
        router.push(`/dashboard/audit/${auditId}`);
      } else if (data.status === "FAILED") {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [auditId, router]);

  if (status === "FAILED") {
    return <p className="text-red-400 text-sm">Audit failed. Please try again.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{msg}</span>
        <span className="text-purple-400 font-medium">{progress}%</span>
      </div>
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
