
import type { ISeoMeta } from "@/shared/types";

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

// --- Game Overview polymorphic blocks ---

export const ENUM_GO_KIND = {
  SECTION_HEADING: "section_heading",
  TITLE_BODY: "title_body",
  PARAGRAPH: "paragraph",
  STEPS_ROW: "steps_row",
  FAQ_SECTION: "faq_section",
  CTA_BANNER: "cta_banner",
  BOTTOM_CTA: "bottom_cta",
} as const;
export type ENUM_GO_KIND_TYPE = (typeof ENUM_GO_KIND)[keyof typeof ENUM_GO_KIND];

export interface IBlockSectionHeading {
  kind: typeof ENUM_GO_KIND.SECTION_HEADING;
  heading: string;
}
export interface IBlockTitleBody {
  kind: typeof ENUM_GO_KIND.TITLE_BODY;
  title: string;
  text: string;
}
export interface IBlockParagraph {
  kind: typeof ENUM_GO_KIND.PARAGRAPH;
  text: string;
}
export interface IBlockStepItem {
  position: number;
  label: string;
  text: string;
}
export interface IBlockStepsRow {
  kind: typeof ENUM_GO_KIND.STEPS_ROW;
  steps: IBlockStepItem[];
}
export interface IBlockFaqSection {
  kind: typeof ENUM_GO_KIND.FAQ_SECTION;
  title: string;
  items: { question: string; answer: string }[];
}
export interface IBlockCtaBanner {
  kind: typeof ENUM_GO_KIND.CTA_BANNER;
  title: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  iconSlug: string;
  iconUrl: string;
}
export interface IBlockBottomCta {
  kind: typeof ENUM_GO_KIND.BOTTOM_CTA;
  title: string;
  captions: string[];
  ctaText: string;
  ctaUrl: string;
  iconSlug: string;
  iconUrl: string;
}

export type TGameOverviewBlock =
  | IBlockSectionHeading
  | IBlockTitleBody
  | IBlockParagraph
  | IBlockStepsRow
  | IBlockFaqSection
  | IBlockCtaBanner
  | IBlockBottomCta;

// --- Special Features polymorphic blocks ---

export const ENUM_SF_KIND = {
  SYSTEM_REQUIREMENTS: "system_requirements",
  KEY_FEATURES_GRID: "key_features_grid",
  PROS_CONS: "pros_cons",
  CTA_FOOTER: "cta_footer",
} as const;
export type ENUM_SF_KIND_TYPE = (typeof ENUM_SF_KIND)[keyof typeof ENUM_SF_KIND];

export interface IBlockSystemRequirements {
  kind: typeof ENUM_SF_KIND.SYSTEM_REQUIREMENTS;
  minimum: { label: string; value: string }[];
  recommended: { label: string; value: string }[];
  label: string;
  minimumLabel: string;
  recommendedLabel: string;
}
export interface IBlockKeyFeaturesGrid {
  kind: typeof ENUM_SF_KIND.KEY_FEATURES_GRID;
  items: { templateSlug: string; iconUrl: string; name: string }[];
  label: string;
}
export interface IBlockProsCons {
  kind: typeof ENUM_SF_KIND.PROS_CONS;
  label: string;
  prosLabel: string;
  consLabel: string;
  pros: { label: string; value: string }[];
  cons: { label: string; value: string }[];
}
export interface IBlockCtaFooter {
  kind: typeof ENUM_SF_KIND.CTA_FOOTER;
  title: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  iconSlug: string;
  iconUrl: string;
}

export type TSpecialFeatureBlock =
  | IBlockSystemRequirements
  | IBlockKeyFeaturesGrid
  | IBlockProsCons
  | IBlockCtaFooter;

// --- Fact ---

export interface IGameFact {
  title: string;
  text: string;
}

// Game card (lists, catalog, carousels, search)
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
export interface IGameDetail extends IGameBase {
  title: string;
  screenshots: string[];
  videoUrl: string | null;
  facts: IGameFact[];
  gameOverview: TGameOverviewBlock[];
  specialFeatures: TSpecialFeatureBlock[];
  trackingLink: string;
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
