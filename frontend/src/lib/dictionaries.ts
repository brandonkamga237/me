import "server-only";
import type { Locale } from "@/lib/i18n";
import type en from "@/lib/dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/lib/dictionaries/en.json").then((m) => m.default),
  fr: () => import("@/lib/dictionaries/fr.json").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
