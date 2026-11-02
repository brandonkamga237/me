import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectArt } from "@/components/site/ProjectArt";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDictionary } from "@/lib/dictionaries";
import { t } from "@/lib/format";
import { hasLocale } from "@/lib/i18n";
import { getProject, getProjects } from "@/services/api";

// Cache Components needs at least one value at build time, even when the API is not reachable then.
const PLACEHOLDER = "__placeholder__";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.length > 0 ? projects.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = slug === PLACEHOLDER ? null : await getProject(slug);
  if (!project || !hasLocale(lang)) return {};
  return {
    title: project.title,
    description: t(project.summary, lang),
    alternates: { canonical: `/${lang}/projects/${slug}`, languages: { en: `/en/projects/${slug}`, fr: `/fr/projects/${slug}` } },
  };
}

export default function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="gutter pb-24 pt-40">
          <Skeleton className="h-[70vh]" />
        </div>
      }
    >
      <ProjectContent params={params} />
    </Suspense>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

async function ProjectContent({ params }: Pick<PageProps<"/[lang]/projects/[slug]">, "params">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || slug === PLACEHOLDER) notFound();
  const [project, projects, dict] = await Promise.all([getProject(slug), getProjects(), getDictionary(lang)]);
  if (!project) notFound();
  const position = Math.max(0, projects.findIndex((p) => p.slug === slug));
  const next = projects.length > 1 ? projects[(position + 1) % projects.length] : null;

  return (
    <article>
      <Reveal className="gutter relative pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link href={`/${lang}#projects`} className="eyebrow group inline-flex items-center gap-3 text-muted hover:text-fg">
            <span aria-hidden className="transition-transform duration-500 group-hover:-translate-x-1">
              ←
            </span>
            {dict.projects.back}
          </Link>
          <p className="eyebrow tabular-nums text-muted">
            <span className="text-accent">{pad(position + 1)}</span> / {pad(projects.length)}
          </p>
        </div>
        <h1 data-split className="display text-[clamp(3.6rem,13vw,14rem)]">
          {project.title}
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <p data-fade className="text-2xl leading-snug tracking-[-0.02em] md:col-span-7 md:text-3xl">
            {t(project.summary, lang)}
          </p>
          <div data-fade className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            {project.live_url && (
              <Magnetic>
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex rounded-full bg-accent px-6 py-4 text-black transition-colors hover:bg-white"
                >
                  {dict.projects.live} ↗
                </a>
              </Magnetic>
            )}
            {project.repo_url && (
              <Magnetic>
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex rounded-full border border-border-strong px-6 py-4 transition-colors hover:bg-fg hover:text-bg"
                >
                  {dict.projects.code} ↗
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </Reveal>

      <div className="gutter">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border md:aspect-[21/9]">
          {project.cover_url ? (
            <Image src={project.cover_url} alt="" fill priority sizes="100vw" className="object-cover" />
          ) : (
            <ProjectArt slug={project.slug} index={position} />
          )}
        </div>
      </div>

      <Reveal className="gutter grid gap-12 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-4">
          <h2 className="eyebrow mb-5 text-accent-ink">{dict.projects.stack}</h2>
          <ul data-fade-stagger className="flex flex-wrap gap-2 md:flex-col md:items-start">
            {project.stack.map((item) => (
              <li key={item} className="eyebrow border border-border px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div data-fade-stagger className="grid gap-6 text-xl leading-relaxed text-muted md:col-span-7 md:col-start-6">
          {t(project.description, lang)
            .split(/\n{2,}/)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </div>
      </Reveal>

      {next && (
        <Link
          href={`/${lang}/projects/${next.slug}`}
          className="group gutter block border-t border-border py-20 transition-colors hover:bg-panel md:py-28"
        >
          <span className="eyebrow text-muted">{dict.projects.open} →</span>
          <span className="mt-6 flex items-end justify-between gap-6">
            <span className="display text-outline text-[clamp(3rem,10vw,10rem)] transition-colors duration-500 group-hover:text-fg">
              {next.title}
            </span>
            <span
              aria-hidden
              className="mb-4 grid size-16 shrink-0 place-items-center rounded-full border border-border-strong text-2xl transition-[background-color,color,rotate] duration-500 group-hover:-rotate-45 group-hover:bg-accent group-hover:text-black md:size-24"
            >
              →
            </span>
          </span>
        </Link>
      )}
    </article>
  );
}
