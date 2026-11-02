import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import { t } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/services/types";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}

export function ProjectCard({ project, locale, dict }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-border p-6 transition-colors hover:bg-panel">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href={`/${locale}/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        {project.featured && (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted">
            {dict.projects.featured}
          </span>
        )}
      </div>
      <p className="mt-3 text-muted">{t(project.summary, locale)}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((item) => (
          <li key={item} className="rounded-md bg-panel px-2 py-1 font-mono text-xs text-muted group-hover:bg-bg">
            {item}
          </li>
        ))}
      </ul>
      <span aria-hidden className="mt-6 text-sm text-muted transition-transform group-hover:translate-x-1">
        →
      </span>
    </article>
  );
}
