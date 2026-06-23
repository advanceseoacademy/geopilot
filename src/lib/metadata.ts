import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GeoPilot — Generative Engine Optimization Platform",
    template: "%s | GeoPilot",
  },
  description:
    "Analyze any website for AI search readiness. GEO scores, entity analysis, E-E-A-T validation, and actionable recommendations — no paid APIs.",
  keywords: ["GEO", "Generative Engine Optimization", "AI SEO", "Answer Engine Optimization"],
  openGraph: {
    type: "website",
    siteName: "GeoPilot",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function pageMetadata(overrides: Metadata): Metadata {
  return { ...siteMetadata, ...overrides };
}
