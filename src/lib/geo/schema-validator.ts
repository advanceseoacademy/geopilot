import { getSchemaTypes } from "./extractor";
import type { ExtractedData, SchemaAnalysis } from "./types";

const EXPECTED_SCHEMAS = ["Article", "NewsArticle", "BlogPosting", "FAQPage", "Product", "Organization", "Person", "WebSite", "LocalBusiness"];

export function analyzeSchemas(data: ExtractedData): SchemaAnalysis {
  const detected = getSchemaTypes(data.schemas);
  const missing: string[] = [];
  const recommendations: string[] = [];

  const hasArticle = detected.some((t) => ["Article", "NewsArticle", "BlogPosting"].includes(t));
  const hasFaq = detected.includes("FAQPage");
  const hasProduct = detected.includes("Product");
  const hasOrg = detected.some((t) => ["Organization", "WebSite", "LocalBusiness"].includes(t));
  const hasPerson = detected.includes("Person");

  if (!hasArticle) {
    missing.push("Article");
    recommendations.push("Add Article or BlogPosting schema with headline, author, and datePublished");
  }
  if (!hasFaq && data.faqs.length > 0) {
    missing.push("FAQPage");
    recommendations.push("Add FAQPage schema since FAQ content was detected on the page");
  }
  if (!hasFaq && data.faqs.length === 0) {
    recommendations.push("Consider FAQPage schema after adding FAQ content");
  }
  if (!hasOrg) {
    missing.push("Organization");
    recommendations.push("Add Organization or WebSite schema with name, url, and logo");
  }
  if (!hasPerson && !data.author) {
    missing.push("Person");
    recommendations.push("Add Person schema for the author to boost E-E-A-T signals");
  }
  if (!hasProduct && /\b(buy|price|product|shop)\b/i.test(data.textContext)) {
    missing.push("Product");
    recommendations.push("Add Product schema if you sell products or services");
  }

  let score = 0;
  if (detected.length > 0) score += 25;
  if (hasArticle) score += 20;
  if (hasFaq) score += 20;
  if (hasOrg) score += 15;
  if (hasPerson) score += 10;
  if (hasProduct) score += 10;

  return {
    detected,
    missing,
    recommendations: recommendations.slice(0, 6),
    score: Math.min(100, score),
  };
}
