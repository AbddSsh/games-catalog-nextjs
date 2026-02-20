import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/views/catalog";
import { getTranslations } from "@/entities/translations";
import { getLocales } from "@/entities/locale";
import type { TViewMode } from "@/features/view-mode-toggle";
import type { TSortOption } from "@/features/sort-select";

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
    view?: string;
    sort?: string;
  }>;
}

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

  return {
    title: `Game Catalog | ${translations.meta.default_title}`,
    description: translations.meta.default_description,
  };
}

export async function generateStaticParams() {
  try {
    const locales = await getLocales();
    // Фильтруем только активные локали
    const activeLocales = locales.filter((l) => l.status === "active");
    return activeLocales.map((l) => ({ lang: l.code }));
  } catch (error) {
    console.error("Error generating static params for catalog:", error);
    return [];
  }
}

export default async function CatalogPage({
  params,
  searchParams,
}: ICatalogPageProps) {
  const [{ lang }, search] = await Promise.all([params, searchParams]);

  const filters = {
    genres: search.genres?.split(",").filter(Boolean),
    settings: search.settings?.split(",").filter(Boolean),
    platforms: search.platforms?.split(",").filter(Boolean),
    features: search.features?.split(",").filter(Boolean),
  };

  const page = search.page ? parseInt(search.page, 10) : 1;
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
        next: translations.common.back,
      }}
    />
  );
}
