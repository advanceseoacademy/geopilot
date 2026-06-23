export interface ExtractedData {
  title: string;
  description: string;
  author: string | null;
  publishedDate: string | null;
  headings: { h1: string[]; h2: string[]; h3: string[]; h4: string[] };
  links: { internal: string[]; external: string[] };
  images: { url: string; alt: string }[];
  schemas: Record<string, unknown>[];
  faqs: { question: string; answer: string; source: string }[];
  citations: string[];
  paragraphs: number;
  lists: number;
  tables: number;
  textContext: string;
  wordCount: number;
}

export interface ExtractedEntity {
  name: string;
  type: string;
  count: number;
}

export interface EntityAnalysis {
  entities: ExtractedEntity[];
  density: number;
  missingEntities: string[];
  recommendedEntities: string[];
  byType: Record<string, number>;
  score: number;
}

export interface TopicAnalysis {
  primary: { name: string; relevance: number }[];
  secondary: { name: string; relevance: number }[];
  supporting: { name: string; relevance: number }[];
  gaps: string[];
  opportunities: string[];
  score: number;
}

export interface FaqAnalysis {
  faqs: { question: string; answer: string; source: string }[];
  score: number;
  recommendations: string[];
}

export interface SchemaAnalysis {
  detected: string[];
  missing: string[];
  recommendations: string[];
  score: number;
}

export interface EeatAnalysis {
  score: number;
  hasAuthor: boolean;
  hasAboutPage: boolean;
  hasContactPage: boolean;
  hasReferences: boolean;
  externalSourceCount: number;
  factors: { label: string; passed: boolean; points: number }[];
}

export interface ContentAnalysis {
  structureScore: number;
  readabilityScore: number;
  aiConsumptionScore: number;
  headingScore: number;
  hasSingleH1: boolean;
  paragraphCount: number;
  listCount: number;
  tableCount: number;
  avgParagraphLength: number;
  factors: { label: string; passed: boolean; points: number }[];
}

export interface LinkAnalysis {
  internalCount: number;
  externalCount: number;
  uniqueInternal: number;
  score: number;
  suggestions: string[];
  pagesCrawled?: number;
  orphanPages?: string[];
  siteMap?: { url: string; title: string; inboundLinks: number }[];
}

export interface ScoreFactor {
  label: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface GeoScores {
  geoScore: number;
  aiReadinessScore: number;
  citationScore: number;
  authorityScore: number;
  entityScore: number;
  eeatScore: number;
  contentStructureScore: number;
  internalLinkScore: number;
  readabilityScore: number;
  faqScore: number;
  breakdown: Record<string, ScoreFactor[]>;
}

export interface Recommendation {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface FullAuditResult {
  data: ExtractedData;
  entities: EntityAnalysis;
  topics: TopicAnalysis;
  faqs: FaqAnalysis;
  schemas: SchemaAnalysis;
  eeat: EeatAnalysis;
  content: ContentAnalysis;
  links: LinkAnalysis;
  scores: GeoScores;
  recommendations: Recommendation[];
  robots?: import("./robots-analyzer").RobotsAnalysis;
  language?: import("./language-analyzer").LanguageAnalysis;
  webVitals?: import("./benchmarks").WebVitals;
  crawlData?: {
    pagesCrawled: number;
    orphanPages: string[];
    siteMap: { url: string; title: string; inboundLinks: number }[];
  };
}

export interface ScoringWeights {
  aiReadiness?: number;
  citation?: number;
  authority?: number;
  entity?: number;
  eeat?: number;
  contentStructure?: number;
  internalLink?: number;
  faq?: number;
}
