import * as cheerio from "cheerio";
import type { ExtractedData } from "./types";

function flattenSchemas(schemas: Record<string, unknown>[]): Record<string, unknown>[] {
  const flat: Record<string, unknown>[] = [];
  for (const schema of schemas) {
    if (schema["@graph"] && Array.isArray(schema["@graph"])) {
      flat.push(...(schema["@graph"] as Record<string, unknown>[]));
    } else {
      flat.push(schema);
    }
  }
  return flat;
}

function getSchemaType(schema: Record<string, unknown>): string {
  const type = schema["@type"];
  if (Array.isArray(type)) return type[0] as string;
  return (type as string) || "";
}

export function extractHtmlData($: cheerio.CheerioAPI, baseUrl: string): ExtractedData {
  const title = $("title").text().trim();
  const description = $("meta[name='description']").attr("content") || "";

  let author: string | null =
    $("meta[name='author']").attr("content") ||
    $("[rel='author']").first().text().trim() ||
    $(".author, .byline, [itemprop='author']").first().text().trim() ||
    null;

  let publishedDate: string | null =
    $("meta[property='article:published_time']").attr("content") ||
    $("time[datetime]").first().attr("datetime") ||
    $("[itemprop='datePublished']").attr("content") ||
    null;

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get();
  const h2 = $("h2").map((_, el) => $(el).text().trim()).get();
  const h3 = $("h3").map((_, el) => $(el).text().trim()).get();
  const h4 = $("h4").map((_, el) => $(el).text().trim()).get();

  const internal: string[] = [];
  const external: string[] = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    if (href.startsWith("/") || href.startsWith(baseUrl) || href.startsWith(new URL(baseUrl).origin)) {
      internal.push(href);
    } else if (href.startsWith("http")) {
      external.push(href);
    }
  });

  const images: { url: string; alt: string }[] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    if (src) images.push({ url: src, alt: $(el).attr("alt") || "" });
  });

  const rawSchemas: Record<string, unknown>[] = [];
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const content = $(el).html();
      if (content) rawSchemas.push(JSON.parse(content));
    } catch {
      // invalid JSON-LD
    }
  });

  const schemas = flattenSchemas(rawSchemas);

  if (!author) {
    const personSchema = schemas.find((s) => getSchemaType(s) === "Person");
    if (personSchema?.name) author = personSchema.name as string;
  }

  if (!publishedDate) {
    const articleSchema = schemas.find((s) => ["Article", "NewsArticle", "BlogPosting"].includes(getSchemaType(s)));
    if (articleSchema?.datePublished) publishedDate = articleSchema.datePublished as string;
  }

  const faqs: ExtractedData["faqs"] = [];

  schemas.forEach((schema) => {
    if (getSchemaType(schema) === "FAQPage" && schema.mainEntity) {
      const entities = Array.isArray(schema.mainEntity) ? schema.mainEntity : [schema.mainEntity];
      entities.forEach((entity: Record<string, unknown>) => {
        if (entity["@type"] === "Question") {
          const answer = entity.acceptedAnswer as Record<string, unknown> | undefined;
          faqs.push({
            question: (entity.name as string) || "",
            answer: (answer?.text as string) || "",
            source: "schema",
          });
        }
      });
    }
  });

  // HTML FAQ patterns
  $("details").each((_, el) => {
    const summary = $(el).find("summary").text().trim();
    const answer = $(el).clone().children("summary").remove().end().text().trim();
    if (summary && answer) faqs.push({ question: summary, answer, source: "html" });
  });

  $(".faq, [class*='faq'], #faq").find("h2, h3, h4, dt").each((_, el) => {
    const question = $(el).text().trim();
    const answer = $(el).next("p, dd, div").text().trim();
    if (question && answer && question.length < 200) {
      faqs.push({ question, answer, source: "html-section" });
    }
  });

  const citations: string[] = [];
  $("a[href^='http']").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (href && !href.includes(new URL(baseUrl).hostname)) {
      citations.push(text || href);
    }
  });

  const paragraphs = $("p").length;
  const lists = $("ul, ol").length;
  const tables = $("table").length;
  const textContext = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = textContext.split(/\s+/).filter(Boolean).length;

  return {
    title,
    description,
    author,
    publishedDate,
    headings: { h1, h2, h3, h4 },
    links: { internal, external },
    images,
    schemas,
    faqs,
    citations: [...new Set(citations)].slice(0, 50),
    paragraphs,
    lists,
    tables,
    textContext,
    wordCount,
  };
}

export function getSchemaTypes(schemas: Record<string, unknown>[]): string[] {
  return [...new Set(schemas.map(getSchemaType).filter(Boolean))];
}
