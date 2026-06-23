export interface LanguageAnalysis {
  primaryLanguage: string;
  languages: { code: string; percentage: number }[];
  isMultilingual: boolean;
  score: number;
  recommendations: string[];
}

const LANG_PATTERNS: { code: string; name: string; pattern: RegExp }[] = [
  { code: "en", name: "English", pattern: /[a-zA-Z]/ },
  { code: "bn", name: "Bengali", pattern: /[\u0980-\u09FF]/ },
  { code: "hi", name: "Hindi", pattern: /[\u0900-\u097F]/ },
  { code: "ar", name: "Arabic", pattern: /[\u0600-\u06FF]/ },
  { code: "zh", name: "Chinese", pattern: /[\u4E00-\u9FFF]/ },
  { code: "ja", name: "Japanese", pattern: /[\u3040-\u30FF\u4E00-\u9FFF]/ },
  { code: "ko", name: "Korean", pattern: /[\uAC00-\uD7AF]/ },
  { code: "es", name: "Spanish", pattern: /\b(el|la|los|las|de|en|que|es|un|una)\b/i },
  { code: "fr", name: "French", pattern: /\b(le|la|les|de|en|que|est|un|une|des)\b/i },
  { code: "de", name: "German", pattern: /\b(der|die|das|und|ist|ein|eine|nicht)\b/i },
];

export function analyzeLanguage(text: string, htmlLang?: string): LanguageAnalysis {
  const recommendations: string[] = [];
  const totalChars = text.length || 1;
  const languages: { code: string; percentage: number; name: string }[] = [];

  for (const lang of LANG_PATTERNS) {
    const matches = text.match(new RegExp(lang.pattern.source, "g"));
    const count = matches?.length || 0;
    if (count > 10) {
      languages.push({ code: lang.code, name: lang.name, percentage: Math.round((count / totalChars) * 1000) / 10 });
    }
  }

  languages.sort((a, b) => b.percentage - a.percentage);
  const primaryLanguage = htmlLang?.split("-")[0] || languages[0]?.code || "unknown";
  const isMultilingual = languages.length > 1;

  let score = 60;
  if (htmlLang) score += 20;
  if (languages.length > 0) score += 10;
  if (isMultilingual) score += 10;

  if (!htmlLang) {
    recommendations.push("Add lang attribute to <html> tag for language clarity");
  }
  if (isMultilingual) {
    recommendations.push("Use hreflang tags for multilingual content targeting");
  }

  return {
    primaryLanguage: LANG_PATTERNS.find((l) => l.code === primaryLanguage)?.name || primaryLanguage,
    languages: languages.slice(0, 5).map((l) => ({ code: l.code, percentage: l.percentage })),
    isMultilingual,
    score: Math.min(100, score),
    recommendations,
  };
}
