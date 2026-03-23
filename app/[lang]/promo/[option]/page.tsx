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

export default async function PromoOptionPage({ params }: IPromoOptionPageProps) {
  const { lang, option } = await params;
  const translations = await getTranslations(lang);

  return (
    <PromoOptionView
      locale={lang}
      option={option}
      translations={{
        loadMore: translations?.common?.load_more ?? "Load More",
        back: translations?.common?.back ?? "Back",
        next: translations?.common?.next ?? "Next",
      }}
    />
  );
}
