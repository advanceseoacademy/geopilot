import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a free GeoPilot account. Run GEO audits, get AI readiness scores, entity analysis, and PDF reports.",
  robots: { index: true, follow: true },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignupForm />
    </div>
  );
}
