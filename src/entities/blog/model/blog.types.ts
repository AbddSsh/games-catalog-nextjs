import type { IPaginatedResponse, ISeoMeta } from "@/shared/types";

export const ENUM_BLOG_ERROR_CODE = {
  MISSING_LOCALE: "MISSING_LOCALE",
  BLOG_ARTICLE_NOT_FOUND: "BLOG_ARTICLE_NOT_FOUND",
  BLOG_INVALID_STATUS_TRANSITION: "BLOG_INVALID_STATUS_TRANSITION",
  BLOG_INVALID_PAYLOAD: "BLOG_INVALID_PAYLOAD",
  BLOG_DUPLICATE_SLUG: "BLOG_DUPLICATE_SLUG",
  BLOG_INVALID_BLOCK_KIND: "BLOG_INVALID_BLOCK_KIND",
} as const;

export type ENUM_BLOG_ERROR_CODE_TYPE =
  typeof ENUM_BLOG_ERROR_CODE[keyof typeof ENUM_BLOG_ERROR_CODE];

export const ENUM_BLOG_BLOCK_KIND = {
  HEADING: "heading",
  SUBHEADING: "subheading",
  PARAGRAPH: "paragraph",
  VIDEO_URL: "videoUrl",
  IMAGE: "image",
  IMAGE_GALLERY: "imageGallery",
  OPTIONS_BLOCK: "optionsBlock",
  VERSUS_BLOCK: "versusBlock",
  CTA: "CTA",
  COLLAPSE_BLOCK: "collapseBlock",
  TABLE: "table",
  ATTENTION_BLOCK: "attentionBlock",
} as const;

export type ENUM_BLOG_BLOCK_KIND_TYPE =
  typeof ENUM_BLOG_BLOCK_KIND[keyof typeof ENUM_BLOG_BLOCK_KIND];

export interface IBlogChip {
  slug: string;
  label: string;
}

export interface IBlogArticleCard {
  slug: string;
  title: string;
  description: string;
  bannerImage?: string;
  publishedAt: string;
  readMinutes?: number;
  rating: number;
  reactionsCount: number;
  chip?: IBlogChip;
}

export interface IBlogArticleRecommendedItem {
  slug: string;
  articleTitle: string;
  articleSubTitle: string;
  bannerImage?: string;
  rating: number;
}

export interface IBlogArticleRecommendedSection {
  title: string;
  items: IBlogArticleRecommendedItem[];
}

export interface IBlogListHero {
  primary: IBlogArticleCard | null;
  secondary: IBlogArticleCard[];
}

export interface IBlogListResponse extends IPaginatedResponse<IBlogArticleCard> {
  heroTitle: string;
  heroArticles: IBlogListHero;
  activeChip: string;
  chips: IBlogChip[];
  searchQuery?: string;
}

export interface IRelatedGameLink {
  name: string;
  slug: string;
}

export interface IBlogArticleHeader {
  relatedGames?: IRelatedGameLink[];
  title: string;
  subtitle?: string;
  headerImage?: string;
  publishedAt: string;
  readMinutes?: number;
  rating: number;
  reactionsCount: number;
}

export interface IBlogFaqItem {
  question: string;
  answer: string;
}

export interface IBlogFaqBlock {
  title: string;
  items: IBlogFaqItem[];
}

export interface IBlogIsLikedBlock {
  kind: "isLiked";
  label: string;
  yesLabel: string;
  noLabel: string;
}

export interface IBlogBottomCta {
  title: string;
  captions: string[];
  ctaText: string;
  ctaUrl: string;
}

export interface IBlogArticleFooter {
  FAQBlock?: IBlogFaqBlock;
  isLiked?: IBlogIsLikedBlock;
  bottomCTA?: IBlogBottomCta;
}

export interface IBlogHeadingBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.HEADING;
  value: string;
}

export interface IBlogSubheadingBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.SUBHEADING;
  value: string;
}

export interface IBlogParagraphBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.PARAGRAPH;
  value: string;
}

export interface IBlogVideoUrlBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.VIDEO_URL;
  url: string;
}

export interface IBlogImageBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.IMAGE;
  url: string;
}

export interface IBlogImageGalleryBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.IMAGE_GALLERY;
  images: string[];
}

export interface IBlogOptionsBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.OPTIONS_BLOCK;
  optionFirst: {
    title: string;
    image: string;
  };
  optionSecond: {
    title: string;
    image: string;
  };
}

export interface IBlogVersusBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.VERSUS_BLOCK;
  vsLabel: string;
  leftSide: {
    title: string;
    points: Array<{ value: string }>;
  };
  rightSide: {
    title: string;
    points: Array<{ value: string }>;
  };
}

export interface IBlogCtaBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.CTA;
  ctaLabel: string;
  ctaUrl: string;
}

export interface IBlogCollapseBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.COLLAPSE_BLOCK;
  title: string;
  description: string;
}

export interface IBlogTableBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.TABLE;
  columns: string[];
  rows: string[][];
}

export interface IBlogAttentionBlock {
  kind: typeof ENUM_BLOG_BLOCK_KIND.ATTENTION_BLOCK;
  title: string;
  value: string;
}

export type TBlogArticleBodyBlock =
  | IBlogHeadingBlock
  | IBlogSubheadingBlock
  | IBlogParagraphBlock
  | IBlogVideoUrlBlock
  | IBlogImageBlock
  | IBlogImageGalleryBlock
  | IBlogOptionsBlock
  | IBlogVersusBlock
  | IBlogCtaBlock
  | IBlogCollapseBlock
  | IBlogTableBlock
  | IBlogAttentionBlock;

export interface IBlogArticleDetail {
  slug: string;
  articleHeader: IBlogArticleHeader;
  recommendedArticles?: IBlogArticleRecommendedSection;
  articleBody: {
    blocks: TBlogArticleBodyBlock[];
  };
  articleFooter: IBlogArticleFooter;
  seo: ISeoMeta;
}

export interface IGetBlogArticlesListParams {
  locale: string;
  category?: string;
  q?: string;
  page?: number;
  elements?: number;
  sort?: string;
}
