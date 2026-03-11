import { TRACKING_PARAMS_COOKIE_NAME } from "@/shared/config";

/**
 * Читает из document.cookie параметры, сохранённые middleware с рекламного захода (UTM, gclid и т.д.).
 * Вызывать только на клиенте. При SSR возвращает пустой URLSearchParams.
 */
export function getTrackingParamsFromCookie(): URLSearchParams {
  if (typeof document === "undefined") return new URLSearchParams();
  const cookies = document.cookie.split(";");
  for (const line of cookies) {
    const [name, ...rest] = line.trim().split("=");
    if (name === TRACKING_PARAMS_COOKIE_NAME && rest.length > 0) {
      const value = decodeURIComponent(rest.join("=").trim());
      return new URLSearchParams(value);
    }
  }
  return new URLSearchParams();
}
