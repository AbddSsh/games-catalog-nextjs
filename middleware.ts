import { NextRequest, NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  DEFAULT_LOCALE,
  parseAcceptLanguage,
  isLocaleSupported,
} from "@/shared/config";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type LocaleCache = { codes: string[]; at: number };

function getCachedLocaleCodes(): string[] | null {
  const key = "__locale_codes";
  const g = globalThis as unknown as { [key: string]: LocaleCache };
  const cached = g[key];
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.codes;
  }
  return null;
}

function setCachedLocaleCodes(codes: string[]): void {
  const key = "__locale_codes";
  (globalThis as unknown as { [key: string]: LocaleCache })[key] = {
    codes,
    at: Date.now(),
  };
}

async function fetchLocaleCodes(origin: string): Promise<string[]> {
  const cached = getCachedLocaleCodes();
  if (cached) return cached;

  if (!API_BASE) {
    // Dev/mock: fetch from same-origin route (reads data/locales or mock)
    try {
      const base = origin.replace(/\/$/, "");
      const res = await fetch(`${base}/api/locales`);
      if (!res.ok) throw new Error("Locales fetch failed");
      const data = (await res.json()) as Array<{ code: string; status?: string }>;
      const codes = data
        .filter((l) => l.status === undefined || l.status === "active")
        .map((l) => l.code);
      if (codes.length > 0) {
        setCachedLocaleCodes(codes);
        return codes;
      }
    } catch {
      // ignore
    }
    setCachedLocaleCodes([DEFAULT_LOCALE]);
    return [DEFAULT_LOCALE];
  }

  try {
    const url = `${API_BASE.replace(/\/$/, "")}/locales`;
    const res = await fetch(url);
    if (!res.ok) return [DEFAULT_LOCALE];
    const data = (await res.json()) as Array<{ code: string; status?: string }>;
    const codes = data
      .filter((l) => l.status === undefined || l.status === "active")
      .map((l) => l.code);
    if (codes.length === 0) {
      setCachedLocaleCodes([DEFAULT_LOCALE]);
      return [DEFAULT_LOCALE];
    }
    setCachedLocaleCodes(codes);
    return codes;
  } catch {
    setCachedLocaleCodes([DEFAULT_LOCALE]);
    return [DEFAULT_LOCALE];
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const localeCodes = await fetchLocaleCodes(origin);

  const pathnameLocale = localeCodes.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    const response = NextResponse.next();

    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieLocale !== pathnameLocale) {
      response.cookies.set(LOCALE_COOKIE_NAME, pathnameLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }

    return response;
  }

  let locale: string;
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && isLocaleSupported(cookieLocale, localeCodes)) {
    locale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get("Accept-Language");
    locale = parseAcceptLanguage(acceptLanguage, localeCodes);
  }

  // If path starts with a locale-like segment (/xx or /xxx), replace it; otherwise prepend locale
  const pathWithoutFirstSegment =
    /^\/[a-z]{2,3}(\/|$)/i.test(pathname)
      ? (pathname.replace(/^\/[^/]+/, "") || "/")
      : pathname;
  const newUrl = new URL(`/${locale}${pathWithoutFirstSegment}`, request.url);
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
