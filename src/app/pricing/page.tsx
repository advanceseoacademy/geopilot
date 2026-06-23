import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying GeoPilot",
    features: ["5 audits per month", "Basic GEO scores", "Entity extraction", "PDF report export", "Email support"],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    features: ["Unlimited audits", "All 10 score metrics", "Full recommendations", "Audit history", "Priority support", "Trend analytics"],
    cta: "Start Pro Trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For agencies and teams",
    features: ["Everything in Pro", "Team accounts", "API access", "White-label reports", "Dedicated support", "Custom integrations"],
    cta: "Contact Sales",
    href: "/signup",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold tracking-tighter text-xs">GP</span>
          </div>
          <span className="text-xl font-bold tracking-tight">GeoPilot</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white">Login</Link>
          <Link href="/signup" className={cn(buttonVariants(), "bg-purple-600 hover:bg-purple-700")}>Sign Up</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-16">
          No paid APIs. No hidden costs. All analysis runs locally on your crawled data.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "bg-zinc-900/50 border-zinc-800 text-left",
                plan.highlighted && "border-purple-500/50 ring-1 ring-purple-500/20"
              )}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-400">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="block">
                  <Button
                    className={cn(
                      "w-full",
                      plan.highlighted ? "bg-purple-600 hover:bg-purple-700" : "bg-zinc-800 hover:bg-zinc-700"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
