export type {
  TCtaType,
  IRefSlugName,
  IRefTag,
  IRelatedGame,
  IGameBase,
  IGameDetail,
  IGamesQueryParams,
  IGamesSearchResponse,
  IGamesByFilterResponse,
} from "./model/game.types";

export {
  getGames,
  getGameBySlug,
  searchGames,
  getGamesByFilter,
  getAllGameSlugs,
} from "./api/game.api";

export type {
  IGamePromo,
  IGamePromoDetail,
  IGetPromoGamesParams,
} from "./api/game-promo.api";
export { getPromoGames, getPromoGameBySlug } from "./api/game-promo.api";

export type { ISavedGamesResponse } from "./api/game-saved.api";
export { getSavedGames } from "./api/game-saved.api";
