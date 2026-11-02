"use server";

import { updateTag } from "next/cache";
import type { FormState } from "@/lib/admin-form";
import { checked, localized, optional, text } from "@/lib/form-data";
import { formError } from "@/lib/form-errors";
import { adminApi } from "@/services/adminApi";
import { contentTags } from "@/services/api";

/** One link per line, written as `Label | https://…`. */
function socials(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([label, url]) => label && url)
    .map(([label, url]) => ({ label, url }));
}

export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  try {
    await adminApi.saveProfile({
      name: text(form, "name"),
      headline: localized(form, "headline"),
      bio: localized(form, "bio"),
      location: text(form, "location"),
      email: text(form, "email"),
      available: checked(form, "available"),
      resume_url: optional(form, "resume_url"),
      socials: socials(text(form, "socials")),
    });
  } catch (error) {
    return formError(error);
  }
  updateTag(contentTags.profile);
  return { notice: "Profil enregistré. Le site est à jour.", errors: {} };
}
