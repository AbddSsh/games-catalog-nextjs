
import type { IContentParagraph, IPagination } from "@/shared/types";
import type { IGameBase } from "@/entities/game";
import type { IFilters } from "@/entities/filter";

// Category card (for lists, tabs)
export interface ICategoryCard {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  bannerImage: string;
  gamesCount: number;
  priority: number;
}

// Category SEO data
export interface ICategorySeo {
  title: string;
  description: string;
  seoText: IContentParagraph[];
}

// Full category with localized data
export interface ICategoryLocalized {
  id: string;
  slug: string;
  icon: string;
  bannerImage: string;
  priority: number;
  name: string;
  description: string;
  gamesCount: number;
  seo: ICategorySeo;
}

// Category with games response (GET /api/categories/:slug)
export interface ICategoryWithGames {
  category: ICategoryLocalized;
  games: IGameBase[];
  pagination: IPagination;
  filters: IFilters;
}
