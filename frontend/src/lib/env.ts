import "server-only";

export const env = {
  apiUrl: process.env.API_URL ?? "http://localhost:8000",
  siteUrl: process.env.SITE_URL ?? "http://localhost:3000",
  // Off only to try the production build over plain http on a local machine.
  secureCookies: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false",
};
