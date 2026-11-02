"use client";

import { useActionState } from "react";
import { type ContactState, sendMessage } from "@/app/(site)/[lang]/actions";
import { Magnetic } from "@/components/motion/Magnetic";
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
  "peer w-full border-b border-border-strong bg-transparent pb-3 pt-1 text-xl outline-none transition-colors placeholder:text-transparent focus:border-accent aria-invalid:border-danger md:text-2xl";

export function ContactForm({ locale, labels }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendMessage.bind(null, locale), initialState);

  if (state.status === "success") {
    return (
      <p role="status" className="corners p-8 text-2xl font-medium leading-snug tracking-[-0.02em]">
        <span className="mb-4 block text-4xl text-accent">✦</span>
        {labels.success}
      </p>
    );
  }

  return (
    <form onSubmit={(event) => submitKeepingValues(event, formAction)} className="grid gap-8" noValidate>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" index="01" label={labels.name} error={state.errors.name}>
          <input id="name" name="name" autoComplete="name" required className={inputClass} aria-invalid={!!state.errors.name} aria-describedby="name-error" />
        </Field>
        <Field id="email" index="02" label={labels.email} error={state.errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} aria-invalid={!!state.errors.email} aria-describedby="email-error" />
        </Field>
      </div>
      <Field id="message" index="03" label={labels.message} error={state.errors.message}>
        <textarea id="message" name="message" rows={4} required className={`${inputClass} resize-none`} aria-invalid={!!state.errors.message} aria-describedby="message-error" />
      </Field>
      {/* Hidden from people and assistive technology: only bots fill it in. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.errors.form && (
        <p role="alert" className="text-sm text-danger">
          {state.errors.form}
        </p>
      )}
      <Magnetic className="justify-self-start">
        <button
          type="submit"
          disabled={pending}
          className="eyebrow group grid size-36 place-items-center rounded-full bg-accent p-4 text-center text-black transition-[background-color,scale] duration-500 hover:scale-105 hover:bg-white disabled:opacity-60 md:size-40"
        >
          <span>
            {pending ? labels.sending : labels.send}
            <span aria-hidden className="mt-2 block text-lg transition-transform duration-500 group-hover:-rotate-45">
              →
            </span>
          </span>
        </button>
      </Magnetic>
    </form>
  );
}

interface FieldProps {
  id: string;
  index: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, index, label, error, children }: FieldProps) {
  return (
    <div className="grid gap-3">
      <label htmlFor={id} className="eyebrow text-muted">
        <span className="text-accent-ink">{index}</span> — {label}
      </label>
      {children}
      <p id={`${id}-error`} className="min-h-5 text-sm text-danger">
        {error}
      </p>
    </div>
  );
}
