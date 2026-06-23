import axios from "axios";

export async function fetchSitemapUrls(baseUrl: string, sitemapUrls: string[] = []): Promise<string[]> {
  const origin = new URL(baseUrl).origin;
  const toTry = sitemapUrls.length > 0 ? sitemapUrls : [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];

  const allUrls: string[] = [];

  for (const sitemapUrl of toTry.slice(0, 3)) {
    try {
      const res = await axios.get(sitemapUrl, {
        timeout: 8000,
        headers: { "User-Agent": "GeoPilot-Bot/1.0" },
      });
      const xml = res.data as string;
      const locMatches = xml.match(/<loc>([^<]+)<\/loc>/gi) || [];
      for (const match of locMatches) {
        const url = match.replace(/<\/?loc>/gi, "").trim();
        if (url.startsWith("http") && !url.endsWith(".xml")) {
          allUrls.push(url);
        } else if (url.endsWith(".xml") && !toTry.includes(url)) {
          const nested = await fetchSitemapUrls(baseUrl, [url]);
          allUrls.push(...nested);
        }
      }
    } catch {
      // sitemap not found
    }
  }

  return [...new Set(allUrls)].slice(0, 50);
}
