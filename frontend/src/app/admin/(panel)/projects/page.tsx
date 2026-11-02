import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";

export const metadata: Metadata = { title: "Projets" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projets" action={{ href: "/admin/projects/new", label: "Nouveau projet" }} />
      <Suspense fallback={<Skeleton className="h-64" />}>
        <ProjectTable />
      </Suspense>
    </>
  );
}

async function ProjectTable() {
  const projects = await adminApi.listProjects();
  if (projects.length === 0) return <p className="text-muted">Aucun projet pour l&apos;instant.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-panel text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Ordre</th>
            <th className="px-4 py-3 font-medium">Titre</th>
            <th className="px-4 py-3 font-medium">État</th>
            <th className="px-4 py-3 font-medium">Technologies</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-panel">
              <td className="px-4 py-3 font-mono text-muted">{p.position}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <p className="font-mono text-xs text-muted">/{p.slug}</p>
              </td>
              <td className="px-4 py-3">
                {p.published ? "Publié" : "Brouillon"}
                {p.featured && " · À la une"}
              </td>
              <td className="px-4 py-3 text-muted">{p.stack.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
