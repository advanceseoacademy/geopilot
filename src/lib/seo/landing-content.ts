export const siteName = "GeoPilot";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://geopilot.vercel.app").replace(/\/$/, "");
}

export const landingFaqs = [
  {
    q: "What is Generative Engine Optimization (GEO)?",
    a: "Generative Engine Optimization (GEO) is the practice of optimizing website content so AI-powered search engines and assistants — like ChatGPT, Perplexity, Google AI Overviews, and Bing Copilot — can discover, understand, and cite your pages in generated answers. Unlike traditional SEO which targets blue links, GEO focuses on entity clarity, structured data, E-E-A-T signals, and citation-worthy content.",
  },
  {
    q: "How is GEO different from traditional SEO?",
    a: "Traditional SEO optimizes for ranking in search engine result pages (SERPs). GEO optimizes for being selected as a source in AI-generated answers. GEO emphasizes semantic entities, topical authority, FAQ structure, schema markup, AI bot accessibility, and content that AI models can easily parse and reference.",
  },
  {
    q: "What does GeoPilot analyze in a GEO audit?",
    a: "GeoPilot runs a comprehensive GEO audit covering: overall GEO score, AI readiness, E-E-A-T, entity coverage, citation potential, content structure, internal linking, readability, FAQ optimization, robots.txt AI bot access, multi-page crawl analysis, and industry benchmark comparisons.",
  },
  {
    q: "Does GeoPilot use paid external APIs?",
    a: "No. GeoPilot runs entirely on local analysis — no OpenAI, no paid SEO APIs. All scoring, entity extraction, and recommendations are computed using open-source NLP and custom GEO algorithms. This keeps audits fast, private, and affordable.",
  },
  {
    q: "Which AI search engines does GEO help with?",
    a: "GEO best practices improve visibility across all major answer engines: ChatGPT with web browsing, Perplexity AI, Google AI Overviews, Bing Copilot, Claude, and emerging AI search tools. The core principles — clear entities, strong E-E-A-T, structured content — apply universally.",
  },
  {
    q: "How often should I run a GEO audit?",
    a: "Run a GEO audit after every major content update, site migration, or robots.txt change. For active sites, monthly audits help track score trends. GeoPilot supports scheduled audits, audit history diff, and competitor comparison to monitor progress.",
  },
  {
    q: "Can I audit competitor websites with GeoPilot?",
    a: "Yes. Use the Compare feature to audit multiple URLs side-by-side and see how your GEO scores stack up against competitors. This helps identify content gaps and opportunities where rivals outperform you in AI readiness.",
  },
  {
    q: "Is GeoPilot free to use?",
    a: "GeoPilot offers a free tier to get started with GEO audits. Visit our pricing page for plan details including bulk audits, team collaboration, API access, scheduled audits, and PDF report exports.",
  },
  {
    q: "What is a good GEO score?",
    a: "A GEO score of 80 or above is considered excellent — your content is well-structured for AI citation. Scores between 60–79 indicate good foundations with room for improvement. Below 60 suggests significant GEO gaps that may prevent AI engines from citing your content.",
  },
  {
    q: "How do I improve my GEO score?",
    a: "Improve your GEO score by adding clear entity definitions, structured FAQ sections, schema markup, author credentials for E-E-A-T, allowing AI crawlers in robots.txt, strengthening internal links, and writing content that directly answers user questions in a parseable format.",
  },
] as const;

export const geoBenefits = [
  {
    title: "Get Cited by AI Assistants",
    desc: "When users ask ChatGPT or Perplexity a question in your niche, GEO-optimized pages are more likely to be referenced as the authoritative source in the answer.",
  },
  {
    title: "Future-Proof Your SEO Strategy",
    desc: "AI search is growing 300% year-over-year. Brands that invest in GEO now build citation authority before competitors catch up.",
  },
  {
    title: "Increase Brand Visibility",
    desc: "Even without a click, AI citations expose your brand name to millions of users. GEO ensures your business appears in those AI-generated responses.",
  },
  {
    title: "Reduce Dependence on Google Ads",
    desc: "Organic AI citations drive qualified traffic without pay-per-click costs. Strong GEO scores compound over time as AI models update their source preferences.",
  },
] as const;

export const geoChecklist = [
  "Clear entity definitions and semantic markup on every page",
  "FAQ sections with structured Question/Answer schema",
  "Author bios and credentials for E-E-A-T trust signals",
  "robots.txt allows GPTBot, ClaudeBot, and PerplexityBot",
  "Internal links connecting related topical content clusters",
  "Readable content structure with H1–H3 hierarchy",
  "Citation-worthy statistics, data, and original research",
  "Multi-language hreflang tags for international sites",
] as const;

export const aiPlatforms = [
  {
    name: "ChatGPT Search",
    desc: "OpenAI's ChatGPT browses the web to answer questions. GEO ensures your pages have clear entities and E-E-A-T signals ChatGPT's crawler can trust and cite.",
  },
  {
    name: "Perplexity AI",
    desc: "Perplexity always cites sources in answers. Strong entity coverage and topical authority dramatically increase your chances of appearing in Perplexity's source list.",
  },
  {
    name: "Google AI Overviews",
    desc: "Google's AI-generated summaries at the top of search results pull from pages with strong schema markup, FAQ structure, and demonstrated expertise.",
  },
  {
    name: "Bing Copilot",
    desc: "Microsoft's AI assistant uses Bing's index. GEO-optimized content with proper schema and entity clarity ranks higher in Copilot's source selection algorithm.",
  },
] as const;

export const scoreMetrics = [
  "GEO Score",
  "AI Readiness",
  "E-E-A-T",
  "Authority",
  "Entity Coverage",
  "Citation Potential",
  "Content Structure",
  "Internal Links",
  "Readability",
  "FAQ Score",
] as const;
