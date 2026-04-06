/**
 * Locale configuration (non-enumerable)
 * List of locales comes from API GET /api/locales
 */

/** Fallback when API is unavailable or locale unknown */
export const DEFAULT_LOCALE = "en";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const LOCALE_SELECTED_COOKIE_NAME = "locale_selected";
export const LOCALE_SUGGESTED_COOKIE_NAME = "locale_suggested";

export const LOCALE_HEADER_NAME = "x-locale";

/** Code of locale (from API) */
export type TLocaleCode = string;

/**
 * Check if locale is in the list of supported codes (from API)
 */
export function isLocaleSupported(
  locale: string,
  supportedCodes: string[]
): locale is TLocaleCode {
  return supportedCodes.includes(locale);
}

export function normalizeLocaleCandidate(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.toLowerCase().trim();
}

/**
 * Первый язык из Accept-Language, который есть в списке активных локалей API; иначе null.
 */
export function parseFirstSupportedAcceptLanguage(
  acceptLanguage: string | null,
  supportedCodes: string[]
): string | null {
  if (!acceptLanguage || supportedCodes.length === 0) {
    return null;
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(),
        quality: qValue ? parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    if (supportedCodes.includes(lang.code)) {
      return lang.code;
    }
  }

  return null;
}

/**
 * Get preferred locale from Accept-Language header
 * Uses supported codes from API
 */
export function parseAcceptLanguage(
  acceptLanguage: string | null,
  supportedCodes: string[]
): TLocaleCode {
  return parseFirstSupportedAcceptLanguage(acceptLanguage, supportedCodes) ?? DEFAULT_LOCALE;
}
