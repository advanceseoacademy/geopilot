"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold tracking-tighter">GP</span>
        </div>
        <span className="text-xl font-bold tracking-tight">GeoPilot</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </Link>
        <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
          Features
        </Link>
        <Link href="/#geo-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
          Guide
        </Link>
        <Link href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
          FAQ
        </Link>
        <ThemeToggle />
        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Login
        </Link>
        <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), "bg-primary text-primary-foreground hover:bg-primary/90")}>
          Get Started
        </Link>
      </div>
    </nav>
  );
}
