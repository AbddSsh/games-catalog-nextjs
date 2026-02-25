import type { IHomePage, ISeoLandingPage } from "../model/page.types";
import { getLocales } from "@/entities/locale";

export async function getHomePage(locale: string): Promise<IHomePage> {
  const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<IHomePage>("/pages/home", {
      locale,
      next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.PAGE_HOME, CACHE_TAGS.PAGE_HOME_LOCALE(locale)] },
    });
  } catch {
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<IHomePage>("/pages/home", {
          locale: currentLocale.fallback,
          next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.PAGE_HOME, CACHE_TAGS.PAGE_HOME_LOCALE(currentLocale.fallback)] },
        });
      }
      const defaultLocale = locales.find((l) => l.isDefault);
      if (defaultLocale) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<IHomePage>("/pages/home", {
          locale: defaultLocale.code,
          next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.PAGE_HOME, CACHE_TAGS.PAGE_HOME_LOCALE(defaultLocale.code)] },
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
    const { apiGet } = await import("@/shared/api");
    return await apiGet<ISeoLandingPage>(`/pages/seo-landing/${type}`, {
      locale,
      params: country ? { country } : undefined,
    });
  } catch {
    return null;
  }
}
