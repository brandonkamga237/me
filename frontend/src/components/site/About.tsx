import { Reveal } from "@/components/motion/Reveal";
import { Stickers } from "@/components/motion/Stickers";
import { CameroonFlag } from "@/components/site/CameroonFlag";
import { Clock } from "@/components/site/Clock";
import { BrowserFrame } from "@/components/site/DeviceFrames";
import { PhotoSticker } from "@/components/site/PhotoSticker";
import { BrandIcon } from "@/components/ui/BrandIcon";
import type { Dictionary } from "@/lib/dictionaries";
import { formatMonth, t } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { projectShots } from "@/lib/project-media";
import { getExperiences, getProfile } from "@/services/api";

interface AboutProps {
  locale: Locale;
  dict: Dictionary;
}

const CORE_STACK = [
  ["openjdk", "Java"],
  ["springboot", "Spring"],
  ["go", "Go"],
  ["typescript", "TypeScript"],
  ["python", "Python"],
] as const;

/**
 * A paper section sliding over the hero: one short statement, then cards that show rather than
 * tell. The full bio waits behind "read more".
 */
export async function About({ locale, dict }: AboutProps) {
  const [profile, experiences] = await Promise.all([getProfile(), getExperiences()]);
  const bio = profile ? t(profile.bio, locale).split(/\n{2,}/) : [];
  const lescracks = projectShots.lescracks;
  const name = profile?.name ?? "Brandon Kamga";

  return (
    <Reveal
      as="section"
      id="about"
      index="01"
      className="mode-light gutter relative z-10 -mt-10 rounded-t-[2.5rem] py-24 md:py-32"
    >
      <div className="mb-10 flex items-center gap-4 md:mb-14">
        <h2 className="eyebrow shrink-0 text-accent-ink">(01) — {dict.about.title}</h2>
        <span data-line className="h-px flex-1 bg-border" />
      </div>

      <p
        data-split
        className="max-w-[18ch] text-[clamp(2.2rem,5.6vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
      >
        {dict.about.statement}
      </p>

      <div data-fade-stagger className="mt-14 grid gap-3 md:mt-20 md:grid-cols-12 md:gap-4">
        {/* The portrait, on a black card, draggable like the hero stickers. */}
        <Stickers className="relative grid min-h-[26rem] place-items-center overflow-hidden rounded-[1.75rem] bg-black p-8 text-white md:col-span-4 md:row-span-2 md:min-h-0">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [--grid:rgba(255,255,255,0.05)]" />
          <PhotoSticker alt={name} tilt={4} className="w-[min(16rem,70%)]" sizes="16rem" />
          <p className="eyebrow absolute bottom-6 left-6 text-white/60">{dict.about.photo}</p>
        </Stickers>

        <a
          href="https://lescracks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative grid min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-black p-7 text-white md:col-span-8 md:grid-cols-2 md:p-9"
        >
          <div className="relative z-10 flex flex-col justify-between gap-8">
            <p className="eyebrow text-white/60">{dict.about.founder}</p>
            <div>
              <p className="text-[clamp(2.6rem,4.6vw,4.4rem)] font-bold leading-none tracking-[-0.05em]">
                Les<span className="text-accent">Cracks</span>
              </p>
              <p className="mt-4 max-w-xs text-white/70">{dict.about.founderText}</p>
            </div>
            <span className="eyebrow inline-flex items-center gap-3 text-accent">
              lescracks.com
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </span>
          </div>
          {lescracks && (
            <BrowserFrame
              src={lescracks.desktop}
              host={lescracks.host}
              sizes="(min-width: 768px) 32rem, 90vw"
              className="mt-8 w-[150%] max-w-none -rotate-3 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:rotate-[-1deg] md:absolute md:-bottom-16 md:-right-24 md:mt-0 md:w-[62%]"
            />
          )}
        </a>

        <div className="flex min-h-[15rem] flex-col justify-between rounded-[1.75rem] border border-border bg-card p-7 md:col-span-4">
          <p className="eyebrow flex items-center gap-2 text-muted">
            {dict.about.basedIn} <CameroonFlag />
          </p>
          <div>
            <p className="text-5xl font-bold tracking-[-0.05em]">Yaoundé</p>
            <p className="eyebrow mt-3 text-muted">
              <Clock className="text-fg" /> · 3.8480° N 11.5021° E
            </p>
          </div>
        </div>

        <div className="flex min-h-[15rem] flex-col justify-between rounded-[1.75rem] bg-accent p-7 text-black md:col-span-4">
          <p className="eyebrow font-semibold">$ {dict.about.stack}</p>
          <ul className="flex flex-wrap gap-2">
            {CORE_STACK.map(([icon, label]) => (
              <li key={icon} className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-black px-3.5 py-2 text-sm font-medium text-white">
                <BrandIcon slug={icon} className="size-4" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {bio.length > 0 && (
        <details data-fade className="group mt-4 rounded-[1.75rem] border border-border md:mt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-7 [&::-webkit-details-marker]:hidden">
            <span className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">{dict.about.readMore}</span>
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-xl text-bg transition-transform duration-500 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="grid gap-5 px-7 pb-8 text-lg leading-relaxed md:columns-2 md:block md:gap-12 [&>p]:mb-5 [&>p]:break-inside-avoid">
            {bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      )}

      {experiences.length > 0 && (
        <div className="mt-24 md:mt-32">
          <h3 className="eyebrow mb-6 text-muted">{dict.about.experience}</h3>
          <ol data-fade-stagger className="border-t border-border">
            {experiences.map((e) => (
              <li key={e.id} className="grid gap-3 border-b border-border py-8 md:grid-cols-12 md:gap-8">
                <p className="eyebrow pt-2 text-muted md:col-span-3">
                  {formatMonth(e.start, locale)} — {e.end ? formatMonth(e.end, locale) : dict.experience.present}
                </p>
                <div className="md:col-span-4">
                  <p className="text-2xl font-semibold tracking-[-0.03em]">{t(e.role, locale)}</p>
                  <p className="mt-1 text-muted">
                    {e.url ? (
                      <a href={e.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                        {e.company}
                      </a>
                    ) : (
                      e.company
                    )}{" "}
                    · {e.location}
                  </p>
                </div>
                <p className="leading-relaxed text-muted md:col-span-5">{t(e.description, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Reveal>
  );
}
