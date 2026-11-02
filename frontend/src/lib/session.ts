import "server-only";
import { cookies, headers } from "next/headers";
import { env } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function startSession(token: string, expiresAt: Date): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.secureCookies,
    sameSite: "strict",
    path: "/admin",
    expires: expiresAt,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

/** The visitor's address as the reverse proxy saw it, passed on so the API throttles per visitor. */
export async function visitorAddress(): Promise<string | null> {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || null;
}
