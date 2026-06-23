import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];
}
