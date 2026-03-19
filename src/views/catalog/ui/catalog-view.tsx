import { Suspense } from "react";
import { getGames } from "@/entities/game";
import { getFilters } from "@/entities/filter";
import { GameGrid } from "@/widgets/game-grid";
import { GameFilters } from "@/features/game-filters";
// import { Pagination } from "@/features/pagination";
import { ViewModeToggle, type TViewMode } from "@/features/view-mode-toggle";
import { SortSelect, type TSortOption } from "@/features/sort-select";
import { Breadcrumbs, type IBreadcrumbItem } from "@/shared/ui";
import type { IAppliedFilters } from "@/entities/filter";
// import { ROUTES } from "@/shared/router";
import { localePath } from "@/shared/lib";

// const ELEMENTS_PER_PAGE = 12;

interface ICatalogViewProps {
  locale: string;
  searchQuery?: string;
  filters?: IAppliedFilters;
  page?: number;
  elements?: number;
  viewMode?: TViewMode;
  sort?: TSortOption;
  translations: {
    games: string;
    search: string;
    download: string;
    browser: string;
    freeToPlay: string;
    loadMore: string;
    back: string;
    next: string;
    noGames?: string;
  };
}

export async function CatalogView({
  locale,
  searchQuery,
  filters = {},
  // Temporarily disabled pagination props
  // page = 1,
  // elements = ELEMENTS_PER_PAGE,
  viewMode = "grid",
  sort = "recommended",
  translations,
}: ICatalogViewProps) {
  // Fetch data in parallel
  const [gamesResponse, filtersConfig] = await Promise.all([
    getGames({
      locale,
      q: searchQuery && searchQuery.trim().length >= 2 ? searchQuery.trim() : undefined,
      genres: filters.genres?.join(","),
      settings: filters.settings?.join(","),
      platforms: filters.platforms?.join(","),
      features: filters.features?.join(","),
      // page,
      // elements,
      sort,
    }),
    getFilters(locale),
  ]);

  const { items: games } = gamesResponse;

  // Need translations passed from parent
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: translations.games, href: localePath(locale) },
    { label: translations.games },
  ];

  return (
    <div className="flex flex-col gap-10 lg:flex-row pt-[40px]">
      {/* Filters Sidebar */}
      <aside className="w-full lg:max-w-64 lg:w-[20vw] flex-shrink-0">
        <Suspense fallback={<div className="h-96 animate-pulse bg-bg-card rounded-lg" />}>
          <GameFilters
            filters={filtersConfig}
            appliedFilters={filters}
            locale={locale}
          />
        </Suspense>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col gap-6 w-full">

        {/* Breadcrumbs */}
        {/* <Breadcrumbs items={breadcrumbs} /> */}

        {/* Games Content */}
        <div className="flex-1 space-y-6">
          {/* Header with title, view toggle and sort */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                {searchQuery
                  ? `${translations.search}: "${searchQuery}"`
                  : translations.games}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Suspense fallback={null}>
                <SortSelect currentSort={sort} />
              </Suspense>
              <Suspense fallback={null}>
                <ViewModeToggle currentMode={viewMode} />
              </Suspense>
            </div>
          </div>

          {/* Games Grid/List */}
          <GameGrid
            games={games}
            locale={locale}
            columns={4}
            viewMode={viewMode}
            translations={{
              download: translations.download,
              browser: translations.browser,
              freeToPlay: translations.freeToPlay,
              noGames: translations.noGames,
            }}
          />

          {/* Pagination (temporarily disabled) */}
          {/* {(pagination.totalPages > 1 || games.length < pagination.totalItems) && ( */}
          {/*   <Suspense fallback={null}> */}
          {/*     <Pagination */}
          {/*       currentPage={pagination.page} */}
          {/*       totalPages={pagination.totalPages} */}
          {/*       locale={locale} */}
          {/*       basePath={ROUTES.CATALOG} */}
          {/*       currentElements={elements} */}
          {/*       elementsStep={ELEMENTS_PER_PAGE} */}
          {/*       totalItems={pagination.totalItems} */}
          {/*       translations={{ */}
          {/*         loadMore: translations.loadMore, */}
          {/*         back: translations.back, */}
          {/*         next: translations.next, */}
          {/*       }} */}
          {/*     /> */}
          {/*   </Suspense> */}
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
