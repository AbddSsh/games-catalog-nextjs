import type { ICategoryCard, ICategoryWithGames } from "../model/category.types";
import { getLocales } from "@/entities/locale";

export async function getCategories(
  locale: string
): Promise<ICategoryCard[]> {
  const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<ICategoryCard[]>("/categories", {
      locale,
      next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.CATEGORIES] },
    });
  } catch {
    try {
      const locales = await getLocales();
      const currentLocale = locales.find((l) => l.code === locale);
      if (currentLocale?.fallback) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<ICategoryCard[]>("/categories", {
          locale: currentLocale.fallback,
          next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.CATEGORIES] },
        });
      }
      const defaultLocale = locales.find((l) => l.isDefault);
      if (defaultLocale) {
        const { apiGet } = await import("@/shared/api");
        return await apiGet<ICategoryCard[]>("/categories", {
          locale: defaultLocale.code,
          next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.CATEGORIES] },
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
    const { apiGet } = await import("@/shared/api");
    const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
    return await apiGet<ICategoryWithGames>(`/categories/${slug}`, {
      locale,
      params: { page, elements },
      next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.CATEGORIES, CACHE_TAGS.CATEGORY(slug)] },
    });
  } catch {
    return null;
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const { apiGet } = await import("@/shared/api");
    const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
    const categories = await apiGet<ICategoryCard[]>("/categories", {
      locale: "en",
      next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.CATEGORIES] },
    });
    return categories.map((category) => category.slug);
  } catch {
    return [];
  }
}
