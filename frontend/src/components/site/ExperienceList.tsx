import type { Dictionary } from "@/lib/dictionaries";
import { formatMonth, t } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getExperiences } from "@/services/api";

interface ExperienceListProps {
  locale: Locale;
  dict: Dictionary;
}

export async function ExperienceList({ locale, dict }: ExperienceListProps) {
  const experiences = await getExperiences();
  if (experiences.length === 0) return <p className="text-muted">{dict.experience.empty}</p>;
  return (
    <ol className="divide-y divide-border border-y border-border">
      {experiences.map((e) => (
        <li key={e.id} className="grid gap-2 py-8 sm:grid-cols-[12rem_1fr] sm:gap-8">
          <p className="font-mono text-sm text-muted">
            {formatMonth(e.start, locale)} — {e.end ? formatMonth(e.end, locale) : dict.experience.present}
          </p>
          <div>
            <h3 className="text-lg font-semibold">
              {t(e.role, locale)} ·{" "}
              {e.url ? (
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  {e.company}
                </a>
              ) : (
                e.company
              )}
            </h3>
            <p className="text-sm text-muted">{e.location}</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{t(e.description, locale)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
