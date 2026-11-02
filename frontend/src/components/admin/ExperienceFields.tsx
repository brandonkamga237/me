import { LocalizedField, TextField } from "@/components/admin/fields";
import type { Experience } from "@/services/types";

interface ExperienceFieldsProps {
  experience?: Experience;
}

export function ExperienceFields({ experience }: ExperienceFieldsProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="company" label="Organisation" defaultValue={experience?.company} required />
        <TextField name="location" label="Lieu" defaultValue={experience?.location} />
      </div>
      <LocalizedField name="role" label="Rôle" defaultValue={experience?.role} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="start" label="Début" type="date" defaultValue={experience?.start} />
        <TextField name="end" label="Fin" type="date" defaultValue={experience?.end} hint="Vide : poste actuel." />
      </div>
      <LocalizedField name="description" label="Description" defaultValue={experience?.description} multiline />
      <TextField name="url" label="Site de l'organisation" type="url" defaultValue={experience?.url} />
    </>
  );
}
