"use client";

import { useActionState } from "react";
import { type ContactState, sendMessage } from "@/app/(site)/[lang]/actions";
import { submitKeepingValues } from "@/lib/submit";

interface ContactFormProps {
  locale: string;
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
  };
}

const initialState: ContactState = { status: "idle", errors: {} };
const inputClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-3 outline-none transition-colors focus:border-fg aria-invalid:border-danger";

export function ContactForm({ locale, labels }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendMessage.bind(null, locale), initialState);

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-2xl border border-border bg-panel p-6 text-lg">
        {labels.success}
      </p>
    );
  }

  return (
    <form onSubmit={(event) => submitKeepingValues(event, formAction)} className="grid max-w-2xl gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={labels.name} error={state.errors.name}>
          <input id="name" name="name" autoComplete="name" required className={inputClass} aria-invalid={!!state.errors.name} aria-describedby="name-error" />
        </Field>
        <Field id="email" label={labels.email} error={state.errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} aria-invalid={!!state.errors.email} aria-describedby="email-error" />
        </Field>
      </div>
      <Field id="message" label={labels.message} error={state.errors.message}>
        <textarea id="message" name="message" rows={6} required className={inputClass} aria-invalid={!!state.errors.message} aria-describedby="message-error" />
      </Field>
      {/* Hidden from people and assistive technology: only bots fill it in. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.errors.form && (
        <p role="alert" className="text-sm text-danger">
          {state.errors.form}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="min-h-5 text-sm text-danger">
        {error}
      </p>
    </div>
  );
}
