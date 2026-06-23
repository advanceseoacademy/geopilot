import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your GeoPilot account to run GEO audits, view reports, and track AI search optimization scores.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <LoginForm />
    </div>
  );
}
