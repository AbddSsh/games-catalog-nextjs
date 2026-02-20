import type { ITranslations } from "../model/translations.types";
import { getLocales } from "@/entities/locale";

export async function getTranslations(
  locale: string
): Promise<ITranslations | null> {
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<ITranslations>(`/translations/${locale}`);
  } catch {
    // Если переводы недоступны для этой локали, пробуем fallback
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<ITranslations>(`/translations/${currentLocale.fallback}`);
      }
    } catch {
      // Игнорируем ошибки fallback
    }
    return null;
  }
}
