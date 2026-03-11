import { NextRequest, NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  DEFAULT_LOCALE,
  TRACKING_PARAMS_COOKIE_NAME,
} from "@/shared/config";

const TRACKING_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 дней

/** Все query-параметры запроса. При каждом заходе с новой ссылкой cookie перезаписывается. */
function getTrackingParamsCookieValue(searchParams: URLSearchParams): string | null {
  const str = searchParams.toString();
  return str || null;
}

function setTrackingParamsCookie(response: NextResponse, value: string): void {
  response.cookies.set(TRACKING_PARAMS_COOKIE_NAME, value, {
    path: "/",
    maxAge: TRACKING_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false, // нужен доступ с клиента для подстановки в trackingLink
  });
}

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

// МОК (раскомментировать если бэк не отдаёт локали):
// const MOCK_LOCALE_CODES = ["en", "sk", "pt"];

async function fetchLocaleCodes(origin: string): Promise<string[]> {
  // МОК: return MOCK_LOCALE_CODES;

  const cached = getCachedLocaleCodes();
  if (cached) return cached;

  if (!API_BASE) {
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
  const trackingCookieValue = getTrackingParamsCookieValue(request.nextUrl.searchParams);

  const localeCodes = await fetchLocaleCodes(origin);
  const nonDefaultLocales = localeCodes.filter((c) => c !== DEFAULT_LOCALE);

  // 1) Path starts with a non-default locale (/sk, /pt, etc.) — pass through, set cookie
  const pathnameLocale = nonDefaultLocales.find(
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
    if (trackingCookieValue) setTrackingParamsCookie(response, trackingCookieValue);
    return response;
  }

  // 2) Path starts with /en — redirect to the same path without /en (canonical)
  if (pathname.startsWith(`/${DEFAULT_LOCALE}/`) || pathname === `/${DEFAULT_LOCALE}`) {
    const stripped = pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}`), "") || "/";
    const newUrl = new URL(stripped, request.url);
    newUrl.search = request.nextUrl.search;
    const response = NextResponse.redirect(newUrl, 301);
    if (trackingCookieValue) setTrackingParamsCookie(response, trackingCookieValue);
    return response;
  }

  // 3) No locale prefix — this is default locale (en). Rewrite internally to /en/...
  const rewritePath = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  const rewriteUrl = new URL(rewritePath, request.url);
  rewriteUrl.search = request.nextUrl.search;

  const response = NextResponse.rewrite(rewriteUrl);
  response.cookies.set(LOCALE_COOKIE_NAME, DEFAULT_LOCALE, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  if (trackingCookieValue) setTrackingParamsCookie(response, trackingCookieValue);

  return response;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
