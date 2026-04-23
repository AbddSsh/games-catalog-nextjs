import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/views/catalog";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages, parseFilterParam } from "@/shared/lib";
import type { TViewMode } from "@/features/view-mode-toggle";
import type { TSortOption } from "@/features/sort-select";
import { ROUTES } from "@/shared/router";

interface ICatalogPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    q?: string;
    genres?: string;
    settings?: string;
    platforms?: string;
    features?: string;
    page?: string;
    elements?: string;
    view?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ICatalogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);

  if (!translations) {
    return {
      title: "Game Catalog",
      description: "Browse our game catalog",
    };
  }

  const languages = await getAlternatesLanguages(ROUTES.CATALOG.replace(/^\//, ""));
  return {
    title: `Game Catalog | ${translations.meta.default_title}`,
    description: translations.meta.default_description,
    alternates: {
      canonical: getCanonicalUrl(lang, `${ROUTES.CATALOG}`),
      languages,
    },
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: ICatalogPageProps) {
  const [{ lang }, search] = await Promise.all([params, searchParams]);

  const filters = {
    genres: parseFilterParam(search.genres),
    settings: parseFilterParam(search.settings),
    platforms: parseFilterParam(search.platforms),
    features: parseFilterParam(search.features),
  };

  const parsedPage = search.page ? parseInt(search.page, 10) : NaN;
  const parsedElements = search.elements ? parseInt(search.elements, 10) : NaN;
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const elements = Number.isFinite(parsedElements)
    ? Math.max(12, parsedElements)
    : 12;
  const viewMode = (search.view === "list" ? "list" : "grid") as TViewMode;
  const sort = (search.sort || "recommended") as TSortOption;

  const translations = await getTranslations(lang);

  if (!translations) {
    notFound();
  }

  return (
    <CatalogView
      locale={lang}
      searchQuery={search.q}
      filters={filters}
      page={page}
      elements={elements}
      viewMode={viewMode}
      sort={sort}
      translations={{
        games: translations.common.games,
        search: translations.common.search,
        download: translations.common.download,
        browser: translations.common.play_now,
        freeToPlay: translations.common.free_to_play,
        loadMore: translations.common.load_more,
        back: translations.common.back,
        next: translations.common?.next ?? "Next",
      }}
    />
  );
}
