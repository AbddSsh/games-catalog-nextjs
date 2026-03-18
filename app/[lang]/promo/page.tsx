import type { Metadata } from "next";
import { PromoView } from "@/views/promo";
import { getTranslations } from "@/entities/translations";
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

export const dynamic = "force-dynamic";

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

