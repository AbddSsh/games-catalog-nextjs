import type { ITranslations } from "../model/translations.types";
import { getLocales } from "@/entities/locale";
import { CACHE_REVALIDATE } from "@/shared/config";
import { apiGet } from "@/shared/api";

export async function getTranslations(
  locale: string
): Promise<ITranslations | null> {
  try {
    return await apiGet<ITranslations>(`/translations/${locale}`, {
      next: { revalidate: CACHE_REVALIDATE },
    });
  } catch {
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        return await apiGet<ITranslations>(`/translations/${currentLocale.fallback}`, {
          next: { revalidate: CACHE_REVALIDATE },
        });
      }
    } catch {
      // Игнорируем ошибки fallback
    }
    return null;
  }
}
