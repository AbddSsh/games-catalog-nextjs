import { Suspense } from "react";
import Image from "next/image";
import { GameGrid } from "@/widgets/game-grid";
import { Pagination } from "@/features/pagination";
import { ViewModeToggle, type TViewMode } from "@/features/view-mode-toggle";
import { SortSelect, type TSortOption } from "@/features/sort-select";
import { Breadcrumbs, type IBreadcrumbItem } from "@/shared/ui";
import type { ICategoryWithGames } from "@/entities/category";

interface ICategoryViewProps {
  data: ICategoryWithGames;
  locale: string;
  viewMode?: TViewMode;
  sort?: TSortOption;
  translations: {
    home: string;
    games: string;
    download: string;
    browser: string;
    freeToPlay: string;
    loadMore: string;
    back: string;
    next: string;
  };
}

export async function CategoryView({
  data,
  locale,
  viewMode = "grid",
  sort = "recommended",
  translations,
}: ICategoryViewProps) {
  const { category, games, pagination } = data;

  // Need translations passed from parent
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: translations.home, href: `/${locale}` },
    { label: translations.games, href: `/${locale}/catalog` },
    { label: category.name },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner - Full Width of screen */}
      <section className="relative -mx-[15px] mobile-xl:-mx-[25px] overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        {/* Banner Image */}
        <div className="relative w-full">
          <Image
            src={category.bannerImage || "/images/placeholder-banner.jpg"}
            alt={category.name}
            width={1920}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/60 to-transparent" />
        </div>

        {/* Banner Content - Positioned over image */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="space-y-5 max-w-[1400px] mx-auto w-full px-[25px] pb-10">
            {/* Breadcrumbs on banner */}
            {/* <Breadcrumbs items={breadcrumbs} className="text-text-primary font-normal" /> */}

            {/* Category Title */}
            <h1 className="text-[54px] font-bold text-text-primary md:text-5xl">
              {category.name}
            </h1>

            {/* Description */}
            <h2 className="max-w-[70vw] text-xs text-text-primary font-normal">
              {category.description}
            </h2>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="space-y-5">
        {/* Header with sort and view toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={null}>
            <SortSelect currentSort={sort} />
          </Suspense>
          <Suspense fallback={null}>
            <ViewModeToggle currentMode={viewMode} />
          </Suspense>
        </div>

        {/* Games Grid/List */}
        <GameGrid
          games={games}
          locale={locale}
          columns={5}
          viewMode={viewMode}
          translations={{
            download: translations.download,
            browser: translations.browser,
            freeToPlay: translations.freeToPlay,
          }}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Suspense fallback={null}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              locale={locale}
              basePath={`/category/${category.slug}`}
              translations={{
                loadMore: translations.loadMore,
                back: translations.back,
                next: translations.next,
              }}
            />
          </Suspense>
        )}
      </section>
    </div>
  );
}
