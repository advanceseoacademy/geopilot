export interface WebVitals {
  responseTimeMs: number;
  htmlSizeKb: number;
  score: number;
  rating: "good" | "needs-improvement" | "poor";
}

export function analyzeWebVitals(responseTimeMs: number, htmlSizeBytes: number): WebVitals {
  let score = 100;
  let rating: WebVitals["rating"] = "good";

  if (responseTimeMs > 1000) { score -= 20; rating = "needs-improvement"; }
  if (responseTimeMs > 2500) { score -= 30; rating = "poor"; }
  if (responseTimeMs > 5000) { score -= 20; }

  const htmlSizeKb = Math.round(htmlSizeBytes / 1024);
  if (htmlSizeKb > 500) score -= 15;
  if (htmlSizeKb > 1500) score -= 15;

  return {
    responseTimeMs,
    htmlSizeKb,
    score: Math.max(0, score),
    rating,
  };
}

export const INDUSTRY_BENCHMARKS = {
  geo: 62,
  aiReadiness: 55,
  eeat: 58,
  authority: 60,
  entity: 52,
  citation: 45,
  contentStructure: 65,
  internalLinks: 50,
  readability: 60,
  faq: 40,
};

export function getBenchmarkComparison(scores: Record<string, number | null>) {
  const map: Record<string, keyof typeof INDUSTRY_BENCHMARKS> = {
    geoScore: "geo",
    aiReadinessScore: "aiReadiness",
    eeatScore: "eeat",
    authorityScore: "authority",
    entityScore: "entity",
    citationScore: "citation",
    contentStructureScore: "contentStructure",
    internalLinkScore: "internalLinks",
    readabilityScore: "readability",
    faqScore: "faq",
  };

  return Object.entries(map).map(([key, benchKey]) => {
    const value = scores[key] ?? 0;
    const benchmark = INDUSTRY_BENCHMARKS[benchKey];
    const diff = value - benchmark;
    return {
      label: benchKey,
      score: value,
      benchmark,
      diff,
      status: diff >= 10 ? "above" : diff <= -10 ? "below" : "average",
    };
  });
}
