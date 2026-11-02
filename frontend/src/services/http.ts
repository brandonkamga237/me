import "server-only";
import { env } from "@/lib/env";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  forwardedFor?: string | null;
}

export interface ValidationIssue {
  loc: (string | number)[];
  type: string;
  msg: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly payload: unknown,
  ) {
    super(`API responded with ${status}`);
  }

  /** The API's own message for domain errors (404, 409, 429…). */
  get detail(): string | null {
    const detail = (this.payload as { detail?: unknown } | null)?.detail;
    return typeof detail === "string" ? detail : null;
  }

  /** Validation errors (422) keyed by field path, such as `summary.fr`, worded by `describe`. */
  fieldErrors(describe: (issue: ValidationIssue) => string = (issue) => issue.msg): Record<string, string> {
    const detail = (this.payload as { detail?: unknown } | null)?.detail;
    if (!Array.isArray(detail)) return {};
    return Object.fromEntries(
      (detail as ValidationIssue[]).map((issue) => [issue.loc.slice(1).join("."), describe(issue)]),
    );
  }
}

/** The only way the web app talks to the API, and only from the server. */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.forwardedFor) headers["X-Forwarded-For"] = options.forwardedFor;

  const response = await fetch(`${env.apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new ApiError(response.status, await response.json().catch(() => null));
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
