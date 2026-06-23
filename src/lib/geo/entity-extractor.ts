import nlp from "compromise";

export interface ExtractedEntity {
  name: string;
  type: string;
  count: number;
}

export function extractEntities(text: string): ExtractedEntity[] {
  const doc = nlp(text);
  
  const entities: Record<string, ExtractedEntity> = {};

  const addEntity = (name: string, type: string) => {
    const normalized = name.toLowerCase().trim();
    if (!normalized || normalized.length < 2) return;
    
    if (entities[normalized]) {
      entities[normalized].count += 1;
    } else {
      entities[normalized] = { name, type, count: 1 };
    }
  };

  // Organizations
  doc.organizations().out('array').forEach((org: string) => addEntity(org, "Organization"));
  
  // People
  doc.people().out('array').forEach((person: string) => addEntity(person, "Person"));
  
  // Places/Locations
  doc.places().out('array').forEach((place: string) => addEntity(place, "Location"));
  
  // Topics / Nouns (fallback for concepts)
  doc.nouns().out('array').forEach((noun: string) => {
    if (noun.length > 3) addEntity(noun, "Topic");
  });

  return Object.values(entities).sort((a, b) => b.count - a.count).slice(0, 50); // Top 50 entities
}
