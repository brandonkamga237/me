import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/AdminForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { SkillFields } from "@/components/admin/SkillFields";
import { saveSkill } from "../actions";

export const metadata: Metadata = { title: "Nouvelle compétence" };

export default function NewSkillPage() {
  return (
    <>
      <PageHeader title="Nouvelle compétence" back={{ href: "/admin/skills", label: "Compétences" }} />
      <AdminForm action={saveSkill.bind(null, null)} submitLabel="Ajouter">
        <SkillFields />
      </AdminForm>
    </>
  );
}
