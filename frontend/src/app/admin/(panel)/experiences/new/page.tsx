import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/AdminForm";
import { ExperienceFields } from "@/components/admin/ExperienceFields";
import { PageHeader } from "@/components/admin/PageHeader";
import { saveExperience } from "../actions";

export const metadata: Metadata = { title: "Nouvelle expérience" };

export default function NewExperiencePage() {
  return (
    <>
      <PageHeader title="Nouvelle expérience" back={{ href: "/admin/experiences", label: "Parcours" }} />
      <AdminForm action={saveExperience.bind(null, null)} submitLabel="Ajouter">
        <ExperienceFields />
      </AdminForm>
    </>
  );
}
