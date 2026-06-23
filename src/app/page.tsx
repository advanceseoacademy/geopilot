import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/LandingNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-[family-name:var(--font-geist-sans)]">
      <LandingNav />

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 py-24">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            The Future of Search Optimization
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 leading-tight">
            Optimize for the <br /> Answer Engine Era
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Traditional SEO is dying. Generative Engine Optimization (GEO) is the new standard.
            Analyze, score, and perfect your content for AI search engines without paying for expensive APIs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Start Free Audit
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-zinc-800 hover:bg-zinc-900 text-zinc-300">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-24 relative z-10">
          {[
            { title: "Entity Map Extraction", desc: "Extract and analyze semantic entities to ensure AI engines understand your relevance.", color: "indigo" },
            { title: "E-E-A-T Validation", desc: "Verify Experience, Expertise, Authoritativeness, and Trustworthiness through automated scoring.", color: "purple" },
            { title: "Detailed PDF Reports", desc: "Generate comprehensive audit reports with actionable GEO recommendations.", color: "blue" },
          ].map((f) => (
            <div key={f.title} className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-purple-500/50 transition-all backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} GeoPilot. No external APIs used. Completely Local Scoring.
      </footer>
    </div>
  );
}
