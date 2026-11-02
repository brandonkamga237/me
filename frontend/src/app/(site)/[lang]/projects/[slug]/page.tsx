import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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
    <Suspense fallback={<Skeleton className="my-20 h-[32rem]" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/[lang]/projects/[slug]">, "params">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || slug === PLACEHOLDER) notFound();
  const [project, dict] = await Promise.all([getProject(slug), getDictionary(lang)]);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl py-16 sm:py-24">
      <Link href={`/${lang}#projects`} className="text-sm text-muted hover:text-fg">
        ← {dict.projects.back}
      </Link>
      <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">{project.title}</h1>
      <p className="mt-4 text-xl text-muted">{t(project.summary, lang)}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg hover:opacity-85">
            {dict.projects.live} ↗
          </a>
        )}
        {project.repo_url && (
          <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-panel">
            {dict.projects.code} ↗
          </a>
        )}
      </div>
      {project.cover_url && (
        <Image src={project.cover_url} alt="" width={1200} height={630} priority className="mt-12 w-full rounded-2xl border border-border" />
      )}
      <div className="mt-12 space-y-5 text-lg leading-relaxed">
        {t(project.description, lang)
          .split(/\n{2,}/)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </div>
      <h2 className="mt-12 font-mono text-xs uppercase tracking-widest text-muted">{dict.projects.stack}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item} className="rounded-md bg-panel px-2.5 py-1 font-mono text-sm">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
