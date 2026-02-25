import { ENV } from "@/shared/config";

/**
 * Собирает canonical URL: SITE_URL + локаль + путь страницы.
 * Каждая локаль имеет свою каноничную ссылку.
 * @param lang — код локали (например "en", "ru")
 * @param pathSegments — сегменты пути без ведущего слэша (например "catalog", "game/slug")
 */
export function getCanonicalUrl(
  lang: string,
  pathSegments?: string
): string {
  const base = ENV.SITE_URL.replace(/\/$/, "");
  const langPart = lang ? `/${lang}` : "";
  const path = pathSegments?.replace(/^\//, "") ?? "";
  const pathPart = path ? `/${path}` : "";
  return `${base}${langPart}${pathPart}`;
}
