import type { Metadata } from "next";
import { PromoOptionView } from "@/views/promo-option";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IPromoOptionPageProps {
  params: Promise<{
    lang: string;
    option: string;
  }>;
  searchParams: Promise<{
    page?: string;
    elements?: string;
  }>;
}

function formatOptionLabel(option: string): string {
  return option
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatOptionText(option: string): string {
  return option
    .replace(/[-_]+/g, " ")
    .trim()
    .toLowerCase();
}

export async function generateMetadata({
  params,
}: IPromoOptionPageProps): Promise<Metadata> {
  const { lang, option } = await params;
  const pathSegments = `${ROUTES.PROMO.replace(/^\//, "")}/${option}`;
  const languages = await getAlternatesLanguages(pathSegments);
  const optionLabel = formatOptionLabel(option);
  const optionText = formatOptionText(option);

  return {
    title: `Best Free Online ${optionLabel} Games 2026 – Play Instantly on Desktop & Browser`,
    description: `Looking for the best free online ${optionText} games? Explore our top-rated picks, compare features, and start playing instantly with no downloads required.`,
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
    },
  };
}

export default async function PromoOptionPage({
  params,
  searchParams,
}: IPromoOptionPageProps) {
  const [{ lang, option }, search] = await Promise.all([params, searchParams]);
  const parsedPage = search.page ? parseInt(search.page, 10) : NaN;
  const parsedElements = search.elements ? parseInt(search.elements, 10) : NaN;
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const elements = Number.isFinite(parsedElements)
    ? Math.max(6, parsedElements)
    : 6;

  const translations = await getTranslations(lang);

  return (
    <PromoOptionView
      locale={lang}
      option={option}
      page={page}
      elements={elements}
      translations={{
        loadMore: translations?.common?.load_more ?? "Load More",
        back: translations?.common?.back ?? "Back",
        next: translations?.common?.next ?? "Next",
        promo: {
          title: {
            first: translations?.promo?.title?.first ?? "Best Free Online",
            second: translations?.promo?.title?.second ?? "Games 2026",
          },
          video: translations?.promo?.video ?? "Video",
          info: translations?.promo?.info ?? "Info",
          play: translations?.promo?.play ?? "Play",
        },
      }}
    />
  );
}
