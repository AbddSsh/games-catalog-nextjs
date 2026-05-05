import type { ICategoryCard } from "@/entities/category";
import type { IGameBase } from "@/entities/game";
import type { IBlogArticleCard, IBlogListResponse } from "@/entities/blog";
import type { ITranslationsBlog } from "@/entities/translations";
import { BlogHero } from "@/widgets/blog-hero";
import { BlogList } from "@/widgets/blog-list";
import { BlogSidebar } from "@/widgets/blog-sidebar";
import { BlogReadersChoice } from "@/widgets/blog-readers-choice";
import { BlogPagination } from "@/features/pagination";
import { Breadcrumbs } from "@/shared/ui";
import { localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IBlogViewProps {
  locale: string;
  listData: IBlogListResponse;
  readersChoice: IBlogArticleCard[];
  categories: ICategoryCard[];
  tryThisWeek: IGameBase[];
  activeCategory?: string;
  searchQuery?: string;
  currentSort?: string;
  translations: ITranslationsBlog;
}

export function BlogView({
  locale,
  listData,
  readersChoice,
  categories,
  tryThisWeek,
  activeCategory,
  searchQuery,
  currentSort,
  translations,
}: IBlogViewProps) {
  const isCategoryMode = Boolean(activeCategory);
  const breadcrumbs = [
    { label: "Home", href: localePath(locale) }, // TODO: move to translations.common/home scope when backend provides it
    { label: translations.title, href: localePath(locale, ROUTES.BLOG) },
  ];

  return (
    <div className="space-y-7 pb-6 pt-[24px] max-w-[1080px] mx-auto">
      <Breadcrumbs items={breadcrumbs} className="text-xs text-text-muted" />

      <BlogHero
        locale={locale}
        title={translations.title}
        searchPlaceholder={translations.searchString.placeholder}
        chips={listData.chips}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        primary={isCategoryMode ? null : listData.heroArticles.primary}
        secondary={isCategoryMode ? [] : listData.heroArticles.secondary}
      />

      <div className="bg-[#A869E438] p-[1px]"></div>

      <div className="grid gap-3 grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-7">
          <BlogList
            locale={locale}
            items={listData.items}
            title={isCategoryMode ? "" : translations?.allArticles ?? "All Articles"}
            sortModal={translations.sortModal}
            currentSort={currentSort}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />

          {!isCategoryMode && listData.pagination.totalPages > 1 ? (
            <BlogPagination
              currentPage={listData.pagination.page}
              totalPages={listData.pagination.totalPages}
              locale={locale}
            />
          ) : null}
        </div>

        <BlogSidebar
          locale={locale}
          categories={categories}
          tryThisWeek={tryThisWeek}
          findGameSectionTitle={translations.findGameSection.title}
          findGameSectionSubtitle={translations.findGameSection.subtitle}
          findGameSectionCtaText={translations.findGameSection.ctaText}
          gamesSectionTitle={translations.gamesSection.title}
        />
      </div>

      {!isCategoryMode ? (
        <BlogReadersChoice
          locale={locale}
          items={readersChoice}
          title={translations.readersChoiceSection.title}
        />
      ) : null}
    </div>
  );
}
