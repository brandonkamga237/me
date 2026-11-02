import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/AdminForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectFields } from "@/components/admin/ProjectFields";
import { saveProject } from "../actions";

export const metadata: Metadata = { title: "Nouveau projet" };

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="Nouveau projet" back={{ href: "/admin/projects", label: "Projets" }} />
      <AdminForm action={saveProject.bind(null, null)} submitLabel="Créer le projet">
        <ProjectFields />
      </AdminForm>
    </>
  );
}
