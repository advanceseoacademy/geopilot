import {
  getSiteUrl,
  landingFaqs,
  scoreMetrics,
  siteName,
} from "./landing-content";

/** Safe JSON-LD serialization — prevents script tag breakout */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildHomePageSchema() {
  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl;
  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${pageUrl}/#webpage`;
  const softwareId = `${siteUrl}/#software`;
  const faqId = `${pageUrl}/#faq`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteName,
        url: siteUrl,
        description:
          "GeoPilot is a Generative Engine Optimization (GEO) platform that helps websites get cited by AI search engines.",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/favicon.ico`,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        description:
          "Generative Engine Optimization audit platform for ChatGPT, Perplexity, and Google AI Overviews.",
        publisher: { "@id": orgId },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: pageUrl,
        name: "GeoPilot — GEO Audit Tool for AI Search Engines",
        description:
          "Analyze your website for AI search readiness. Free GEO audit with entity analysis, E-E-A-T scoring, and PDF reports.",
        isPartOf: { "@id": websiteId },
        about: { "@id": softwareId },
        inLanguage: "en-US",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/favicon.ico`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: siteName,
        url: siteUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web browser",
        description:
          "GeoPilot is a Generative Engine Optimization (GEO) audit platform. Analyze any website for AI search readiness with 10+ scores, entity extraction, E-E-A-T validation, and actionable recommendations.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/signup`,
        },
        featureList: scoreMetrics.join(", "),
        provider: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: `${pageUrl}#faq`,
        mainEntity: landingFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}/#features`,
        name: "GeoPilot GEO Audit Features",
        itemListElement: scoreMetrics.map((metric, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: metric,
        })),
      },
    ],
  };
}
