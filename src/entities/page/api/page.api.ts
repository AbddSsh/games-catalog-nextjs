import type { IHomePage, ISeoLandingPage } from "../model/page.types";
import { getLocales } from "@/entities/locale";
import { CACHE_REVALIDATE } from "@/shared/config";
import { apiGet } from "@/shared/api";

export async function getHomePage(locale: string): Promise<IHomePage> {
  try {
    return await apiGet<IHomePage>("/pages/home", {
      locale,
      next: { revalidate: CACHE_REVALIDATE },
    });
  } catch {
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        return await apiGet<IHomePage>("/pages/home", {
          locale: currentLocale.fallback,
          next: { revalidate: CACHE_REVALIDATE },
        });
      }
      const defaultLocale = locales.find((l) => l.isDefault);
      if (defaultLocale) {
        return await apiGet<IHomePage>("/pages/home", {
          locale: defaultLocale.code,
          next: { revalidate: CACHE_REVALIDATE },
        });
      }
    } catch {
      // Игнорируем ошибки fallback
    }
    throw new Error(`Home page not available for locale: ${locale}`);
  }
}

export async function getSeoLandingPage(
  type: string,
  locale: string,
  country?: string
): Promise<ISeoLandingPage | null> {
  try {
    return await apiGet<ISeoLandingPage>(`/pages/seo-landing/${type}`, {
      locale,
      params: country ? { country } : undefined,
    });
  } catch {
    return null;
  }
}
