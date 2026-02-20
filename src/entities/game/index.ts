export type {
  TCtaType,
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
