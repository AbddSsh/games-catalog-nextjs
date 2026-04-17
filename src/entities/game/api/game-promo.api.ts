import type { IContentParagraph, IPaginatedResponse } from "@/shared/types";
import type { IGameBase } from "../model/game.types";

export interface IGamePromo extends IGameBase {
  videoUrl: string | null;
  trackingLink: string;
  promo: {
    icons: Array<{
      slug: string;
      name: string;
      url: string;
    }>;
    rating: number;
    votesAmount: number;
  };
}

export interface IGamePromoDetail extends IGameBase {
  screenshots: string[];
  videoUrl: string | null;
  gameOverview: IContentParagraph[];
  trackingLink: string;
}

export interface IGetPromoGamesParams {
  locale: string;
  page?: number;
  elements?: number;
  option?: string;
}

export async function getPromoGames(
  params: IGetPromoGamesParams
): Promise<IPaginatedResponse<IGamePromo>> {
  const { apiGet } = await import("@/shared/api");
  const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
  const { locale, page, elements, option } = params;

  return apiGet<IPaginatedResponse<IGamePromo>>("/promo/games", {
    locale,
    params: {
      ...(page && { page }),
      ...(elements && { elements }),
      ...(option && { option }),
    },
    next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.PROMO_GAMES] },
  });
}

export async function getPromoGameBySlug(
  slug: string,
  locale: string
): Promise<IGamePromoDetail | null> {
  try {
    const { apiGet } = await import("@/shared/api");
    const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
    return await apiGet<IGamePromoDetail>(`/promo/games/${slug}`, {
      locale,
      next: {
        revalidate: CACHE_REVALIDATE,
        tags: [CACHE_TAGS.PROMO_GAMES, CACHE_TAGS.PROMO_GAME(slug)],
      },
    });
  } catch {
    return null;
  }
}
