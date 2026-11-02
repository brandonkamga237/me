import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { categoryLabels } from "@/components/admin/SkillFields";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";

export const metadata: Metadata = { title: "Compétences" };

export default function SkillsPage() {
  return (
    <>
      <PageHeader title="Compétences" action={{ href: "/admin/skills/new", label: "Nouvelle compétence" }} />
      <Suspense fallback={<Skeleton className="h-64" />}>
        <SkillList />
      </Suspense>
    </>
  );
}

async function SkillList() {
  const skills = await adminApi.listSkills();
  if (skills.length === 0) return <p className="text-muted">Aucune compétence pour l&apos;instant.</p>;
  return (
    <div className="space-y-6">
      {categoryLabels.map(([category, label]) => {
        const items = skills.filter((s) => s.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category}>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">{label}</h2>
            <ul className="flex flex-wrap gap-2">
              {items.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/skills/${s.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-panel"
                  >
                    {s.icon && <BrandIcon slug={s.icon} />}
                    {s.name}
                    <span className="font-mono text-xs text-muted">{s.position}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
