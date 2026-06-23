import { extractHtmlData } from "./extractor";
import { analyzeEntities } from "./entity-analyzer";
import { analyzeTopics } from "./topical-analyzer";
import { analyzeFaqs } from "./faq-detector";
import { analyzeSchemas } from "./schema-validator";
import { analyzeEeat } from "./eeat-analyzer";
import { analyzeContent } from "./content-analyzer";
import { analyzeLinks } from "./link-analyzer";
import { analyzeRobotsTxt } from "./robots-analyzer";
import { analyzeLanguage } from "./language-analyzer";
import { analyzeWebVitals } from "./benchmarks";
import { calculateScores } from "./scoring";
import { generateRecommendations } from "./recommendations";
import type { FullAuditResult, ScoringWeights } from "./types";
import type { SiteCrawlResult } from "./crawler";

export async function runFullAnalysis(
  url: string,
  siteCrawl: SiteCrawlResult,
  scoringWeights?: ScoringWeights
): Promise<FullAuditResult> {
  const data = extractHtmlData(siteCrawl.mainPage$, url);
  const htmlLang = siteCrawl.mainPage$("html").attr("lang");

  const [robots, entityAnalysis] = await Promise.all([
    analyzeRobotsTxt(url),
    Promise.resolve(analyzeEntities(data)),
  ]);

  const topicAnalysis = analyzeTopics(data, entityAnalysis);
  const faqAnalysis = analyzeFaqs(data);
  const schemaAnalysis = analyzeSchemas(data);
  const eeatAnalysis = analyzeEeat(data);
  const contentAnalysis = analyzeContent(data);
  const linkAnalysis = analyzeLinks(data, url, siteCrawl);
  const language = analyzeLanguage(data.textContext, htmlLang);
  const webVitals = analyzeWebVitals(siteCrawl.responseTimeMs, siteCrawl.mainPageHtml.length);

  const scores = calculateScores(
    entityAnalysis,
    topicAnalysis,
    faqAnalysis,
    schemaAnalysis,
    eeatAnalysis,
    contentAnalysis,
    linkAnalysis,
    data.citations.length,
    scoringWeights
  );

  const recommendations = generateRecommendations(
    entityAnalysis,
    topicAnalysis,
    faqAnalysis,
    schemaAnalysis,
    eeatAnalysis,
    contentAnalysis,
    linkAnalysis
  );

  robots.recommendations.forEach((desc) => {
    recommendations.push({ category: "Robots/AI Bots", priority: "high", title: "robots.txt", description: desc });
  });
  language.recommendations.forEach((desc) => {
    recommendations.push({ category: "Language", priority: "medium", title: "Multilingual", description: desc });
  });

  const crawlData = {
    pagesCrawled: siteCrawl.pagesCrawled,
    orphanPages: siteCrawl.orphanPages,
    siteMap: siteCrawl.pages.map((p) => ({
      url: p.url,
      title: p.title,
      inboundLinks: siteCrawl.inboundCounts[p.url] || 0,
    })),
  };

  return {
    data,
    entities: entityAnalysis,
    topics: topicAnalysis,
    faqs: faqAnalysis,
    schemas: schemaAnalysis,
    eeat: eeatAnalysis,
    content: contentAnalysis,
    links: linkAnalysis,
    scores,
    recommendations: recommendations.slice(0, 25),
    robots,
    language,
    webVitals,
    crawlData,
  };
}
