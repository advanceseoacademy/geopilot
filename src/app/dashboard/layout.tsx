import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { DashboardPageSkeleton } from "@/components/DashboardPageSkeleton";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const isAdmin = process.env.ADMIN_EMAIL === session.user.email;

  const navLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/audits", label: "Audits" },
    { href: "/dashboard/compare", label: "Compare" },
    { href: "/dashboard/schedule", label: "Schedule" },
    { href: "/dashboard/bulk", label: "Bulk" },
    { href: "/dashboard/team", label: "Team" },
    { href: "/dashboard/settings", label: "Settings" },
    ...(isAdmin ? [{ href: "/dashboard/admin", label: "Admin" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-950/5 to-background flex flex-col font-[family-name:var(--font-geist-sans)]">
      <nav className="border-b border-border/60 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" prefetch={false} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold tracking-tighter text-xs">GP</span>
              </div>
              <span className="text-xl font-bold tracking-tight">GeoPilot</span>
            </Link>
            <div className="hidden lg:flex items-center gap-3 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} prefetch className="hover:text-foreground transition-colors whitespace-nowrap">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{session.user.name}</span>
            <NotificationBell />
            <ThemeToggle />
            <Link href="/dashboard/new" prefetch>
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-purple-900/20">
                New Audit
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Suspense fallback={<DashboardPageSkeleton />}>{children}</Suspense>
      </main>
    </div>
  );
}
