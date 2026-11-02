import "server-only";
import type { FormState } from "@/lib/admin-form";
import { ApiError, type ValidationIssue } from "@/services/http";

// The API validates in English; the admin reads French.
const messages: Record<string, string> = {
  missing: "Champ obligatoire.",
  string_too_short: "Champ obligatoire.",
  string_too_long: "Texte trop long.",
  string_pattern_mismatch: "Format invalide : lettres minuscules, chiffres et tirets.",
  url_parsing: "Adresse web invalide (https://…).",
  url_scheme: "Adresse web invalide (https://…).",
  value_error: "Valeur invalide.",
  date_from_datetime_parsing: "Date invalide.",
  date_parsing: "Date invalide.",
  int_parsing: "Nombre entier attendu.",
  enum: "Choix invalide.",
  too_long: "Trop d'éléments.",
};

function describe(issue: ValidationIssue): string {
  if (issue.type === "value_error" && issue.loc.includes("email")) return "Adresse e-mail invalide.";
  return messages[issue.type] ?? issue.msg;
}

/** Turns an API refusal into what the form shows; anything else (a redirect, a crash) propagates. */
export function formError(error: unknown): FormState {
  if (!(error instanceof ApiError)) throw error;
  if (error.status === 422) {
    return { message: "Certains champs sont invalides.", errors: error.fieldErrors(describe) };
  }
  return { message: error.detail ?? "L'enregistrement a échoué, réessaie.", errors: {} };
}
