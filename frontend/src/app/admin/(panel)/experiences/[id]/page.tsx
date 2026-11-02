import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ExperienceFields } from "@/components/admin/ExperienceFields";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";
import { deleteExperience, saveExperience } from "../actions";

export const metadata: Metadata = { title: "Modifier l'expérience" };

export default function EditExperiencePage({ params }: PageProps<"/admin/experiences/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[36rem] max-w-3xl" />}>
      <EditExperience params={params} />
    </Suspense>
  );
}

async function EditExperience({ params }: Pick<PageProps<"/admin/experiences/[id]">, "params">) {
  const { id } = await params;
  const experience = (await adminApi.listExperiences()).find((e) => e.id === id);
  if (!experience) notFound();
  return (
    <>
      <PageHeader title={experience.company} back={{ href: "/admin/experiences", label: "Parcours" }} />
      <AdminForm action={saveExperience.bind(null, experience.id)}>
        <ExperienceFields experience={experience} />
      </AdminForm>
      <div className="mt-12 max-w-3xl border-t border-border pt-6">
        <ConfirmButton action={deleteExperience.bind(null, experience.id)} confirmation={`Supprimer « ${experience.company} » ?`}>
          Supprimer cette expérience
        </ConfirmButton>
      </div>
    </>
  );
}
