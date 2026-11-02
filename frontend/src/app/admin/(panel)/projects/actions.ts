"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/lib/admin-form";
import { checked, integer, list, localized, optional, text } from "@/lib/form-data";
import { formError } from "@/lib/form-errors";
import { adminApi } from "@/services/adminApi";
import { contentTags } from "@/services/api";
import type { ProjectInput } from "@/services/types";

function projectInput(form: FormData): ProjectInput {
  return {
    title: text(form, "title"),
    slug: optional(form, "slug"),
    summary: localized(form, "summary"),
    description: localized(form, "description"),
    stack: list(form, "stack"),
    repo_url: optional(form, "repo_url"),
    live_url: optional(form, "live_url"),
    cover_url: optional(form, "cover_url"),
    featured: checked(form, "featured"),
    published: checked(form, "published"),
    position: integer(form, "position"),
  };
}

export async function saveProject(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    if (id) await adminApi.updateProject(id, projectInput(form));
    else await adminApi.createProject(projectInput(form));
  } catch (error) {
    return formError(error);
  }
  updateTag(contentTags.projects);
  redirect("/admin/projects");
}

export async function deleteProject(id: string): Promise<void> {
  await adminApi.deleteProject(id);
  updateTag(contentTags.projects);
  redirect("/admin/projects");
}
