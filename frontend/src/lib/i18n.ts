export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Picks the first supported language of an Accept-Language header, by preference weight. */
export function preferredLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.split("-")[0].toLowerCase(), weight: q ? Number(q.trim().slice(2)) : 1 };
    })
    .sort((a, b) => b.weight - a.weight);
  return ranked.map((r) => r.lang).find(hasLocale) ?? defaultLocale;
}
