import { getLocales } from "@/entities/locale";
import { apiGet } from "@/shared/api";
import type { ICategoryCard, ICategoryWithGames } from "../model/category.types";
import { CACHE_REVALIDATE } from "@/shared/config";

export async function getCategories(
  locale: string
): Promise<ICategoryCard[]> {
  try {
    return await apiGet<ICategoryCard[]>("/categories", {
      locale,
      next: { revalidate: CACHE_REVALIDATE },
    });
  } catch {
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        return await apiGet<ICategoryCard[]>("/categories", {
          locale: currentLocale.fallback,
          next: { revalidate: CACHE_REVALIDATE },
        });
      }
      const defaultLocale = locales.find((l) => l.isDefault);
      if (defaultLocale) {
        return await apiGet<ICategoryCard[]>("/categories", {
          locale: defaultLocale.code,
          next: { revalidate: CACHE_REVALIDATE },
        });
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
    return await apiGet<ICategoryWithGames>(`/categories/${slug}`, {
      locale,
      params: { page, elements },
      next: { revalidate: CACHE_REVALIDATE },
    });
  } catch {
    return null;
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const categories = await apiGet<ICategoryCard[]>("/categories", {
      locale: "en",
      next: { revalidate: CACHE_REVALIDATE },
    });
    return categories.map((category) => category.slug);
  } catch {
    return [];
  }
}
