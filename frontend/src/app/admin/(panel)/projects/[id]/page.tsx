import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectFields } from "@/components/admin/ProjectFields";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminApi } from "@/services/adminApi";
import { ApiError } from "@/services/http";
import { deleteProject, saveProject } from "../actions";

export const metadata: Metadata = { title: "Modifier le projet" };

export default function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem] max-w-3xl" />}>
      <EditProject params={params} />
    </Suspense>
  );
}

async function EditProject({ params }: Pick<PageProps<"/admin/projects/[id]">, "params">) {
  const { id } = await params;
  const project = await adminApi.getProject(id).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });
  return (
    <>
      <PageHeader title={project.title} back={{ href: "/admin/projects", label: "Projets" }} />
      <AdminForm action={saveProject.bind(null, project.id)}>
        <ProjectFields project={project} />
      </AdminForm>
      <div className="mt-12 max-w-3xl border-t border-border pt-6">
        <ConfirmButton action={deleteProject.bind(null, project.id)} confirmation={`Supprimer « ${project.title} » ?`}>
          Supprimer ce projet
        </ConfirmButton>
      </div>
    </>
  );
}
