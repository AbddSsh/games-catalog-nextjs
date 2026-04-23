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
  const pathSegments = ROUTES.PROMO.replace(/^\//, "");
  const languages = await getAlternatesLanguages(pathSegments);

  return {
    title: `Best Free Online Games (2026) – Play Instantly on Desktop & Browser`,
    description: `Looking for the best free online games? Explore our top-rated picks, compare features, and start playing instantly with no downloads required.`,
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

export default async function PromoPage({
  params,
  searchParams,
}: IPromoPageProps) {
  const [{ lang }, search] = await Promise.all([params, searchParams]);
  const parsedPage = search.page ? parseInt(search.page, 10) : NaN;
  const parsedElements = search.elements ? parseInt(search.elements, 10) : NaN;

  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const elements = Number.isFinite(parsedElements)
    ? Math.max(6, parsedElements)
    : 6;

  const translations = await getTranslations(lang);
  return (
    <PromoView
      locale={lang}
      page={page}
      elements={elements}
      translations={{
        loadMore: translations?.common?.load_more ?? "Load More",
        back: translations?.common?.back ?? "Back",
        next: translations?.common?.next ?? "Next",
        promo: {
          title: {
            first: translations?.promo?.title?.first ?? "Best Free Online Games",
            second: translations?.promo?.title?.second ?? "2026",
          },
          video: translations?.promo?.video ?? "Video",
          info: translations?.promo?.info ?? "Info",
          play: translations?.promo?.play ?? "Play",
        },
      }}
    />
  );
}

