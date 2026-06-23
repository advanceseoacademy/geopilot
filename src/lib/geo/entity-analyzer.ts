import nlp from "compromise";
import type { ExtractedData, ExtractedEntity, EntityAnalysis } from "./types";

const PRODUCT_PATTERNS = /\b(product|service|solution|platform|tool|software|app)\b/i;
const BRAND_PATTERN = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;

export function analyzeEntities(data: ExtractedData): EntityAnalysis {
  const doc = nlp(data.textContext);
  const entities: Record<string, ExtractedEntity> = {};

  const addEntity = (name: string, type: string) => {
    const normalized = name.toLowerCase().trim();
    if (!normalized || normalized.length < 2) return;
    if (entities[normalized]) {
      entities[normalized].count += 1;
    } else {
      entities[normalized] = { name: name.trim(), type, count: 1 };
    }
  };

  doc.organizations().out("array").forEach((org: string) => addEntity(org, "Organization"));
  doc.people().out("array").forEach((person: string) => addEntity(person, "Person"));
  doc.places().out("array").forEach((place: string) => addEntity(place, "Location"));

  // Brands — capitalized multi-word phrases
  const brandMatches = data.textContext.match(BRAND_PATTERN) || [];
  brandMatches.forEach((brand) => {
    if (brand.split(" ").length >= 2) addEntity(brand, "Brand");
  });

  // Products from schema
  data.schemas.forEach((schema) => {
    const type = schema["@type"];
    const types = Array.isArray(type) ? type : [type];
    if (types.includes("Product") && schema.name) {
      addEntity(schema.name as string, "Product");
    }
  });

  // Products from text context near keywords
  doc.nouns().out("array").forEach((noun: string) => {
    if (noun.length > 3) {
      const context = data.textContext.toLowerCase();
      const idx = context.indexOf(noun.toLowerCase());
      if (idx >= 0) {
        const snippet = context.slice(Math.max(0, idx - 30), idx + noun.length + 30);
        if (PRODUCT_PATTERNS.test(snippet)) {
          addEntity(noun, "Product");
        } else {
          addEntity(noun, "Topic");
        }
      }
    }
  });

  const sorted = Object.values(entities).sort((a, b) => b.count - a.count).slice(0, 50);
  const density = data.wordCount > 0 ? Math.round((sorted.length / data.wordCount) * 1000) / 10 : 0;

  const byType: Record<string, number> = {};
  sorted.forEach((e) => {
    byType[e.type] = (byType[e.type] || 0) + 1;
  });

  const missingEntities: string[] = [];
  const recommendedEntities: string[] = [];

  if (!byType["Organization"]) {
    missingEntities.push("Organization");
    recommendedEntities.push("Add your company/brand name prominently in content");
  }
  if (!byType["Person"]) {
    missingEntities.push("Author/Person");
    recommendedEntities.push("Include author name and credentials for E-E-A-T");
  }
  if (!byType["Location"] && data.wordCount > 500) {
    recommendedEntities.push("Consider adding location entities if geographically relevant");
  }
  if (!byType["Product"] && PRODUCT_PATTERNS.test(data.textContext)) {
    missingEntities.push("Product");
    recommendedEntities.push("Clearly name products/services with structured data");
  }
  if (sorted.length < 10) {
    recommendedEntities.push("Increase entity-rich vocabulary to improve AI topic understanding");
  }

  const entityScore = Math.min(100, Math.round(
    (Math.min(sorted.length, 30) / 30) * 40 +
    (Math.min(density, 5) / 5) * 30 +
    (Object.keys(byType).length / 6) * 30
  ));

  return {
    entities: sorted,
    density,
    missingEntities,
    recommendedEntities,
    byType,
    score: entityScore,
  };
}
