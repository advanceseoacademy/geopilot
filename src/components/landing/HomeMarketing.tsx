import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  aiPlatforms,
  geoBenefits,
  geoChecklist,
  landingFaqs,
  scoreMetrics,
} from "@/lib/seo/landing-content";
import {
  Bot,
  Brain,
  CheckCircle2,
  FileText,
  Globe,
  Layers,
  LineChart,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "GEO Score & AI Readiness",
    desc: "Get a 0–100 Generative Engine Optimization score that measures how well your content is structured for ChatGPT, Perplexity, Google AI Overviews, and other answer engines.",
  },
  {
    icon: Layers,
    title: "Entity & Topical Analysis",
    desc: "Extract semantic entities, topical clusters, and knowledge graph signals so AI systems understand what your page is about and when to cite it.",
  },
  {
    icon: Shield,
    title: "E-E-A-T Validation",
    desc: "Automated scoring for Experience, Expertise, Authoritativeness, and Trustworthiness — the trust signals AI search engines use to choose sources.",
  },
  {
    icon: Globe,
    title: "Multi-Page Site Crawl",
    desc: "Crawl up to 50 pages, detect orphan pages, analyze internal links, and map your full site architecture for AI discoverability.",
  },
  {
    icon: Bot,
    title: "AI Bot Access Check",
    desc: "Verify robots.txt allows GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers — blocked bots mean zero AI visibility.",
  },
  {
    icon: FileText,
    title: "PDF Audit Reports",
    desc: "Download professional GEO audit reports with prioritized recommendations your team or clients can act on immediately.",
  },
  {
    icon: LineChart,
    title: "Audit History & Trends",
    desc: "Track GEO score changes over time, compare audits, and measure the impact of your optimization efforts with visual trend charts.",
  },
  {
    icon: Target,
    title: "Competitor Comparison",
    desc: "Benchmark your GEO scores against competitors side-by-side. Identify gaps where rivals outperform you in AI readiness and citation potential.",
  },
];

const steps = [
  { step: "01", title: "Enter your URL", desc: "Paste any website URL. GeoPilot crawls your page and up to 50 internal pages automatically." },
  { step: "02", title: "Get your GEO score", desc: "Receive 10+ scores covering AI readiness, citations, authority, content structure, readability, and FAQ optimization." },
  { step: "03", title: "Fix & re-audit", desc: "Follow prioritized recommendations, implement changes, and re-run audits to track improvement over time." },
];

const audiences = [
  { title: "SEO Agencies", desc: "Offer GEO audits as a new service. White-label reports, bulk CSV audits, and client comparison tools included." },
  { title: "Content Marketers", desc: "Optimize blog posts, landing pages, and resource hubs so AI assistants cite your brand in answers." },
  { title: "SaaS & E-commerce", desc: "Ensure product pages, docs, and help centers rank in AI-generated responses, not just traditional search." },
  { title: "Publishers & Media", desc: "Strengthen entity coverage and E-E-A-T signals so news and editorial content gets picked up by answer engines." },
];

export function HomeMarketing() {
  return (
    <>
      {/* Why GEO Now */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="why-geo">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Generative Engine Optimization Matters in 2026
          </h2>
          <p className="text-zinc-400 mt-4 max-w-3xl mx-auto leading-relaxed">
            Search is fundamentally changing. Users no longer scroll through ten blue links — they ask AI assistants
            for direct answers. If your website is not optimized for generative engines, you are invisible to the
            fastest-growing search channel on the internet.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {geoBenefits.map((b) => (
            <div key={b.title} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-purple-500/30 transition-colors">
              <h3 className="font-semibold text-purple-300 mb-2">{b.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is GEO */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="what-is-geo">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What is <span className="text-purple-400">Generative Engine Optimization</span>?
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Over 40% of searches now involve AI-generated answers. When users ask ChatGPT, Perplexity, or Google AI
              a question, these systems choose which websites to cite. <strong className="text-zinc-200">GEO ensures your site gets chosen.</strong>
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Generative Engine Optimization is the next evolution of search marketing. While SEO fights for position #1
              in a list of links, GEO optimizes your content to become the <em>source</em> that AI engines reference
              in their answers — driving brand visibility, authority, and traffic in the answer engine era.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              GeoPilot is the first dedicated GEO audit platform that scores your website across every dimension AI
              search engines evaluate — from entity clarity and E-E-A-T trust signals to AI crawler accessibility
              and citation-ready content structure.
            </p>
            <ul className="space-y-3">
              {[
                "Entity-rich content AI models can parse",
                "E-E-A-T signals that build citation trust",
                "Schema markup and structured FAQ sections",
                "AI crawler access via robots.txt",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-6">
            <h3 className="text-lg font-semibold text-zinc-100">SEO vs GEO — Key Differences</h3>
            <div className="space-y-4 text-sm">
              {[
                { label: "Goal", seo: "Rank in SERP links", geo: "Get cited in AI answers" },
                { label: "Focus", seo: "Keywords & backlinks", geo: "Entities & topical authority" },
                { label: "Metrics", seo: "Position, CTR, traffic", geo: "Citation rate, AI visibility" },
                { label: "Content", seo: "Optimized for crawlers", geo: "Optimized for LLM comprehension" },
                { label: "Tools", seo: "Google Search Console", geo: "GEO audit platforms like GeoPilot" },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-2 border-b border-zinc-800 pb-3">
                  <span className="text-zinc-500 font-medium">{row.label}</span>
                  <span className="text-zinc-400">{row.seo}</span>
                  <span className="text-purple-300">{row.geo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Platforms */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="ai-platforms">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Optimize for Every AI Search Engine
          </h2>
          <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
            GeoPilot helps you rank across all major answer engines with one comprehensive GEO audit.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {aiPlatforms.map((p) => (
            <div key={p.name} className="p-6 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-indigo-950/20">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{p.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 Scores */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10" id="geo-scores">
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            10 GEO Scores in Every Audit
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {scoreMetrics.map((metric) => (
              <span
                key={metric}
                className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm text-purple-200"
              >
                {metric}
              </span>
            ))}
          </div>
          <p className="text-center text-zinc-400 text-sm mt-8 max-w-2xl mx-auto leading-relaxed">
            Each score measures a specific dimension of AI search readiness. Together they form your
            overall GEO score — the single metric that tells you how likely AI engines are to cite your content.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="features">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Complete GEO Audit Platform
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Everything you need to analyze, score, and improve your website for AI search engines — in one platform.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-purple-500/40 transition-all"
            >
              <f.icon className="h-8 w-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GEO Checklist */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="geo-checklist">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              GEO Optimization Checklist
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Use this checklist to evaluate your current AI search readiness. GeoPilot automates every
              item below and scores your progress — so you know exactly what to fix first.
            </p>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                Run Automated GEO Checklist
              </Button>
            </Link>
          </div>
          <ul className="space-y-3">
            {geoChecklist.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-300"
              >
                <span className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="how-it-works">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How GeoPilot Works</h2>
          <p className="text-zinc-400 mt-3">Run your first GEO audit in under 2 minutes. No credit card required.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto text-lg font-bold">
                {s.step}
              </div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              <Zap className="h-4 w-4 mr-2" />
              Start Your Free GEO Audit
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "GEO Scores per Audit" },
              { value: "50", label: "Pages Crawled per Site" },
              { value: "0", label: "Paid API Costs" },
              { value: "100%", label: "Local Analysis" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-purple-400">{stat.value}</p>
                <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10" id="use-cases">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Who Uses GeoPilot?</h2>
          <p className="text-zinc-400 mt-3">Built for anyone who wants their content cited by AI search engines.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {audiences.map((a) => (
            <div key={a.title} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{a.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Long-form SEO content */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-10" id="geo-guide">
        <article className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400 leading-relaxed">
          <h2 className="text-3xl font-bold text-zinc-100 not-prose">
            The Complete Guide to Generative Engine Optimization
          </h2>
          <p>
            Generative Engine Optimization (GEO) is a new discipline in digital marketing focused on improving
            how AI-powered search systems discover, interpret, and cite your web content. As large language models
            like GPT-4, Claude, and Gemini power search experiences across ChatGPT, Perplexity, Google, and Bing,
            traditional SEO tactics alone are no longer sufficient to maintain online visibility.
          </p>
          <h3 className="text-xl font-semibold text-zinc-200 not-prose">How AI Search Engines Choose Sources</h3>
          <p>
            AI answer engines evaluate pages differently than traditional search crawlers. They prioritize semantic
            entity clarity — whether the page clearly defines the people, organizations, products, and concepts it
            discusses. They assess E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) to filter
            unreliable sources. They favor structured content with FAQ sections, schema markup, and clear heading
            hierarchies that language models can parse efficiently.
          </p>
          <h3 className="text-xl font-semibold text-zinc-200 not-prose">Why You Need a GEO Audit Tool</h3>
          <p>
            GeoPilot automates the entire GEO evaluation process. Instead of manually checking robots.txt for AI
            bot permissions, analyzing entity density, scoring E-E-A-T factors, and benchmarking against industry
            standards, GeoPilot delivers a comprehensive report in minutes. Whether you are an SEO agency adding
            GEO services, a content team optimizing blog posts, or an e-commerce brand protecting product visibility,
            GeoPilot gives you the data and recommendations to win in AI search.
          </p>
        </article>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20 relative z-10" id="faq">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Frequently Asked Questions about GEO
          </h2>
          <p className="text-zinc-400 mt-3">Everything you need to know about Generative Engine Optimization.</p>
        </div>
        <div className="space-y-4">
          {landingFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/30 open:border-purple-500/30 transition-colors"
            >
              <summary className="cursor-pointer p-5 font-medium text-zinc-100 list-none flex items-center justify-between gap-4">
                {faq.q}
                <Sparkles className="h-4 w-4 text-purple-400 shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-indigo-950/80 to-purple-950/60 p-12 space-y-6">
          <Search className="h-12 w-12 text-purple-400 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Rank in AI Search Results?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Join marketers and agencies using GeoPilot to optimize for ChatGPT, Perplexity, Google AI Overviews, and the next generation of answer engines.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="h-12 px-8 border-zinc-700">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
