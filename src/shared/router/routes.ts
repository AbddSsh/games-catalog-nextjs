export const ROUTES = {
  HOME: "/",
  CATALOG: "/catalog",
  BLOG: "/blog",
  CATEGORY: "/category",
  GAME: "/game",
  PROMO: "/promo",
  SAVED: "/saved",
  PRIVACY: "/privacy",
  SITEMAP: "/sitemap",
} as const;

export type ROUTES_TYPE = typeof ROUTES[keyof typeof ROUTES];

export function getCategoryRoute(slug: string): string {
  return `${ROUTES.CATEGORY}/${slug}`;
}

export function getGameRoute(slug: string): string {
  return `${ROUTES.GAME}/${slug}`;
}

export function getBlogRoute(): string {
  return ROUTES.BLOG;
}

export function getBlogArticleRoute(slug: string): string {
  return `${ROUTES.BLOG}/${slug}`;
}

export function getPromoRoute(): string {
  return ROUTES.PROMO;
}

export function getSavedRoute(): string {
  return ROUTES.SAVED;
}
