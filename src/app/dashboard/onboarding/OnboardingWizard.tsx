"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { completeOnboarding } from "@/app/actions/settings";

export function OnboardingWizard() {
  const router = useRouter();

  async function handleComplete() {
    await completeOnboarding();
    router.push("/dashboard/new");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-lg w-full bg-card/50 border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to GeoPilot!</CardTitle>
          <CardDescription>Let&apos;s get you started with GEO optimization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { step: "1", title: "Run Your First Audit", desc: "Enter any URL to get a full GEO analysis with 10+ scores." },
              { step: "2", title: "Review Recommendations", desc: "Get actionable tips to improve AI search visibility." },
              { step: "3", title: "Schedule & Compare", desc: "Set up recurring audits and compare with competitors." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleComplete} className="w-full bg-purple-600 hover:bg-purple-700">
            Get Started — Run First Audit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
