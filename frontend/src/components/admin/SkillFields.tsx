import { SelectField, TextField } from "@/components/admin/fields";
import type { Skill } from "@/services/types";

export const categoryLabels = [
  ["language", "Langages"],
  ["backend", "Backend"],
  ["frontend", "Frontend"],
  ["data", "Données"],
  ["platform", "Plateforme"],
  ["practice", "Pratiques"],
] as const;

interface SkillFieldsProps {
  skill?: Skill;
}

export function SkillFields({ skill }: SkillFieldsProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="Nom" defaultValue={skill?.name} required />
        <SelectField name="category" label="Catégorie" options={categoryLabels} defaultValue={skill?.category ?? "language"} />
      </div>
      <div className="grid gap-6 sm:grid-cols-[1fr_8rem]">
        <TextField
          name="icon"
          label="Logo"
          defaultValue={skill?.icon}
          hint="L'identifiant Simple Icons (simpleicons.org), par exemple springboot ou nextdotjs."
        />
        <TextField name="position" label="Ordre" type="number" defaultValue={skill?.position ?? 0} />
      </div>
    </>
  );
}
