import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/LandingNav";
import { HomeMarketing } from "@/components/landing/HomeMarketing";
import { HomeJsonLd } from "@/components/landing/HomeJsonLd";
import { getSiteUrl } from "@/lib/seo/landing-content";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "GeoPilot — #1 Generative Engine Optimization (GEO) Audit Tool",
  description:
    "Analyze your website for AI search readiness. Free GEO audit tool with entity analysis, E-E-A-T scoring, AI bot access checks, and PDF reports. Optimize for ChatGPT, Perplexity & Google AI Overviews.",
  keywords: [
    "generative engine optimization",
    "GEO audit tool",
    "GEO score",
    "AI SEO",
    "answer engine optimization",
    "ChatGPT SEO",
    "Perplexity optimization",
    "Google AI Overviews SEO",
    "AI search optimization",
    "entity SEO",
    "E-E-A-T audit",
    "AI readiness score",
    "GEO platform",
    "GEO software",
    "GEO checklist",
    "AI citation optimization",
  ],
  openGraph: {
    title: "GeoPilot — Generative Engine Optimization Platform",
    description:
      "The complete GEO audit platform. Score your website for AI search engines, extract entities, validate E-E-A-T, and get actionable recommendations.",
    type: "website",
    siteName: "GeoPilot",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoPilot — GEO Audit Tool for AI Search",
    description: "Optimize your website for ChatGPT, Perplexity, and AI answer engines. Free GEO audit.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-[family-name:var(--font-geist-sans)]">
      <HomeJsonLd />
      <LandingNav />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none" />

        <section className="flex flex-col items-center justify-center px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 py-24">
            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-sm mb-4">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse" />
              #1 Generative Engine Optimization Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 leading-tight">
              GEO Audit Tool for <br />
              AI Search Engines
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              GeoPilot is the all-in-one <strong className="text-zinc-200">Generative Engine Optimization</strong> platform.
              Analyze your website for ChatGPT, Perplexity, Google AI Overviews, and Bing Copilot — get your GEO score,
              entity map, and actionable recommendations. No paid APIs required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  Start Free GEO Audit
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-zinc-800 hover:bg-zinc-900 text-zinc-300">
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="text-xs text-zinc-500">
              Free GEO audit · No credit card · 10+ scores · PDF reports · Entity analysis
            </p>
          </div>
        </section>

        <HomeMarketing />
      </main>

      <footer className="border-t border-zinc-800 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <p className="font-bold text-lg">GeoPilot</p>
            <p className="text-zinc-500 leading-relaxed">
              The Generative Engine Optimization platform for AI search visibility.
            </p>
          </div>
          <div>
            <p className="font-semibold text-zinc-300 mb-3">Product</p>
            <ul className="space-y-2 text-zinc-500">
              <li><Link href="/signup" className="hover:text-purple-400 transition-colors">GEO Audit</Link></li>
              <li><Link href="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-300 mb-3">Learn</p>
            <ul className="space-y-2 text-zinc-500">
              <li><a href="#what-is-geo" className="hover:text-purple-400 transition-colors">What is GEO?</a></li>
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#geo-checklist" className="hover:text-purple-400 transition-colors">GEO Checklist</a></li>
              <li><a href="#faq" className="hover:text-purple-400 transition-colors">GEO FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-300 mb-3">Optimize For</p>
            <ul className="space-y-2 text-zinc-500">
              <li>ChatGPT Search</li>
              <li>Perplexity AI</li>
              <li>Google AI Overviews</li>
              <li>Bing Copilot</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-8">
          &copy; {new Date().getFullYear()} GeoPilot. Generative Engine Optimization Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
