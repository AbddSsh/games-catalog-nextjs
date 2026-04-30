import type { IPaginatedResponse } from "@/shared/types";
import type {
  IGameBase,
  IGameDetail,
  IGamesSearchResponse,
  IGamesByFilterResponse,
} from "../model/game.types";
import { apiGet } from "@/shared/api";
import { CACHE_REVALIDATE } from "@/shared/config";

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
  const { locale, q, page, elements, ...otherParams } = params;
  
  // If search query exists, use search endpoint with only locale, q, page, elements
  const nextCache = { revalidate: CACHE_REVALIDATE };
  if (q && q.trim().length > 0) {
    return apiGet<IPaginatedResponse<IGameBase>>("/games/search", {
      locale,
      params: {
        q: q.trim(),
        ...(page && { page }),
        ...(elements && { elements }),
      },
      next: nextCache,
    });
  }
  return apiGet<IPaginatedResponse<IGameBase>>("/games", {
    locale,
    params: {
      ...otherParams,
      ...(page && { page }),
      ...(elements && { elements }),
      ...(params.sort && { sort: params.sort }),
    } as Record<string, string | number | undefined>,
    next: nextCache,
  });
}

export async function getGameBySlug(
  slug: string,
  locale: string
): Promise<IGameDetail | null> {
  try {
    const game = await apiGet<IGameDetail>(`/games/${slug}`, {
      locale,
      next: { revalidate: CACHE_REVALIDATE },
    });

    return {
      ...game,
      facts: game.facts.map((fact) => ({
        ...fact,
        text: fact.text.trimStart(),
      })),
    };
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
  return apiGet<IGamesByFilterResponse>("/games/by-filter", {
    locale,
    params: { filter, page, elements },
  });
}

export async function getAllGameSlugs(): Promise<string[]> {
  try {
    const response = await apiGet<IPaginatedResponse<IGameBase>>("/games", {
      locale: "en",
      params: { elements: 1000 },
      next: { revalidate: CACHE_REVALIDATE },
    });
    return response.items.map((game) => game.slug);
  } catch {
    return [];
  }
}

export async function getTryThisWeekGames(
  locale: string
): Promise<IGameBase[]> {
  try {
    const response = await apiGet<IPaginatedResponse<IGameBase>>("/games", {
      locale,
      params: {
        page: 1,
        elements: 3,
        sort: "priority",
      },
      next: { revalidate: CACHE_REVALIDATE },
    });

    return response.items;
  } catch {
    return [];
  }
}
