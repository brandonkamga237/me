"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface LanguageSwitchProps {
  locale: Locale;
  label: string;
}

export function LanguageSwitch({ locale, label }: LanguageSwitchProps) {
  const pathname = usePathname();
  const other: Locale = locale === "en" ? "fr" : "en";
  const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${other}`);
  return (
    <Link
      href={href}
      hrefLang={other}
      className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-fg"
    >
      {label}
    </Link>
  );
}
