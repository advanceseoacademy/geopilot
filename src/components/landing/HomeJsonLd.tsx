import { buildHomePageSchema, serializeJsonLd } from "@/lib/seo/home-schema";

export function HomeJsonLd() {
  const schema = buildHomePageSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
