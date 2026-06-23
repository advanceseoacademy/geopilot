import type { ExtractedData, TopicAnalysis, EntityAnalysis } from "./types";

export function analyzeTopics(data: ExtractedData, entityAnalysis: EntityAnalysis): TopicAnalysis {
  const entities = entityAnalysis.entities;
  const wordCount = data.wordCount;

  const primary = entities.slice(0, 5).map((e) => ({
    name: e.name,
    relevance: Math.min(1, e.count / 10),
  }));

  const secondary = entities.slice(5, 12).map((e) => ({
    name: e.name,
    relevance: Math.min(0.8, e.count / 8),
  }));

  const supporting = entities.slice(12, 20).map((e) => ({
    name: e.name,
    relevance: Math.min(0.5, e.count / 6),
  }));

  const gaps: string[] = [];
  const opportunities: string[] = [];

  if (data.headings.h2.length < 3) {
    gaps.push("Insufficient H2 topic sections");
    opportunities.push("Add more H2 sections covering subtopics for deeper topical coverage");
  }
  if (wordCount < 800) {
    gaps.push("Thin content depth");
    opportunities.push("Expand content to 1000+ words for stronger topical authority");
  }
  if (entities.length < 15) {
    gaps.push("Low entity diversity");
    opportunities.push("Cover more related concepts, terms, and entities in your niche");
  }
  if (data.headings.h3.length === 0 && data.headings.h2.length > 0) {
    opportunities.push("Add H3 subheadings under main topics for better structure");
  }

  const headingTopics = [...data.headings.h2, ...data.headings.h3];
  const entityNames = new Set(entities.map((e) => e.name.toLowerCase()));
  headingTopics.forEach((heading) => {
    const words = heading.toLowerCase().split(/\s+/);
    const covered = words.some((w) => [...entityNames].some((e) => e.includes(w)));
    if (!covered && heading.length > 5) {
      opportunities.push(`Expand content around: "${heading}"`);
    }
  });

  let score = 0;
  if (entities.length > 10) score += 25;
  if (entities.length > 25) score += 15;
  if (wordCount > 500) score += 15;
  if (wordCount > 1000) score += 15;
  if (wordCount > 2000) score += 10;
  if (data.headings.h2.length >= 3) score += 10;
  if (primary.length >= 3) score += 10;

  return {
    primary,
    secondary,
    supporting,
    gaps,
    opportunities: opportunities.slice(0, 8),
    score: Math.min(100, score),
  };
}
