"use client";

import type { ReactNode } from "react";
import { useFieldError } from "@/components/admin/AdminForm";
import type { Localized } from "@/services/types";

const control =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-fg aria-invalid:border-danger";

interface FieldShellProps {
  name: string;
  label: string;
  hint?: string;
  children: ReactNode;
}

function FieldShell({ name, label, hint, children }: FieldShellProps) {
  const error = useFieldError(name);
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

interface TextFieldProps {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  type?: "text" | "email" | "url" | "number" | "date" | "password";
  hint?: string;
  required?: boolean;
  autoComplete?: string;
}

export function TextField({ name, label, defaultValue, type = "text", hint, required, autoComplete }: TextFieldProps) {
  const error = useFieldError(name);
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={control}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}

export function TextAreaField({ name, label, defaultValue, rows = 4, hint }: TextAreaFieldProps) {
  const error = useFieldError(name);
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <textarea id={name} name={name} rows={rows} defaultValue={defaultValue} aria-invalid={!!error} className={control} />
    </FieldShell>
  );
}

interface LocalizedFieldProps {
  name: string;
  label: string;
  defaultValue?: Localized;
  multiline?: boolean;
}

export function LocalizedField({ name, label, defaultValue, multiline }: LocalizedFieldProps) {
  return (
    <fieldset className="grid gap-3 rounded-lg border border-border p-4">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      {(["en", "fr"] as const).map((lang) =>
        multiline ? (
          <TextAreaField key={lang} name={`${name}.${lang}`} label={lang.toUpperCase()} defaultValue={defaultValue?.[lang]} rows={5} />
        ) : (
          <TextField key={lang} name={`${name}.${lang}`} label={lang.toUpperCase()} defaultValue={defaultValue?.[lang]} />
        ),
      )}
    </fieldset>
  );
}

interface CheckboxFieldProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
}

export function CheckboxField({ name, label, defaultChecked }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-current" />
      {label}
    </label>
  );
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: readonly (readonly [string, string])[];
  defaultValue?: string;
}

export function SelectField({ name, label, options, defaultValue }: SelectFieldProps) {
  return (
    <FieldShell name={name} label={label}>
      <select id={name} name={name} defaultValue={defaultValue} className={control}>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
