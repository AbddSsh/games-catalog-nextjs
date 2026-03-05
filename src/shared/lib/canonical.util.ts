import { ENV, DEFAULT_LOCALE } from "@/shared/config";

/**
 * Собирает canonical URL: SITE_URL + локаль + путь страницы.
 * Для дефолтной локали (en) префикс /en не добавляется — корень сайта отдаётся без редиректа (SEO/Google Ads).
 * @param lang — код локали (например "en", "ru")
 * @param pathSegments — сегменты пути без ведущего слэша (например "catalog", "game/slug")
 */
export function getCanonicalUrl(
  lang: string,
  pathSegments?: string
): string {
  const base = ENV.SITE_URL.replace(/\/$/, "");
  const path = pathSegments?.replace(/^\//, "") ?? "";
  const pathPart = path ? `/${path}` : "";
  const langPart = lang && lang !== DEFAULT_LOCALE ? `/${lang}` : "";
  return `${base}${langPart}${pathPart}`;
}

/**
 * Для metadata.alternates.languages (hreflang): URL для каждой активной локали и x-default.
 * Google использует это для связи версий страницы на разных языках.
 */
export async function getAlternatesLanguages(
  pathSegments?: string
): Promise<Record<string, string>> {
  const { getLocales } = await import("@/entities/locale");
  const locales = await getLocales();
  const active = locales.filter((l) => l.status === "active");
  const languages: Record<string, string> = {};
  let xDefaultUrl = "";
  for (const loc of active) {
    const url = getCanonicalUrl(loc.code, pathSegments);
    languages[loc.code] = url;
    if (loc.isDefault) xDefaultUrl = url;
  }
  if (!xDefaultUrl && active.length > 0) {
    const defaultLoc = active.find((l) => l.code === DEFAULT_LOCALE) || active[0];
    xDefaultUrl = getCanonicalUrl(defaultLoc.code, pathSegments);
  }
  if (xDefaultUrl) languages["x-default"] = xDefaultUrl;
  return languages;
}
