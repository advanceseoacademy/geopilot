import type { ExtractedData, LinkAnalysis } from "./types";
import type { SiteCrawlResult } from "./crawler";

export function analyzeLinks(
  data: ExtractedData,
  baseUrl: string,
  siteCrawl?: SiteCrawlResult
): LinkAnalysis {
  const internalCount = data.links.internal.length;
  const externalCount = data.links.external.length;
  const uniqueInternal = new Set(data.links.internal.map((l) => l.split("?")[0])).size;

  const suggestions: string[] = [];
  let score = 0;

  if (internalCount > 0) score += 20;
  if (internalCount > 5) score += 15;
  if (internalCount > 15) score += 10;
  if (uniqueInternal > 3) score += 15;
  if (externalCount > 0) score += 15;
  if (externalCount > 3) score += 10;

  const hasAbout = data.links.internal.some((l) => /about/i.test(l));
  const hasContact = data.links.internal.some((l) => /contact/i.test(l));
  const hasBlog = data.links.internal.some((l) => /blog|article|news/i.test(l));

  if (hasAbout) score += 5;
  if (hasContact) score += 5;
  if (hasBlog) score += 5;

  if (internalCount < 3) {
    suggestions.push("Add more internal links to related pages on your site");
  }
  if (!hasAbout) suggestions.push("Link to an About page to establish authority");
  if (!hasContact) suggestions.push("Add a Contact page link for trust signals");
  if (externalCount === 0) {
    suggestions.push("Include outbound links to authoritative external sources");
  }

  let orphanPages: string[] = [];
  let siteMap: LinkAnalysis["siteMap"];
  let pagesCrawled: number | undefined;

  if (siteCrawl) {
    pagesCrawled = siteCrawl.pagesCrawled;
    orphanPages = siteCrawl.orphanPages;
    siteMap = siteCrawl.pages.map((p) => ({
      url: p.url,
      title: p.title,
      inboundLinks: siteCrawl.inboundCounts[p.url] || 0,
    }));

    if (siteCrawl.pagesCrawled >= 3) score += 10;
    if (orphanPages.length === 0 && siteCrawl.pagesCrawled > 1) score += 10;

    if (orphanPages.length > 0) {
      suggestions.push(
        `${orphanPages.length} orphan page(s) detected with few inbound links — add internal links to them`
      );
      orphanPages.slice(0, 3).forEach((url) => {
        suggestions.push(`Orphan page: link to ${url} from hub/navigation pages`);
      });
    }

    const poorlyLinked = siteMap.filter((p) => p.inboundLinks <= 1 && p.url !== siteCrawl.startUrl);
    if (poorlyLinked.length > 2) {
      suggestions.push("Improve internal linking between deep pages and your homepage");
    }
  } else {
    suggestions.push("Enable multi-page crawl for full orphan page analysis");
  }

  return {
    internalCount,
    externalCount,
    uniqueInternal,
    score: Math.min(100, score),
    suggestions: suggestions.slice(0, 8),
    pagesCrawled,
    orphanPages,
    siteMap,
  };
}
