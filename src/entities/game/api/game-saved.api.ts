import { getGames } from "./game.api";
import type { IGameBase } from "../model/game.types";

export interface ISavedGamesResponse {
  items: IGameBase[];
}

export async function getSavedGames(locale: string, slugs: string[]): Promise<ISavedGamesResponse> {
  if (!slugs.length) {
    return { items: [] };
  }

  // Временный простой подход: запрашиваем побольше игр и фильтруем по slug.
  // При появлении настоящего бэкенд-эндоинта заменить на прямой вызов.
  const response = await getGames({ locale, elements: 500 });
  const items = response.items.filter((game) => slugs.includes(game.slug));
  return { items };
}

