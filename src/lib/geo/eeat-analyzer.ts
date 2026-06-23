import type { ExtractedData, EeatAnalysis } from "./types";

export function analyzeEeat(data: ExtractedData): EeatAnalysis {
  const factors: EeatAnalysis["factors"] = [];

  const hasAuthor = !!(data.author || data.schemas.some((s) => s["@type"] === "Person"));
  factors.push({ label: "Author information present", passed: hasAuthor, points: hasAuthor ? 20 : 0 });

  const hasAboutPage = data.links.internal.some((l) => /about/i.test(l));
  factors.push({ label: "About page linked", passed: hasAboutPage, points: hasAboutPage ? 20 : 0 });

  const hasContactPage = data.links.internal.some((l) => /contact/i.test(l));
  factors.push({ label: "Contact page linked", passed: hasContactPage, points: hasContactPage ? 15 : 0 });

  const hasReferences = data.citations.length > 0 || data.links.external.length > 0;
  factors.push({ label: "External references/citations", passed: hasReferences, points: hasReferences ? 20 : 0 });

  const externalSourceCount = data.links.external.length;
  if (externalSourceCount > 3) {
    factors.push({ label: "Multiple external sources (3+)", passed: true, points: 10 });
  } else {
    factors.push({ label: "Multiple external sources (3+)", passed: false, points: 0 });
  }

  const hasPublishedDate = !!data.publishedDate;
  factors.push({ label: "Publication date present", passed: hasPublishedDate, points: hasPublishedDate ? 10 : 0 });

  const hasPersonSchema = data.schemas.some((s) => s["@type"] === "Person");
  factors.push({ label: "Person schema markup", passed: hasPersonSchema, points: hasPersonSchema ? 5 : 0 });

  const score = Math.min(100, factors.reduce((sum, f) => sum + f.points, 0));

  return {
    score,
    hasAuthor,
    hasAboutPage,
    hasContactPage,
    hasReferences,
    externalSourceCount,
    factors,
  };
}
