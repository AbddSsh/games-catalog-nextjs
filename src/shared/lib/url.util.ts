/**
 * Добавляет query-параметры из текущей страницы (например, UTM с рекламы) в целевую ссылку.
 * Существующие параметры в targetUrl не перезаписываются (приоритет у переданных searchParams).
 */
export function appendSearchParamsToUrl(
  targetUrl: string,
  searchParams: URLSearchParams
): string {
  const paramString = Array.from(searchParams.entries())
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  if (!paramString) return targetUrl;
  try {
    const url = new URL(targetUrl);
    for (const [key, value] of searchParams) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    const separator = targetUrl.includes("?") ? "&" : "?";
    return `${targetUrl}${separator}${paramString}`;
  }
}
