import type { ITranslations } from "../model/translations.types";
import { getLocales } from "@/entities/locale";

export async function getTranslations(
  locale: string
): Promise<ITranslations | null> {
  const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<ITranslations>(`/translations/${locale}`, {
      next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.TRANSLATIONS, CACHE_TAGS.TRANSLATION(locale)] },
    });
  } catch {
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<ITranslations>(`/translations/${currentLocale.fallback}`, {
          next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.TRANSLATIONS, CACHE_TAGS.TRANSLATION(currentLocale.fallback)] },
        });
      }
    } catch {
      // Игнорируем ошибки fallback
    }
    return null;
  }
}
