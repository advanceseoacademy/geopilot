import axios from "axios";
import * as cheerio from "cheerio";

export interface CrawlResult {
  url: string;
  html: string;
  $: cheerio.CheerioAPI;
  status: number;
  responseTimeMs: number;
  error?: string;
}

export interface CrawledPage {
  url: string;
  title: string;
  internalLinks: string[];
  status: number;
}

export interface SiteCrawlResult {
  startUrl: string;
  pages: CrawledPage[];
  pagesCrawled: number;
  linkGraph: Record<string, string[]>;
  inboundCounts: Record<string, number>;
  orphanPages: string[];
  mainPageHtml: string;
  mainPage$: cheerio.CheerioAPI;
  responseTimeMs: number;
}

const MAX_PAGES = 50;
const CRAWL_DELAY_MS = 300;

function normalizeUrl(url: string, base: string): string | null {
  try {
    const resolved = new URL(url, base);
    if (!["http:", "https:"].includes(resolved.protocol)) return null;
    resolved.hash = "";
    return resolved.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function isSameOrigin(url: string, origin: string): boolean {
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
}

function extractInternalLinks($: cheerio.CheerioAPI, pageUrl: string, origin: string): string[] {
  const links: string[] = [];
  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const normalized = normalizeUrl(href, pageUrl);
    if (normalized && isSameOrigin(normalized, origin)) {
      links.push(normalized);
    }
  });
  return [...new Set(links)];
}

export async function crawlUrl(url: string): Promise<CrawlResult> {
  const start = Date.now();
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "GeoPilot-Bot/1.0" },
      timeout: 10000,
    });
    const html = response.data;
    return { url, html, $: cheerio.load(html), status: response.status, responseTimeMs: Date.now() - start };
  } catch (error: unknown) {
    const err = error as { response?: { status: number }; message: string };
    return {
      url,
      html: "",
      $: cheerio.load(""),
      status: err.response?.status || 500,
      responseTimeMs: Date.now() - start,
      error: err.message,
    };
  }
}

export async function crawlSite(
  startUrl: string,
  maxPages = MAX_PAGES,
  seedUrls: string[] = [],
  onProgress?: (pct: number, msg: string) => void | Promise<void>
): Promise<SiteCrawlResult> {
  const normalizedStart = normalizeUrl(startUrl, startUrl)!;
  const origin = new URL(normalizedStart).origin;

  const visited = new Set<string>();
  const queue: string[] = [normalizedStart, ...seedUrls.map((u) => normalizeUrl(u, startUrl)).filter(Boolean) as string[]];
  const pages: CrawledPage[] = [];
  const linkGraph: Record<string, string[]> = {};

  let mainPageHtml = "";
  let mainPage$ = cheerio.load("");
  let responseTimeMs = 0;

  while (queue.length > 0 && pages.length < maxPages) {
    const currentUrl = queue.shift()!;
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    const result = await crawlUrl(currentUrl);
    if (result.status !== 200 || !result.html) continue;

    if (currentUrl === normalizedStart) {
      mainPageHtml = result.html;
      mainPage$ = result.$;
      responseTimeMs = result.responseTimeMs;
    }

    const internalLinks = extractInternalLinks(result.$, currentUrl, origin);
    const title = result.$("title").text().trim() || currentUrl;

    pages.push({ url: currentUrl, title, internalLinks, status: result.status });
    linkGraph[currentUrl] = internalLinks;

    if (onProgress) {
      await onProgress(Math.round((pages.length / maxPages) * 80), `Crawled ${pages.length}/${maxPages} pages`);
    }

    for (const link of internalLinks) {
      if (!visited.has(link) && !queue.includes(link)) {
        queue.push(link);
      }
    }

    if (queue.length > 0) await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
  }

  const inboundCounts: Record<string, number> = {};
  for (const page of pages) {
    if (!inboundCounts[page.url]) inboundCounts[page.url] = 0;
  }
  for (const [, links] of Object.entries(linkGraph)) {
    for (const link of links) {
      inboundCounts[link] = (inboundCounts[link] || 0) + 1;
    }
  }

  const orphanPages = pages
    .filter((p) => p.url !== normalizedStart && (inboundCounts[p.url] || 0) <= 1)
    .map((p) => p.url);

  return {
    startUrl: normalizedStart,
    pages,
    pagesCrawled: pages.length,
    linkGraph,
    inboundCounts,
    orphanPages,
    mainPageHtml,
    mainPage$,
    responseTimeMs,
  };
}
