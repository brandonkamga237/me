import { type FormEvent, startTransition } from "react";

/**
 * Submits without React's automatic form reset, so a refused submission keeps what was typed.
 */
export function submitKeepingValues(event: FormEvent<HTMLFormElement>, action: (form: FormData) => void) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  startTransition(() => action(form));
}
