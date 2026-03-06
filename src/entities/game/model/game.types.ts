
import type { IContentParagraph, ISeoMeta } from "@/shared/types";

// CTA button type
export type TCtaType = "play" | "download";

// Ref types for related game (slug + name, or + color for tags)
export interface IRefSlugName {
  slug: string;
  name: string;
}
export interface IRefTag extends IRefSlugName {
  color: string;
}

// Related game (for sidebar "Similar games")
export interface IRelatedGame {
  slug: string;
  name: string;
  bannerImage: string;
  genres: IRefSlugName[];
  platforms: IRefSlugName[];
  features: IRefSlugName[];
  tags: IRefTag[];
}

// Game card (lists, catalog, carousels, search)
// Used in: GET /api/games, /games/search, /games/by-filter, /categories/:slug
export interface IGameBase {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  cardImage: string;
  bannerImage: string;
  genres: IRefSlugName[];
  settings: IRefSlugName[];
  platforms: IRefSlugName[];
  features: IRefSlugName[];
  tags: IRefTag[];
  ctaType: TCtaType;
  ctaText: string;
}

// Full game page (GET /api/games/:slug)
// Adds: gallery, video, content sections, offer, related, SEO
export interface IGameDetail extends IGameBase {
  screenshots: string[];
  videoUrl: string | null;
  facts: IContentParagraph[];
  gameOverview: IContentParagraph[];
  specialFeatures: IContentParagraph[];
  trackingLink: string;
  payout: number;
  relatedGames: IRelatedGame[];
  seo: ISeoMeta;
}

// Query params for games list
export interface IGamesQueryParams {
  locale: string;
  category?: string;
  genres?: string;
  settings?: string;
  platforms?: string;
  features?: string;
  q?: string;
  sort?: "priority" | "name";
  page?: number;
  elements?: number;
}

// Search response
export interface IGamesSearchResponse {
  query: string;
  items: IGameBase[];
  pagination: {
    page: number;
    elements: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

// By-filter response
export interface IGamesByFilterResponse {
  filter: string;
  filterName: string;
  items: IGameBase[];
  pagination: {
    page: number;
    elements: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}
