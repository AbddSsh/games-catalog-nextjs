export type {
  ICategoryCard,
  ICategorySeo,
  ICategoryLocalized,
  ICategoryWithGames,
} from "./model/category.types";

export {
  getCategories,
  getCategoryBySlug,
  getAllCategorySlugs,
} from "./api/category.api";
