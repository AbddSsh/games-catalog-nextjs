import type { Metadata } from "next";
import { getLocales } from "@/entities/locale";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import { ROUTES } from "@/shared/router";
import { SitemapPage } from "@/views/sitemap";

interface ISitemapPageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ISitemapPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const siteName = translations?.meta?.site_name ?? "Site";
  const pathSegments = ROUTES.SITEMAP.replace(/^\//, "");
  const languages = await getAlternatesLanguages(pathSegments);
  return {
    title: `Карта сайта | ${siteName}`,
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
    },
  };
}

export async function generateStaticParams() {
  try {
    const locales = await getLocales();
    const activeLocales = locales.filter((l) => l.status === "active");
    return activeLocales.map((l) => ({ lang: l.code }));
  } catch {
    return [];
  }
}

export default async function SitemapRoutePage({ params }: ISitemapPageProps) {
  const { lang } = await params;
  return <SitemapPage locale={lang} />;
}
