import type { ICategoryCard, ICategoryWithGames } from "../model/category.types";
import { getLocales } from "@/entities/locale";

export async function getCategories(
  locale: string
): Promise<ICategoryCard[]> {
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<ICategoryCard[]>("/categories", { locale });
  } catch {
    // Если категории недоступны для этой локали, пробуем fallback
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<ICategoryCard[]>("/categories", { locale: currentLocale.fallback });
      }
      // Если нет fallback, пробуем локаль по умолчанию
      const defaultLocale = locales.find((l) => l.isDefault);
      if (defaultLocale) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<ICategoryCard[]>("/categories", { locale: defaultLocale.code });
      }
    } catch {
      // Игнорируем ошибки fallback
    }
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
  locale: string,
  page: number = 1,
  elements: number = 12
): Promise<ICategoryWithGames | null> {
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<ICategoryWithGames>(`/categories/${slug}`, {
      locale,
      params: { page, elements },
    });
  } catch {
    return null;
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const { apiGet } = await import("@/shared/api");
    const categories = await apiGet<ICategoryCard[]>("/categories", {
      locale: "en",
    });
    return categories.map((category) => category.slug);
  } catch {
    return [];
  }
}
