import type {
  ContentAnalysis,
  EeatAnalysis,
  EntityAnalysis,
  FaqAnalysis,
  GeoScores,
  LinkAnalysis,
  SchemaAnalysis,
  ScoreFactor,
  TopicAnalysis,
} from "./types";
import type { ScoringWeights } from "./types";

type EntityWithScore = EntityAnalysis;

const DEFAULT_WEIGHTS: Required<ScoringWeights> = {
  aiReadiness: 0.20,
  citation: 0.10,
  authority: 0.15,
  entity: 0.15,
  eeat: 0.15,
  contentStructure: 0.10,
  internalLink: 0.10,
  faq: 0.05,
};

export function calculateScores(
  entityAnalysis: EntityWithScore,
  topicAnalysis: TopicAnalysis,
  faqAnalysis: FaqAnalysis,
  schemaAnalysis: SchemaAnalysis,
  eeatAnalysis: EeatAnalysis,
  contentAnalysis: ContentAnalysis,
  linkAnalysis: LinkAnalysis,
  citationCount: number,
  customWeights?: ScoringWeights
): GeoScores {
  const citationScore = Math.min(100, Math.round(
    (Math.min(citationCount, 10) / 10) * 40 +
    (Math.min(eeatAnalysis.externalSourceCount, 10) / 10) * 40 +
    (eeatAnalysis.hasReferences ? 20 : 0)
  ));

  const aiReadinessScore = Math.round(
    schemaAnalysis.score * 0.35 +
    faqAnalysis.score * 0.35 +
    contentAnalysis.aiConsumptionScore * 0.30
  );

  const authorityScore = topicAnalysis.score;
  const entityScore = entityAnalysis.score;
  const eeatScore = eeatAnalysis.score;
  const contentStructureScore = contentAnalysis.structureScore;
  const internalLinkScore = linkAnalysis.score;
  const readabilityScore = contentAnalysis.readabilityScore;
  const faqScore = faqAnalysis.score;

  const w = { ...DEFAULT_WEIGHTS, ...customWeights };

  const geoScore = Math.round(
    aiReadinessScore * w.aiReadiness +
    citationScore * w.citation +
    authorityScore * w.authority +
    entityScore * w.entity +
    eeatScore * w.eeat +
    contentStructureScore * w.contentStructure +
    internalLinkScore * w.internalLink +
    faqScore * w.faq
  );

  const breakdown: Record<string, ScoreFactor[]> = {
    geo: [{ label: "Composite GEO Score", score: geoScore, maxScore: 100, explanation: "Weighted average of all analyzer scores" }],
    aiReadiness: [
      { label: "Schema markup", score: schemaAnalysis.score, maxScore: 100, explanation: "Structured data for AI parsing" },
      { label: "FAQ coverage", score: faqAnalysis.score, maxScore: 100, explanation: "Q&A content for answer engines" },
      { label: "AI consumption", score: contentAnalysis.aiConsumptionScore, maxScore: 100, explanation: "Content format AI can easily parse" },
    ],
    citation: [
      { label: "Outbound citations", score: Math.min(100, citationCount * 10), maxScore: 100, explanation: `${citationCount} citations found` },
      { label: "External sources", score: Math.min(100, eeatAnalysis.externalSourceCount * 10), maxScore: 100, explanation: `${eeatAnalysis.externalSourceCount} external links` },
    ],
    authority: topicAnalysis.primary.map((t) => ({
      label: t.name,
      score: Math.round(t.relevance * 100),
      maxScore: 100,
      explanation: "Primary topic relevance",
    })),
    entity: [
      { label: "Entity count", score: Math.min(100, entityAnalysis.entities.length * 3), maxScore: 100, explanation: `${entityAnalysis.entities.length} entities detected` },
      { label: "Entity density", score: Math.min(100, entityAnalysis.density * 20), maxScore: 100, explanation: `${entityAnalysis.density} entities per 1000 words` },
    ],
    eeat: eeatAnalysis.factors.map((f) => ({
      label: f.label,
      score: f.points,
      maxScore: 20,
      explanation: f.passed ? "Passed" : "Not detected",
    })),
    content: contentAnalysis.factors.map((f) => ({
      label: f.label,
      score: f.points,
      maxScore: 15,
      explanation: f.passed ? "Passed" : "Needs improvement",
    })),
    links: [
      { label: "Internal links", score: Math.min(100, linkAnalysis.internalCount * 5), maxScore: 100, explanation: `${linkAnalysis.internalCount} internal links` },
      { label: "Unique destinations", score: Math.min(100, linkAnalysis.uniqueInternal * 15), maxScore: 100, explanation: `${linkAnalysis.uniqueInternal} unique pages` },
    ],
  };

  return {
    geoScore,
    aiReadinessScore,
    citationScore,
    authorityScore,
    entityScore,
    eeatScore,
    contentStructureScore,
    internalLinkScore,
    readabilityScore,
    faqScore,
    breakdown,
  };
}
