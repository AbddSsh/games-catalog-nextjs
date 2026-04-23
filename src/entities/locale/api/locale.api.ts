import { apiGet } from "@/shared/api";
import { CACHE_REVALIDATE } from "@/shared/config";

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
  return apiGet<ILocaleConfig[]>("/locales", {
    next: { revalidate: CACHE_REVALIDATE },
  });
  // МОК (раскомментировать если бэк не отдаёт локали):
  // return Promise.resolve(MOCK_LOCALES);
}
