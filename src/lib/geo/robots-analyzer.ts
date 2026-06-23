import axios from "axios";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
];

export interface RobotsAnalysis {
  exists: boolean;
  allowsAll: boolean;
  blockedBots: string[];
  allowedBots: string[];
  sitemapUrls: string[];
  score: number;
  recommendations: string[];
}

export async function analyzeRobotsTxt(baseUrl: string): Promise<RobotsAnalysis> {
  const origin = new URL(baseUrl).origin;
  const recommendations: string[] = [];
  let exists = false;
  let allowsAll = true;
  const blockedBots: string[] = [];
  const allowedBots: string[] = [];
  const sitemapUrls: string[] = [];

  try {
    const res = await axios.get(`${origin}/robots.txt`, {
      timeout: 5000,
      headers: { "User-Agent": "GeoPilot-Bot/1.0" },
      validateStatus: () => true,
    });

    if (res.status !== 200 || typeof res.data !== "string") {
      recommendations.push("Create a robots.txt file at your domain root");
      return { exists: false, allowsAll: true, blockedBots, allowedBots, sitemapUrls, score: 40, recommendations };
    }

    exists = true;
    const content = res.data as string;
    const lines = content.split("\n").map((l) => l.trim());

    let currentAgent = "*";
    const agentRules: Record<string, { allow: string[]; disallow: string[] }> = {};

    for (const line of lines) {
      if (line.toLowerCase().startsWith("user-agent:")) {
        currentAgent = line.split(":")[1]?.trim() || "*";
        if (!agentRules[currentAgent]) agentRules[currentAgent] = { allow: [], disallow: [] };
      } else if (line.toLowerCase().startsWith("disallow:")) {
        const path = line.split(":")[1]?.trim() || "";
        if (!agentRules[currentAgent]) agentRules[currentAgent] = { allow: [], disallow: [] };
        agentRules[currentAgent].disallow.push(path);
        if (currentAgent === "*" && path === "/") allowsAll = false;
      } else if (line.toLowerCase().startsWith("allow:")) {
        const path = line.split(":")[1]?.trim() || "";
        if (!agentRules[currentAgent]) agentRules[currentAgent] = { allow: [], disallow: [] };
        agentRules[currentAgent].allow.push(path);
      } else if (line.toLowerCase().startsWith("sitemap:")) {
        sitemapUrls.push(line.split(":").slice(1).join(":").trim());
      }
    }

    for (const bot of AI_BOTS) {
      const rules = agentRules[bot] || agentRules["*"];
      const blocked = rules?.disallow.some((d) => d === "/" || d === "/*");
      if (blocked) blockedBots.push(bot);
      else allowedBots.push(bot);
    }

    if (blockedBots.length > 0) {
      recommendations.push(`Unblock AI crawlers for GEO: ${blockedBots.slice(0, 3).join(", ")}`);
    }
    if (sitemapUrls.length === 0) {
      recommendations.push("Add Sitemap directive to robots.txt");
    }
    if (!allowsAll && blockedBots.length === AI_BOTS.length) {
      recommendations.push("Your robots.txt may be blocking all crawlers including AI bots");
    }
  } catch {
    recommendations.push("Could not fetch robots.txt — ensure it is accessible");
  }

  let score = 50;
  if (exists) score += 20;
  if (sitemapUrls.length > 0) score += 15;
  if (allowedBots.length > blockedBots.length) score += 15;
  if (blockedBots.length === 0) score += 10;

  return {
    exists,
    allowsAll,
    blockedBots,
    allowedBots,
    sitemapUrls,
    score: Math.min(100, score),
    recommendations,
  };
}
