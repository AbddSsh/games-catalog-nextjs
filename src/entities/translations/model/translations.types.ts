
// Common UI translations
export interface ITranslationsCommon {
  play_now: string;
  download: string;
  free_to_play: string;
  see_all: string;
  load_more: string;
  search: string;
  filters: string;
  categories: string;
  games: string;
  back: string;
  next: string;
  close: string;
  menu: string;
}

// Home page translations
export interface ITranslationsHome {
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  top_games: string;
  top_games_subtitle: string;
  all_categories: string;
  browse_categories: string;
  why_play_title: string;
  why_play_free_title: string;
  why_play_free_desc: string;
  why_play_safe_title: string;
  why_play_safe_desc: string;
  why_play_instant_title: string;
  why_play_instant_desc: string;
  faq_title: string;
}

// Game page translations
export interface ITranslationsGame {
  about: string;
  game_overview: string;
  special_features: string;
  facts: string;
  faq: string;
  related_games: string;
  similar_games: string;
  share: string;
}

// Category page translations
export interface ITranslationsCategory {
  games_count: string;
  games_count_one: string;
  filter_by_genre: string;
  filter_by_setting: string;
  filter_by_platform: string;
  filter_by_features: string;
  no_games: string;
  no_games_desc: string;
  clear_filters: string;
  all_games: string;
  showing_results: string;
  sort_recommended: string;
}

// SEO landing translations
export interface ITranslationsSeoLanding {
  top_free_games_title: string;
  top_free_games_desc: string;
  best_mobile_title: string;
  best_mobile_desc: string;
  best_pc_title: string;
  best_pc_desc: string;
}

// Error page translations
export interface ITranslationsErrors {
  page_not_found: string;
  page_not_found_desc: string;
  something_went_wrong: string;
  something_went_wrong_desc: string;
  try_again: string;
  go_home: string;
  game_not_found: string;
  category_not_found: string;
}

// Footer translations
export interface ITranslationsFooter {
  privacy_policy: string;
  terms_of_service: string;
  contact: string;
  copyright: string;
  about_us: string;
  support: string;
}

// Meta/SEO translations
export interface ITranslationsMeta {
  site_name: string;
  default_title: string;
  default_description: string;
}

export interface ITranslationsCountry {
  are_you_from: string;
  yes_continue: string;
  no_choose_another_country: string;
  choose_a_country: string;
  enter_a_country: string;
  continue: string;
}

export interface ITranslationsPromo {
  title: {
    first: string;
    second: string;
  };
  video: string;
  info: string;
  play: string;
}

export interface ITranslationsBlog {
  title: string;
  allArticles: string;
  findGameSection: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  gamesSection: {
    title: string;
  };
  sortModal: Record<string, string>;
  readersChoiceSection: {
    title: string;
  };
  searchString: {
    placeholder: string;
  };
}

// Complete translations object (GET /api/translations/:locale)
export interface ITranslations {
  locale: string;
  common: ITranslationsCommon;
  home: ITranslationsHome;
  game: ITranslationsGame;
  category: ITranslationsCategory;
  seo_landing: ITranslationsSeoLanding;
  errors: ITranslationsErrors;
  footer: ITranslationsFooter;
  meta: ITranslationsMeta;
  country: ITranslationsCountry;
  promo: ITranslationsPromo;
  blog: ITranslationsBlog;
}
