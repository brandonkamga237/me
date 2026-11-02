import Link from "next/link";
import { HorizontalTrack } from "@/components/motion/HorizontalTrack";
import { Magnetic } from "@/components/motion/Magnetic";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import type { Dictionary } from "@/lib/dictionaries";
import { t } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getProjects } from "@/services/api";

interface ProjectsProps {
  locale: Locale;
  dict: Dictionary;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The work. On wide screens the section pins and the panels travel sideways as you scroll; on
 * phones the intro stays on top and the projects become cards you swipe through.
 */
export async function Projects({ locale, dict }: ProjectsProps) {
  const projects = await getProjects();
  const [first, ...rest] = dict.projects.title.split(" ");

  return (
    <HorizontalTrack id="projects" index="03" className="relative z-10 overflow-hidden border-t border-border bg-bg">
      <div data-track className="flex flex-col md:h-dvh md:w-max md:flex-row md:items-stretch">
        <div className="gutter flex flex-col justify-between gap-10 pb-10 pt-24 md:w-[min(62vw,58rem)] md:shrink-0 md:gap-12 md:py-28">
          <p className="eyebrow text-accent-ink">(03) — {dict.nav.projects}</p>
          <div>
            <h2 id="projects-title" className="display text-[clamp(3.4rem,9.5vw,10rem)]">
              {first}
              <br />
              <span className="text-outline">{rest.join(" ")}</span>
            </h2>
            <p className="mt-8 max-w-md border-l border-accent pl-4 leading-relaxed text-muted">{dict.projects.intro}</p>
          </div>
          <p className="eyebrow flex items-center gap-4 text-muted">
            <span className="tabular-nums text-fg">{pad(projects.length)}</span> — {dict.projects.hint}
            <span aria-hidden className="inline-block animate-pulse text-accent">
              ⟶
            </span>
          </p>
        </div>

        {projects.length === 0 && <p className="gutter pb-24 text-muted md:self-center">{dict.projects.empty}</p>}

        {/* Phones: a native swipe carousel. Wide screens: the wrapper disappears into the track. */}
        <div className="no-scrollbar gutter flex snap-x snap-mandatory gap-4 overflow-x-auto pb-16 scroll-px-[clamp(1.25rem,3.6vw,3.5rem)] md:contents">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="w-[84vw] shrink-0 snap-start md:flex md:w-[min(86vw,78rem)] md:items-center md:pr-[6vw]"
            >
              <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-border bg-panel md:h-[74vh] md:grid-cols-[1.2fr_1fr] md:gap-12 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent">
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  tabIndex={-1}
                  aria-hidden
                  className="group relative block aspect-[4/3] overflow-hidden md:aspect-auto md:rounded-[1.75rem] md:border md:border-border"
                >
                  {/* Wider than its frame, so it can drift against the travel. */}
                  <div data-parallax className="absolute inset-y-0 -left-[6%] w-[112%]">
                    <ProjectVisual project={project} index={i} />
                  </div>
                </Link>
                <div className="flex flex-col justify-between gap-6 p-6 md:gap-8 md:p-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow tabular-nums text-muted">
                      <span className="text-accent">{pad(i + 1)}</span> / {pad(projects.length)}
                    </p>
                    {project.featured && (
                      <span className="eyebrow border border-accent px-2 py-1 text-accent">{dict.projects.featured}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[clamp(2.2rem,5.6vw,6rem)] font-bold uppercase leading-[0.9] tracking-[-0.05em]">
                      <Link href={`/${locale}/projects/${project.slug}`} className="transition-colors hover:text-accent">
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-lg leading-relaxed text-muted md:mt-6 md:text-lg">{t(project.summary, locale)}</p>
                  </div>
                  <div className="grid gap-6">
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 5).map((item) => (
                        <li key={item} className="eyebrow border border-border px-2.5 py-1.5 text-muted">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Magnetic className="self-start">
                      <Link
                        href={`/${locale}/projects/${project.slug}`}
                        className="eyebrow group inline-flex items-center gap-4 rounded-full bg-fg py-2 pl-6 pr-2 text-bg transition-colors hover:bg-accent hover:text-black"
                      >
                        {dict.projects.open}
                        <span className="grid size-9 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 group-hover:-rotate-45">
                          →
                        </span>
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="flex w-[70vw] shrink-0 snap-start items-center md:w-[min(52vw,44rem)] md:pr-[6vw]">
            <a
              href="https://github.com/brandonkamga237?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="group grid w-full gap-6 md:gap-8"
            >
              <span className="grid aspect-square w-32 place-items-center rounded-full border border-border-strong text-5xl transition-[background-color,color,rotate] duration-700 ease-out-expo group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-black md:w-56">
                →
              </span>
              <span className="text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.05em]">
                {dict.projects.all}
              </span>
              <span className="max-w-sm text-muted">{dict.projects.allText}</span>
            </a>
          </div>
        </div>
      </div>

      <div aria-hidden className="gutter pointer-events-none absolute inset-x-0 bottom-8 hidden md:motion-safe:block">
        <div className="h-px bg-border">
          <div data-track-progress className="h-px origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </HorizontalTrack>
  );
}
