import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { SkillFields } from "@/components/admin/SkillFields";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";
import { deleteSkill, saveSkill } from "../actions";

export const metadata: Metadata = { title: "Modifier la compétence" };

export default function EditSkillPage({ params }: PageProps<"/admin/skills/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-64 max-w-3xl" />}>
      <EditSkill params={params} />
    </Suspense>
  );
}

async function EditSkill({ params }: Pick<PageProps<"/admin/skills/[id]">, "params">) {
  const { id } = await params;
  const skill = (await adminApi.listSkills()).find((s) => s.id === id);
  if (!skill) notFound();
  return (
    <>
      <PageHeader title={skill.name} back={{ href: "/admin/skills", label: "Compétences" }} />
      <AdminForm action={saveSkill.bind(null, skill.id)}>
        <SkillFields skill={skill} />
      </AdminForm>
      <div className="mt-12 max-w-3xl border-t border-border pt-6">
        <ConfirmButton action={deleteSkill.bind(null, skill.id)} confirmation={`Supprimer « ${skill.name} » ?`}>
          Supprimer cette compétence
        </ConfirmButton>
      </div>
    </>
  );
}
