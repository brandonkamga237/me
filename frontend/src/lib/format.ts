import type { Locale } from "@/lib/i18n";
import type { Localized } from "@/services/types";

export function t(text: Localized, locale: Locale): string {
  return text[locale];
}

export function formatMonth(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(isoDate),
  );
}

export function formatDay(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(isoDate),
  );
}
