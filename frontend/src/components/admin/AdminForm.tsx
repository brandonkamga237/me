"use client";

import { createContext, type ReactNode, use, useActionState } from "react";
import { emptyForm, type FormState } from "@/lib/admin-form";
import { submitKeepingValues } from "@/lib/submit";

const ErrorsContext = createContext<Record<string, string>>({});

interface AdminFormProps {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  submitLabel?: string;
  children: ReactNode;
}

export function AdminForm({ action, submitLabel = "Enregistrer", children }: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, emptyForm);
  return (
    <form onSubmit={(event) => submitKeepingValues(event, formAction)} className="grid max-w-3xl gap-6" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      )}
      {state.notice && (
        <p role="status" className="rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          {state.notice}
        </p>
      )}
      <ErrorsContext value={state.errors}>{children}</ErrorsContext>
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

/** The error for a field, or for any part of it (`socials` also matches `socials.1.url`). */
export function useFieldError(name: string): string | undefined {
  const errors = use(ErrorsContext);
  return errors[name] ?? Object.entries(errors).find(([key]) => key.startsWith(`${name}.`))?.[1];
}
