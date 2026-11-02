import type { Localized } from "@/services/types";

export function text(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

export function optional(form: FormData, name: string): string | null {
  return text(form, name) || null;
}

export function checked(form: FormData, name: string): boolean {
  return form.get(name) === "on";
}

export function integer(form: FormData, name: string): number {
  const value = Number.parseInt(text(form, name), 10);
  return Number.isNaN(value) ? 0 : value;
}

export function localized(form: FormData, name: string): Localized {
  return { en: text(form, `${name}.en`), fr: text(form, `${name}.fr`) };
}

export function list(form: FormData, name: string): string[] {
  return text(form, name)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
