import { DEFAULT_LOCALE } from "@/shared/config";

/**
 * Builds a client-side path with locale prefix.
 * Default locale (en) gets no prefix: "/" instead of "/en", "/catalog" instead of "/en/catalog".
 * Other locales get prefixed: "/sk/catalog", "/pt/game/slug".
 */
export function localePath(locale: string, path: string = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) {
    return normalized;
  }
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
