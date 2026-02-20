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
  return apiGet<ILocaleConfig[]>("/locales");
}
