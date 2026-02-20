import type { IPaginatedResponse } from "@/shared/types";
import type {
  IGameBase,
  IGameDetail,
  IGamesSearchResponse,
  IGamesByFilterResponse,
} from "../model/game.types";

export async function getGames(params: {
  locale: string;
  category?: string;
  genres?: string;
  settings?: string;
  platforms?: string;
  features?: string;
  q?: string;
  sort?: string;
  page?: number;
  elements?: number;
}): Promise<IPaginatedResponse<IGameBase>> {
  const { apiGet } = await import("@/shared/api");
  const { locale, q, page, elements, ...otherParams } = params;
  
  // If search query exists, use search endpoint with only locale, q, page, elements
  if (q && q.trim().length > 0) {
    return apiGet<IPaginatedResponse<IGameBase>>("/games/search", {
      locale,
      params: {
        q: q.trim(),
        ...(page && { page }),
        ...(elements && { elements }),
      },
    });
  }
  
  // Otherwise use regular games endpoint with all filters
  return apiGet<IPaginatedResponse<IGameBase>>("/games", {
    locale,
    params: {
      ...otherParams,
      ...(page && { page }),
      ...(elements && { elements }),
      ...(params.sort && { sort: params.sort }),
    } as Record<string, string | number | undefined>,
  });
}

export async function getGameBySlug(
  slug: string,
  locale: string
): Promise<IGameDetail | null> {
  try {
    const { apiGet } = await import("@/shared/api");
    return await apiGet<IGameDetail>(`/games/${slug}`, { locale });
  } catch {
    return null;
  }
}

export async function searchGames(
  query: string,
  locale: string,
  page: number = 1,
  elements: number = 20
): Promise<IGamesSearchResponse> {
  const { apiGet } = await import("@/shared/api");
  return apiGet<IGamesSearchResponse>("/games/search", {
    locale,
    params: { q: query, page, elements },
  });
}

export async function getGamesByFilter(
  filter: string,
  locale: string,
  page: number = 1,
  elements: number = 20
): Promise<IGamesByFilterResponse> {
  const { apiGet } = await import("@/shared/api");
  return apiGet<IGamesByFilterResponse>("/games/by-filter", {
    locale,
    params: { filter, page, elements },
  });
}

export async function getAllGameSlugs(): Promise<string[]> {
  try {
    const { apiGet } = await import("@/shared/api");
    const response = await apiGet<IPaginatedResponse<IGameBase>>("/games", {
      locale: "en",
      params: { elements: 1000 },
    });
    return response.items.map((game) => game.slug);
  } catch {
    return [];
  }
}
