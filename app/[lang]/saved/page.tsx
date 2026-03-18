import type { Metadata } from "next";
import { SavedView } from "@/views/saved";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface ISavedPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ISavedPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const siteName = translations?.meta?.site_name ?? "Site";
  const pathSegments = ROUTES.SAVED.replace(/^\//, "");
  const languages = await getAlternatesLanguages(pathSegments);

  return {
    title: `Saved games | ${siteName}`,
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
    },
  };
}

export default async function SavedPage({ params }: ISavedPageProps) {
  const { lang } = await params;
  return <SavedView locale={lang} />;
}

