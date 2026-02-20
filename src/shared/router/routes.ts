export const ROUTES = {
  HOME: "/",
  CATALOG: "/catalog",
  CATEGORY: "/category",
  GAME: "/game",
} as const;

export type ROUTES_TYPE = typeof ROUTES[keyof typeof ROUTES];

export function getCategoryRoute(slug: string): string {
  return `${ROUTES.CATEGORY}/${slug}`;
}

export function getGameRoute(slug: string): string {
  return `${ROUTES.GAME}/${slug}`;
}
