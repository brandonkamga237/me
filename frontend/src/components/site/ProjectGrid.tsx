import { ProjectCard } from "@/components/site/ProjectCard";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getProjects } from "@/services/api";

interface ProjectGridProps {
  locale: Locale;
  dict: Dictionary;
}

export async function ProjectGrid({ locale, dict }: ProjectGridProps) {
  const projects = await getProjects();
  if (projects.length === 0) return <p className="text-muted">{dict.projects.empty}</p>;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} locale={locale} dict={dict} />
      ))}
    </div>
  );
}
