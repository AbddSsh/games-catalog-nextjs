import { apiGet } from "@/shared/api";
import { CACHE_REVALIDATE } from "@/shared/config";
import type {
  IBlogArticleDetail,
  IBlogListResponse,
  IGetBlogArticlesListParams,
} from "../model/blog.types";

export async function getBlogArticlesList(
  params: IGetBlogArticlesListParams
): Promise<IBlogListResponse> {
  const { locale, category, q, page, elements, sort } = params;

  return apiGet<IBlogListResponse>("/blog", {
    locale,
    params: {
      chip: category,
      q,
      page,
      elements,
      sort,
    },
    next: { revalidate: CACHE_REVALIDATE },
  });
}

export async function getBlogArticleBySlug(
  slug: string,
  locale: string
): Promise<IBlogArticleDetail | null> {
  try {
    return await apiGet<IBlogArticleDetail>(`/blog/${slug}`, {
      locale,
      next: { revalidate: CACHE_REVALIDATE },
    });
  } catch {
    return null;
  }
}

export async function getBlogReadersChoice(
  locale: string,
  elements: number,
): Promise<IBlogListResponse> {
  return apiGet<IBlogListResponse>("/blog/readers-choice", {
    locale,
    params: {
      page: 1,
      elements,
    },
    next: { revalidate: CACHE_REVALIDATE },
  });
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await apiGet<IBlogListResponse>("/blog", {
      locale: "en",
      params: {
        page: 1,
      },
      next: { revalidate: CACHE_REVALIDATE },
    });
    return response.items.map((item) => item.slug);
  } catch {
    return [];
  }
}
