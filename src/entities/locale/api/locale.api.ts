export interface ILocaleConfig {
  code: string;
  language: string;
  name: string;
  nativeName: string;
  status: string;
  isDefault: boolean;
  fallback: string | null;
  dateFormat: string;
  currency: string;
}

export async function getLocales(): Promise<ILocaleConfig[]> {
  const { apiGet } = await import("@/shared/api");
  const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
  return apiGet<ILocaleConfig[]>("/locales", {
    next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.LOCALES] },
  });
}
