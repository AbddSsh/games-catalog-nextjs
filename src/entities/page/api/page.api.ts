import type { IHomePage, ISeoLandingPage } from "../model/page.types";
import { getLocales } from "@/entities/locale";

export async function getHomePage(locale: string): Promise<IHomePage> {
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<IHomePage>("/pages/home", { locale });
  } catch {
    // Если страница недоступна для этой локали, пробуем fallback
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<IHomePage>("/pages/home", { locale: currentLocale.fallback });
      }
      // Если нет fallback, пробуем локаль по умолчанию
      const defaultLocale = locales.find((l) => l.isDefault);
      if (defaultLocale) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<IHomePage>("/pages/home", { locale: defaultLocale.code });
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
