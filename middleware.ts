import { NextRequest, NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  LOCALE_SELECTED_COOKIE_NAME,
  LOCALE_SUGGESTED_COOKIE_NAME,
  DEFAULT_LOCALE,
  parseFirstSupportedAcceptLanguage,
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
const MIDDLEWARE_FETCH_TIMEOUT_MS = 2500;
const MIDDLEWARE_DEBUG_LOCALE =
  process.env.NEXT_PUBLIC_MIDDLEWARE_DEBUG_LOCALE === "1";

type TLocaleConfig = {
  code: string;
  status?: string;
  isDefault?: boolean;
  language?: string;
};

type LocaleCache = { codes: string[]; defaultLocale: string; at: number };

function getCachedLocaleConfig(
  options: { allowStale?: boolean } = {}
): LocaleCache | null {
  const key = "__locale_codes";
  const g = globalThis as unknown as { [key: string]: LocaleCache };
  const cached = g[key];
  if (!cached) {
    return null;
  }

  if (options.allowStale) {
    return cached;
  }

  if (Date.now() - cached.at < CACHE_TTL_MS) {
    return cached;
  }

  return null;
}

function resolveDefaultLocale(locales: TLocaleConfig[], codes: string[]): string {
  const englishLocale = locales.find((locale) => locale.language?.toLowerCase() === "en");
  if (englishLocale && codes.includes(englishLocale.code)) return englishLocale.code;

  const explicitDefault = locales.find((locale) => locale.isDefault);
  if (explicitDefault && codes.includes(explicitDefault.code)) return explicitDefault.code;

  if (codes.includes(DEFAULT_LOCALE)) return DEFAULT_LOCALE;
  return codes[0] ?? DEFAULT_LOCALE;
}

function setCachedLocaleConfig(codes: string[], defaultLocale: string): void {
  const key = "__locale_codes";
  (globalThis as unknown as { [key: string]: LocaleCache })[key] = {
    codes,
    defaultLocale,
    at: Date.now(),
  };
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

// МОК (раскомментировать если бэк не отдаёт локали):
// const MOCK_LOCALE_CODES = ["en", "sk", "pt"];

async function fetchLocaleConfig(origin: string): Promise<{ codes: string[]; defaultLocale: string }> {
  // МОК: return MOCK_LOCALE_CODES;

  const cached = getCachedLocaleConfig();
  if (cached) return cached;
  const staleCached = getCachedLocaleConfig({ allowStale: true });

  if (!API_BASE) {
    try {
      const base = origin.replace(/\/$/, "");
      const data = await fetchJsonWithTimeout<TLocaleConfig[]>(
        `${base}/api/locales`,
        MIDDLEWARE_FETCH_TIMEOUT_MS
      );
      const activeLocales = data.filter((l) => l.status === undefined || l.status === "active");
      const codes = activeLocales.map((l) => l.code);
      if (codes.length > 0) {
        const defaultLocale = resolveDefaultLocale(activeLocales, codes);
        setCachedLocaleConfig(codes, defaultLocale);
        return { codes, defaultLocale };
      }
    } catch {
      // ignore
    }

    if (staleCached) {
      return {
        codes: staleCached.codes,
        defaultLocale: staleCached.defaultLocale,
      };
    }

    setCachedLocaleConfig([DEFAULT_LOCALE], DEFAULT_LOCALE);
    return { codes: [DEFAULT_LOCALE], defaultLocale: DEFAULT_LOCALE };
  }

  try {
    const url = `${API_BASE.replace(/\/$/, "")}/locales`;
    const data = await fetchJsonWithTimeout<TLocaleConfig[]>(
      url,
      MIDDLEWARE_FETCH_TIMEOUT_MS
    );
    const activeLocales = data.filter((l) => l.status === undefined || l.status === "active");
    const codes = activeLocales.map((l) => l.code);
    if (codes.length === 0) {
      setCachedLocaleConfig([DEFAULT_LOCALE], DEFAULT_LOCALE);
      return { codes: [DEFAULT_LOCALE], defaultLocale: DEFAULT_LOCALE };
    }
    const defaultLocale = resolveDefaultLocale(activeLocales, codes);
    setCachedLocaleConfig(codes, defaultLocale);
    return { codes, defaultLocale };
  } catch {
    if (staleCached) {
      return {
        codes: staleCached.codes,
        defaultLocale: staleCached.defaultLocale,
      };
    }

    setCachedLocaleConfig([DEFAULT_LOCALE], DEFAULT_LOCALE);
    return { codes: [DEFAULT_LOCALE], defaultLocale: DEFAULT_LOCALE };
  }
}

/**
 * Подсказка локали без жёсткого редиректа: IP-страна (если код совпадает с активной локалью API)
 * → Accept-Language → дефолт из API.
 * Заголовки: Cloudflare `cf-ipcountry`, Vercel `x-vercel-ip-country` (ISO alpha-2).
 */
type TLocaleDetection = {
  result: string;
  ipRaw: string;
  ipLocale: string;
  browserLocale: string;
  source: "ip" | "browser" | "default";
};

function detectSuggestedLocale(
  request: NextRequest,
  localeCodes: string[],
  defaultLocale: string
): TLocaleDetection {
  const cfIp = request.headers.get("cf-ipcountry");
  const vercelIp = request.headers.get("x-vercel-ip-country");
  const ipCountryRaw = cfIp || vercelIp || "";
  const ipLocaleCandidate = ipCountryRaw.toLowerCase().trim();

  const browserLocale = parseFirstSupportedAcceptLanguage(
    request.headers.get("accept-language"),
    localeCodes
  ) ?? "";

  if (ipLocaleCandidate && localeCodes.includes(ipLocaleCandidate)) {
    return { result: ipLocaleCandidate, ipRaw: ipCountryRaw, ipLocale: ipLocaleCandidate, browserLocale, source: "ip" };
  }

  if (browserLocale) {
    return { result: browserLocale, ipRaw: ipCountryRaw, ipLocale: "", browserLocale, source: "browser" };
  }

  return { result: defaultLocale, ipRaw: ipCountryRaw, ipLocale: "", browserLocale: "", source: "default" };
}

// DEBUG: пробрасываем детали детекции локали на клиент через куки
function setLocaleDebugCookies(response: NextResponse, detection: TLocaleDetection): void {
  if (!MIDDLEWARE_DEBUG_LOCALE) {
    return;
  }

  const debugValue = JSON.stringify({
    ipRaw: detection.ipRaw,
    ipLocale: detection.ipLocale,
    browserLocale: detection.browserLocale,
    source: detection.source,
    result: detection.result,
  });
  response.cookies.set("__debug_locale_detection", debugValue, {
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
    httpOnly: false,
  });
}

/** Пути, которые Next.js отдаёт сам (sitemap, robots) — не переписывать под [lang]. */
const SKIP_REWRITE_PATHS = ["/sitemap.xml", "/sitemap-index.xml", "/robots.txt", "/llms.txt"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const hasGclid = request.nextUrl.searchParams.has("gclid");
  const trackingCookieValue = getTrackingParamsCookieValue(request.nextUrl.searchParams);

  if (SKIP_REWRITE_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const localeConfig = await fetchLocaleConfig(origin);
  const localeCodes = localeConfig.codes;
  const defaultLocaleCode = localeConfig.defaultLocale;
  const nonDefaultLocales = localeCodes.filter((c) => c !== defaultLocaleCode);
  const selectedLocaleCookie = request.cookies.get(LOCALE_SELECTED_COOKIE_NAME)?.value;
  const detection = detectSuggestedLocale(request, localeCodes, defaultLocaleCode);
  const suggestedLocaleFromDetection = detection.result;

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
    if (hasGclid) {
      response.cookies.set(LOCALE_SELECTED_COOKIE_NAME, pathnameLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    } else if (!selectedLocaleCookie) {
      response.cookies.set(LOCALE_SUGGESTED_COOKIE_NAME, suggestedLocaleFromDetection, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }
    if (trackingCookieValue) setTrackingParamsCookie(response, trackingCookieValue);
    setLocaleDebugCookies(response, detection);
    return response;
  }

  // 2) Path starts with default locale — redirect to the same path without it (canonical)
  if (pathname.startsWith(`/${defaultLocaleCode}/`) || pathname === `/${defaultLocaleCode}`) {
    const stripped = pathname.replace(new RegExp(`^/${defaultLocaleCode}`), "") || "/";
    const newUrl = new URL(stripped, request.url);
    newUrl.search = request.nextUrl.search;
    const response = NextResponse.redirect(newUrl, 301);
    if (hasGclid) {
      response.cookies.set(LOCALE_SELECTED_COOKIE_NAME, defaultLocaleCode, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    } else if (!selectedLocaleCookie) {
      response.cookies.set(LOCALE_SUGGESTED_COOKIE_NAME, suggestedLocaleFromDetection, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }
    if (trackingCookieValue) setTrackingParamsCookie(response, trackingCookieValue);
    setLocaleDebugCookies(response, detection);
    return response;
  }

  // 3) No locale prefix — this is default locale. Rewrite internally to /<default-locale>/...
  const rewritePath = `/${defaultLocaleCode}${pathname === "/" ? "" : pathname}`;
  const rewriteUrl = new URL(rewritePath, request.url);
  rewriteUrl.search = request.nextUrl.search;

  const response = NextResponse.rewrite(rewriteUrl);
  response.cookies.set(LOCALE_COOKIE_NAME, defaultLocaleCode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  if (hasGclid) {
    response.cookies.set(LOCALE_SELECTED_COOKIE_NAME, defaultLocaleCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else if (!selectedLocaleCookie) {
    response.cookies.set(LOCALE_SUGGESTED_COOKIE_NAME, suggestedLocaleFromDetection, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }
  if (trackingCookieValue) setTrackingParamsCookie(response, trackingCookieValue);
  setLocaleDebugCookies(response, detection);

  return response;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
