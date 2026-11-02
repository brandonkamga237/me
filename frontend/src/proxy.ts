import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, preferredLocale } from "@/lib/i18n";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // An optimistic check that saves a round trip: the API still authorises every admin call.
    if (pathname !== "/admin/login" && !request.cookies.has(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (hasLocale(pathname.split("/")[1] ?? "")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything but Next internals and files with an extension (icon.svg, robots.txt, sitemap.xml).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
