import Link from "next/link";
import { LanguageSwitch } from "@/components/site/LanguageSwitch";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  const links = [
    ["about", dict.nav.about],
    ["experience", dict.nav.experience],
    ["projects", dict.nav.projects],
    ["skills", dict.nav.skills],
    ["writing", dict.nav.writing],
    ["contact", dict.nav.contact],
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        {dict.nav.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href={`/${locale}`} className="font-semibold tracking-tight">
          Brandon Kamga
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm text-muted md:flex">
          {links.map(([id, label]) => (
            <Link key={id} href={`/${locale}#${id}`} className="transition-colors hover:text-fg">
              {label}
            </Link>
          ))}
        </nav>
        <LanguageSwitch locale={locale} label={dict.nav.language} />
      </div>
    </header>
  );
}
