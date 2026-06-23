/** Canonical production URL for GeoPilot */
export const PRODUCTION_SITE_URL = "https://geopilottools.vercel.app";

export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : PRODUCTION_SITE_URL);
  return url.replace(/\/$/, "");
}

export function getTrustedOrigins(): string[] {
  const origins = new Set<string>([
    getSiteUrl(),
    PRODUCTION_SITE_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  return [...origins];
}
