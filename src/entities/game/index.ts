export type {
  TCtaType,
  IRefSlugName,
  IRefTag,
  IRelatedGame,
  IGameBase,
  IGameDetail,
  IGameFact,
  IGamesQueryParams,
  IGamesSearchResponse,
  IGamesByFilterResponse,
  ENUM_GO_KIND_TYPE,
  ENUM_SF_KIND_TYPE,
  TGameOverviewBlock,
  TSpecialFeatureBlock,
  IBlockSectionHeading,
  IBlockTitleBody,
  IBlockParagraph,
  IBlockStepItem,
  IBlockStepsRow,
  IBlockFaqSection,
  IBlockCtaBanner,
  IBlockBottomCta,
  IBlockSystemRequirements,
  IBlockKeyFeaturesGrid,
  IBlockProsCons,
  IBlockCtaFooter,
} from "./model/game.types";

export {
  ENUM_GO_KIND,
  ENUM_SF_KIND,
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
