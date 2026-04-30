import type { Metadata } from "next";
import { HomeView } from "@/views/home";
import { getHomePage } from "@/entities/page";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";

interface IHomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: IHomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const [pageConfig, translations] = await Promise.all([
    getHomePage(lang),
    getTranslations(lang),
  ]);

  const languages = await getAlternatesLanguages();
  return {
    title: pageConfig.seo.title || translations?.meta.default_title,
    description: pageConfig.seo.description || translations?.meta.default_description,
    alternates: {
      canonical: getCanonicalUrl(lang),
      languages,
    },
  };
}

export default async function HomePage({ params }: IHomePageProps) {
  const { lang } = await params;
  return <HomeView locale={lang} />;
}
