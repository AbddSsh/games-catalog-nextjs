import type { Metadata } from "next";
import { HomeView } from "@/views/home";
import { getHomePage } from "@/entities/page";
import { getLocales } from "@/entities/locale";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl } from "@/shared/lib";

interface IHomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: IHomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const [pageConfig, translations] = await Promise.all([
    getHomePage(lang),
    getTranslations(lang),
  ]);

  return {
    title: pageConfig.seo.title || translations?.meta.default_title,
    description: pageConfig.seo.description || translations?.meta.default_description,
    alternates: {
      canonical: getCanonicalUrl(lang),
    },
  };
}

export async function generateStaticParams() {
  try {
    const locales = await getLocales();
    // Фильтруем только активные локали
    const activeLocales = locales.filter((l) => l.status === "active");
    
    // Генерируем параметры только для локали по умолчанию, чтобы избежать ошибок 404
    // Остальные локали будут генерироваться динамически при запросе
    const defaultLocale = activeLocales.find((l) => l.isDefault) || activeLocales[0];
    
    if (!defaultLocale) {
      return [];
    }
    
    return [{ lang: defaultLocale.code }];
  } catch {
    console.error("Error generating static params for home page");
    return [];
  }
}

export default async function HomePage({ params }: IHomePageProps) {
  const { lang } = await params;
  return <HomeView locale={lang} />;
}
