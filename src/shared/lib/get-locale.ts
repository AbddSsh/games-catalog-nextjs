import { cookies, headers } from "next/headers";
import { getLocales } from "@/entities/locale";
import {
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  DEFAULT_LOCALE,
  isLocaleSupported,
} from "@/shared/config";

/**
 * Get current locale in Server Components
 * Reads from middleware-set header or cookie; validates against API locales
 */
export async function getLocale(): Promise<string> {
  const locales = await getLocales();
  const supportedCodes = locales.map((l) => l.code);

  const headersList = await headers();
  const headerLocale = headersList.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocaleSupported(headerLocale, supportedCodes)) {
    return headerLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && isLocaleSupported(cookieLocale, supportedCodes)) {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}
