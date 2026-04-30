import type { IPaginatedResponse } from "@/shared/types";
import type { IGameBase, TGameOverviewBlock } from "../model/game.types";
import { apiGet } from "@/shared/api";
import { CACHE_REVALIDATE } from "@/shared/config";

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
  gameOverview: TGameOverviewBlock[];
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
  const { locale, page, elements, option } = params;

  return apiGet<IPaginatedResponse<IGamePromo>>("/promo/games", {
    locale,
    params: {
      ...(page && { page }),
      ...(elements && { elements }),
      ...(option && { option }),
    },
    next: { revalidate: CACHE_REVALIDATE },
  });
}

export async function getPromoGameBySlug(
  slug: string,
  locale: string
): Promise<IGamePromoDetail | null> {
  try {
    return await apiGet<IGamePromoDetail>(`/promo/games/${slug}`, {
      locale,
      next: {
        revalidate: CACHE_REVALIDATE,
      },
    });
  } catch {
    return null;
  }
}
