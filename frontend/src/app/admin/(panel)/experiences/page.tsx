import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { formMonth } from "@/app/admin/(panel)/experiences/format";
import { adminApi } from "@/services/adminApi";

export const metadata: Metadata = { title: "Parcours" };

export default function ExperiencesPage() {
  return (
    <>
      <PageHeader title="Parcours" action={{ href: "/admin/experiences/new", label: "Nouvelle expérience" }} />
      <Suspense fallback={<Skeleton className="h-64" />}>
        <ExperienceTable />
      </Suspense>
    </>
  );
}

async function ExperienceTable() {
  const experiences = await adminApi.listExperiences();
  if (experiences.length === 0) return <p className="text-muted">Aucune expérience pour l&apos;instant.</p>;
  return (
    <ul className="divide-y divide-border rounded-xl border border-border">
      {experiences.map((e) => (
        <li key={e.id}>
          <Link href={`/admin/experiences/${e.id}`} className="flex flex-wrap justify-between gap-2 px-4 py-3 hover:bg-panel">
            <span>
              <span className="font-medium">{e.role.fr}</span> · {e.company}
            </span>
            <span className="font-mono text-sm text-muted">
              {formMonth(e.start)} — {e.end ? formMonth(e.end) : "aujourd'hui"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
