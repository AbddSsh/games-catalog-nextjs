export interface ILocaleConfig {
  code: string;
  language: string;
  name: string;
  nativeName: string;
  status: string;
  isDefault: boolean;
  fallback: string | null;
  flagIcon: string;
}

const MOCK_LOCALES: ILocaleConfig[] = [
  {
    code: "en",
    language: "en",
    name: "English",
    nativeName: "English",
    status: "active",
    isDefault: true,
    fallback: null,
    flagIcon: "/flags/en.svg",
  },
  {
    code: "sk",
    language: "sk",
    name: "Slovak",
    nativeName: "Slovenčina",
    status: "active",
    isDefault: false,
    fallback: "en",
    flagIcon: "/flags/sk.svg",
  },
  {
    code: "pt",
    language: "pt",
    name: "Portuguese",
    nativeName: "Português",
    status: "active",
    isDefault: false,
    fallback: "en",
    flagIcon: "/flags/pt.svg",
  },
];

export async function getLocales(): Promise<ILocaleConfig[]> {
  const { apiGet } = await import("@/shared/api");
  const { CACHE_REVALIDATE, CACHE_TAGS } = await import("@/shared/config/cache.config");
  return apiGet<ILocaleConfig[]>("/locales", {
    next: { revalidate: CACHE_REVALIDATE, tags: [CACHE_TAGS.LOCALES] },
  });
  // МОК (раскомментировать если бэк не отдаёт локали):
  // return Promise.resolve(MOCK_LOCALES);
}
