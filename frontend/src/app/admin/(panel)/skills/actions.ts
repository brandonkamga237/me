"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/lib/admin-form";
import { integer, optional, text } from "@/lib/form-data";
import { formError } from "@/lib/form-errors";
import { adminApi } from "@/services/adminApi";
import { contentTags } from "@/services/api";
import type { SkillCategory, SkillInput } from "@/services/types";

function skillInput(form: FormData): SkillInput {
  return {
    name: text(form, "name"),
    category: text(form, "category") as SkillCategory,
    icon: optional(form, "icon"),
    position: integer(form, "position"),
  };
}

export async function saveSkill(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    if (id) await adminApi.updateSkill(id, skillInput(form));
    else await adminApi.createSkill(skillInput(form));
  } catch (error) {
    return formError(error);
  }
  updateTag(contentTags.skills);
  redirect("/admin/skills");
}

export async function deleteSkill(id: string): Promise<void> {
  await adminApi.deleteSkill(id);
  updateTag(contentTags.skills);
  redirect("/admin/skills");
}
