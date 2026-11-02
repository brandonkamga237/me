import { CheckboxField, LocalizedField, TextField } from "@/components/admin/fields";
import type { Project } from "@/services/types";

interface ProjectFieldsProps {
  project?: Project;
}

export function ProjectFields({ project }: ProjectFieldsProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="title" label="Titre" defaultValue={project?.title} required />
        <TextField name="slug" label="Adresse (slug)" defaultValue={project?.slug} hint="Vide : déduite du titre." />
      </div>
      <LocalizedField name="summary" label="Résumé (une phrase)" defaultValue={project?.summary} />
      <LocalizedField name="description" label="Description" defaultValue={project?.description} multiline />
      <TextField name="stack" label="Technologies" defaultValue={project?.stack.join(", ")} hint="Séparées par des virgules." />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="repo_url" label="Code source" type="url" defaultValue={project?.repo_url} />
        <TextField name="live_url" label="Site en ligne" type="url" defaultValue={project?.live_url} />
      </div>
      <div className="grid gap-6 sm:grid-cols-[1fr_8rem]">
        <TextField name="cover_url" label="Image de couverture" type="url" defaultValue={project?.cover_url} />
        <TextField name="position" label="Ordre" type="number" defaultValue={project?.position ?? 0} />
      </div>
      <div className="flex gap-6">
        <CheckboxField name="published" label="Publié" defaultChecked={project?.published} />
        <CheckboxField name="featured" label="À la une" defaultChecked={project?.featured} />
      </div>
    </>
  );
}
