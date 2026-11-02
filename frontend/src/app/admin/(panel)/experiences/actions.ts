"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/lib/admin-form";
import { localized, optional, text } from "@/lib/form-data";
import { formError } from "@/lib/form-errors";
import { adminApi } from "@/services/adminApi";
import { contentTags } from "@/services/api";
import type { ExperienceInput } from "@/services/types";

function experienceInput(form: FormData): ExperienceInput {
  return {
    company: text(form, "company"),
    role: localized(form, "role"),
    location: text(form, "location"),
    start: text(form, "start"),
    end: optional(form, "end"),
    description: localized(form, "description"),
    url: optional(form, "url"),
  };
}

export async function saveExperience(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    if (id) await adminApi.updateExperience(id, experienceInput(form));
    else await adminApi.createExperience(experienceInput(form));
  } catch (error) {
    return formError(error);
  }
  updateTag(contentTags.experiences);
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string): Promise<void> {
  await adminApi.deleteExperience(id);
  updateTag(contentTags.experiences);
  redirect("/admin/experiences");
}
