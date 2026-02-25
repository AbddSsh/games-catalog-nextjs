// 31536000 - год
export const CACHE_REVALIDATE = 0;

export const CACHE_TAGS = {
  LOCALES: "locales",
  TRANSLATIONS: "translations",
  TRANSLATION: (locale: string) => `translation:${locale}`,
  PAGE_HOME: "page:home",
  PAGE_HOME_LOCALE: (locale: string) => `page:home:${locale}`,
  GAMES: "games",
  GAME: (slug: string) => `game:${slug}`,
  CATEGORIES: "categories",
  CATEGORY: (slug: string) => `category:${slug}`,
} as const;
