import type { Metadata } from "next";
import { getLocales } from "@/entities/locale";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import { ROUTES } from "@/shared/router";
import { PrivacyView } from "@/views/privacy";

interface IPrivacyPageProps {
  params: Promise<{ lang: string }>;
}

function getLastUpdatedNow(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: IPrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const siteName = translations?.meta.default_title ?? "Site";
  const languages = await getAlternatesLanguages(ROUTES.PRIVACY.replace(/^\//, ""));
  return {
    title: `Privacy Policy | ${siteName}`,
    description:
      "This Privacy Policy explains how information is handled when you visit and use this website. We do not collect personally identifiable information.",
    alternates: {
      canonical: getCanonicalUrl(lang, ROUTES.PRIVACY.replace(/^\//, "")),
      languages,
    },
  };
}

export async function generateStaticParams() {
  try {
    const locales = await getLocales();
    const activeLocales = locales.filter((l) => l.status === "active");
    return activeLocales.map((l) => ({ lang: l.code }));
  } catch (error) {
    console.error("Error generating static params for privacy:", error);
    return [];
  }
}

export default async function PrivacyPage({ params }: IPrivacyPageProps) {
  const { lang } = await params;
  const lastUpdated = getLastUpdatedNow();
  return <PrivacyView locale={lang} lastUpdated={lastUpdated} />;
}
