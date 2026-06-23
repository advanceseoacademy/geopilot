import type { ExtractedData, ContentAnalysis } from "./types";

export function analyzeContent(data: ExtractedData): ContentAnalysis {
  const factors: ContentAnalysis["factors"] = [];
  const hasSingleH1 = data.headings.h1.length === 1;

  factors.push({ label: "Single H1 heading", passed: hasSingleH1, points: hasSingleH1 ? 15 : 0 });
  factors.push({ label: "H2 subheadings present", passed: data.headings.h2.length > 0, points: data.headings.h2.length > 0 ? 15 : 0 });
  factors.push({ label: "H3 subheadings present", passed: data.headings.h3.length > 0, points: data.headings.h3.length > 0 ? 10 : 0 });
  factors.push({ label: "Meta title (10+ chars)", passed: data.title.length > 10, points: data.title.length > 10 ? 10 : 0 });
  factors.push({ label: "Meta description (50+ chars)", passed: data.description.length > 50, points: data.description.length > 50 ? 10 : 0 });

  const imagesWithAlt = data.images.filter((img) => img.alt.trim().length > 0);
  const allImagesHaveAlt = data.images.length > 0 && imagesWithAlt.length === data.images.length;
  factors.push({ label: "All images have alt text", passed: allImagesHaveAlt, points: allImagesHaveAlt ? 10 : 0 });

  factors.push({ label: "Lists for scannable content", passed: data.lists > 0, points: data.lists > 0 ? 10 : 0 });
  factors.push({ label: "Tables for structured data", passed: data.tables > 0, points: data.tables > 0 ? 5 : 0 });

  const structureScore = Math.min(100, factors.reduce((sum, f) => sum + f.points, 0));

  const avgParagraphLength = data.paragraphs > 0 ? Math.round(data.wordCount / data.paragraphs) : 0;
  let readabilityScore = 50;
  if (avgParagraphLength > 0 && avgParagraphLength < 150) readabilityScore += 20;
  if (avgParagraphLength >= 150 && avgParagraphLength < 300) readabilityScore += 10;
  if (data.lists > 0) readabilityScore += 15;
  if (data.headings.h2.length >= 3) readabilityScore += 15;
  readabilityScore = Math.min(100, readabilityScore);

  let aiConsumptionScore = 0;
  if (hasSingleH1) aiConsumptionScore += 20;
  if (data.headings.h2.length >= 2) aiConsumptionScore += 20;
  if (data.lists > 0) aiConsumptionScore += 15;
  if (data.tables > 0) aiConsumptionScore += 10;
  if (data.wordCount > 300) aiConsumptionScore += 15;
  if (data.description.length > 50) aiConsumptionScore += 10;
  if (data.faqs.length > 0) aiConsumptionScore += 10;
  aiConsumptionScore = Math.min(100, aiConsumptionScore);

  return {
    structureScore,
    readabilityScore,
    aiConsumptionScore,
    headingScore: hasSingleH1 ? 100 : data.headings.h1.length === 0 ? 0 : 50,
    hasSingleH1,
    paragraphCount: data.paragraphs,
    listCount: data.lists,
    tableCount: data.tables,
    avgParagraphLength,
    factors,
  };
}
