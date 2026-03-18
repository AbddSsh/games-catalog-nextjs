import type { Metadata } from "next";
import { PromoView } from "@/views/promo";
import { getTranslations } from "@/entities/translations";
import { getLocales } from "@/entities/locale";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IPromoPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    page?: string;
    elements?: string;
  }>;
}

export async function generateMetadata({
  params,
}: IPromoPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const siteName = translations?.meta?.site_name ?? "Site";
  const pathSegments = ROUTES.PROMO.replace(/^\//, "");
  const languages = await getAlternatesLanguages(pathSegments);

  return {
    title: `Promo games | ${siteName}`,
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
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
    console.error("Error generating static params for promo page");
    return [];
  }
}

export default async function PromoPage({ params, searchParams }: IPromoPageProps) {
  const ELEMENTS_PER_PAGE = 10;
  const [{ lang }, search] = await Promise.all([params, searchParams]);
  const page = search.page ? parseInt(search.page, 10) : 1;
  const elements = search.elements ? Math.max(ELEMENTS_PER_PAGE, parseInt(search.elements, 10)) : ELEMENTS_PER_PAGE;
  const translations = await getTranslations(lang);
  return (
    <PromoView
      locale={lang}
      page={page}
      elements={elements}
      translations={{
        loadMore: translations?.common?.load_more ?? "Load More",
        back: translations?.common?.back ?? "Back",
        next: translations?.common?.back ?? "Next",
      }}
    />
  );
}

