"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/lib/admin-form";
import { text } from "@/lib/form-data";
import { endSession, startSession, visitorAddress } from "@/lib/session";
import { login } from "@/services/adminApi";
import { ApiError } from "@/services/http";

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  try {
    const token = await login(text(form, "email"), String(form.get("password") ?? ""), await visitorAddress());
    await startSession(token.access_token, new Date(token.expires_at));
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    const message =
      error.status === 429
        ? "Trop de tentatives. Réessaie dans quelques minutes."
        : "E-mail ou mot de passe incorrect.";
    return { message, errors: {} };
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
