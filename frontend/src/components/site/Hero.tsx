import { Terminal } from "@/components/site/Terminal";
import type { Dictionary } from "@/lib/dictionaries";
import { t } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getProfile } from "@/services/api";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export async function Hero({ locale, dict }: HeroProps) {
  const profile = await getProfile();
  return (
    <section className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr]">
      <div>
        {profile && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted">
            <span className={`size-2 rounded-full ${profile.available ? "bg-success" : "bg-muted"}`} />
            {profile.available ? dict.hero.available : dict.hero.unavailable}
          </p>
        )}
        <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">{profile?.name ?? "Brandon Kamga"}</h1>
        {profile && <p className="mt-4 text-xl text-fg sm:text-2xl">{t(profile.headline, locale)}</p>}
        {profile && <p className="mt-2 font-mono text-sm uppercase tracking-widest text-muted">{profile.location}</p>}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            {dict.hero.contact}
          </a>
          <a
            href="#projects"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-panel"
          >
            {dict.hero.projects}
          </a>
        </div>
      </div>
      <Terminal />
    </section>
  );
}
