import type {
  ContentAnalysis,
  EeatAnalysis,
  EntityAnalysis,
  FaqAnalysis,
  FullAuditResult,
  LinkAnalysis,
  Recommendation,
  SchemaAnalysis,
  TopicAnalysis,
} from "./types";

export function generateRecommendations(
  entityAnalysis: EntityAnalysis,
  topicAnalysis: TopicAnalysis,
  faqAnalysis: FaqAnalysis,
  schemaAnalysis: SchemaAnalysis,
  eeatAnalysis: EeatAnalysis,
  contentAnalysis: ContentAnalysis,
  linkAnalysis: LinkAnalysis
): Recommendation[] {
  const recs: Recommendation[] = [];

  entityAnalysis.recommendedEntities.forEach((desc) => {
    recs.push({ category: "Entities", priority: "medium", title: "Entity improvement", description: desc });
  });

  topicAnalysis.gaps.forEach((gap) => {
    recs.push({ category: "Topical Authority", priority: "high", title: gap, description: "Address this content gap to improve topical authority" });
  });

  topicAnalysis.opportunities.forEach((opp) => {
    recs.push({ category: "Topical Authority", priority: "medium", title: "Content opportunity", description: opp });
  });

  faqAnalysis.recommendations.forEach((desc) => {
    recs.push({ category: "FAQ", priority: "high", title: "FAQ improvement", description: desc });
  });

  schemaAnalysis.recommendations.forEach((desc) => {
    recs.push({ category: "Schema", priority: "high", title: "Schema markup", description: desc });
  });

  eeatAnalysis.factors
    .filter((f) => !f.passed)
    .forEach((f) => {
      recs.push({ category: "E-E-A-T", priority: "high", title: f.label, description: `Add ${f.label.toLowerCase()} to improve trust signals` });
    });

  contentAnalysis.factors
    .filter((f) => !f.passed)
    .forEach((f) => {
      recs.push({ category: "Content Structure", priority: "medium", title: f.label, description: `Improve: ${f.label.toLowerCase()}` });
    });

  linkAnalysis.suggestions.forEach((desc) => {
    recs.push({ category: "Internal Links", priority: "medium", title: "Link improvement", description: desc });
  });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 20);
}

export function buildReportSummary(result: FullAuditResult, url: string): string {
  const { scores, data } = result;
  return `GEO Audit for ${data.title || url}: Overall score ${scores.geoScore}/100. ` +
    `AI Readiness: ${scores.aiReadinessScore}, Authority: ${scores.authorityScore}, ` +
    `E-E-A-T: ${scores.eeatScore}, Entities: ${scores.entityScore}. ` +
    `${result.recommendations.length} recommendations generated.`;
}
