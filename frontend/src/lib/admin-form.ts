export interface FormState {
  message?: string;
  notice?: string;
  errors: Record<string, string>;
}

export const emptyForm: FormState = { errors: {} };
