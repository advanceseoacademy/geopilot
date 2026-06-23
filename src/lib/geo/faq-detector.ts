import type { ExtractedData, FaqAnalysis } from "./types";

export function analyzeFaqs(data: ExtractedData): FaqAnalysis {
  const uniqueFaqs = data.faqs.filter(
    (faq, i, arr) => arr.findIndex((f) => f.question.toLowerCase() === faq.question.toLowerCase()) === i
  );

  const recommendations: string[] = [];
  let score = 0;

  if (uniqueFaqs.length > 0) score += 30;
  if (uniqueFaqs.length >= 3) score += 25;
  if (uniqueFaqs.length >= 5) score += 15;

  const hasSchemaFaq = uniqueFaqs.some((f) => f.source === "schema");
  const hasHtmlFaq = uniqueFaqs.some((f) => f.source !== "schema");

  if (hasSchemaFaq) score += 15;
  if (hasHtmlFaq) score += 10;

  const avgAnswerLength =
    uniqueFaqs.length > 0
      ? uniqueFaqs.reduce((sum, f) => sum + f.answer.length, 0) / uniqueFaqs.length
      : 0;

  if (avgAnswerLength > 50) score += 5;

  if (uniqueFaqs.length === 0) {
    recommendations.push("Add an FAQ section with common questions your audience asks");
    recommendations.push("Implement FAQPage schema markup for AI answer engines");
  } else if (uniqueFaqs.length < 3) {
    recommendations.push("Add at least 3-5 FAQ items for better AI answer coverage");
  }

  if (!hasSchemaFaq && uniqueFaqs.length > 0) {
    recommendations.push("Add FAQPage JSON-LD schema to help AI engines parse your Q&A");
  }

  data.headings.h2.forEach((h2) => {
    if (h2.includes("?") && !uniqueFaqs.some((f) => f.question.includes(h2))) {
      recommendations.push(`Convert heading to FAQ format: "${h2}"`);
    }
  });

  if (avgAnswerLength < 30 && uniqueFaqs.length > 0) {
    recommendations.push("Expand FAQ answers to 2-3 sentences for better AI consumption");
  }

  return {
    faqs: uniqueFaqs,
    score: Math.min(100, score),
    recommendations: recommendations.slice(0, 6),
  };
}
