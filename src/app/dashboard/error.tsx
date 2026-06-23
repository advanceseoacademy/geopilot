"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 px-6">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground text-sm max-w-md">
        This page failed to load. If you just deployed, the database may need to sync.
        Try again or go back to the dashboard.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} className="bg-purple-600 hover:bg-purple-700">
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
