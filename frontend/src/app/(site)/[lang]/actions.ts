"use server";

import { z } from "zod";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { visitorAddress } from "@/lib/session";
import { ApiError, apiFetch } from "@/services/http";

export interface ContactState {
  status: "idle" | "success" | "error";
  errors: Partial<Record<"name" | "email" | "message" | "form", string>>;
}

export async function sendMessage(locale: string, _: ContactState, formData: FormData): Promise<ContactState> {
  const dict = await getDictionary(hasLocale(locale) ? locale : "en");
  const errors = dict.contact.errors;
  const schema = z.object({
    name: z.string().trim().min(1, errors.name).max(160, errors.name),
    email: z.email(errors.email),
    message: z.string().trim().min(10, errors.message).max(4000, errors.message),
    website: z.string().default(""),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      errors: { name: fieldErrors.name?.[0], email: fieldErrors.email?.[0], message: fieldErrors.message?.[0] },
    };
  }

  const { name, email, message, website } = parsed.data;
  try {
    await apiFetch("/api/messages", {
      method: "POST",
      body: { name, email, body: message, website },
      forwardedFor: await visitorAddress(),
    });
    return { status: "success", errors: {} };
  } catch (error) {
    const throttled = error instanceof ApiError && error.status === 429;
    return { status: "error", errors: { form: throttled ? errors.throttled : errors.unexpected } };
  }
}
