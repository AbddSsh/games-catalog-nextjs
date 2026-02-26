import { getHomePage } from "@/entities/page";
import { getCategories } from "@/entities/category";
import { getGamesByFilter, getGames } from "@/entities/game";
import { getTranslations } from "@/entities/translations";
import { HeroCarousel } from "@/widgets/hero-carousel";
import { GenresTabs } from "@/widgets/genres-tabs";
import { GameSections } from "@/widgets/game-sections";
import { CatalogCta } from "@/widgets/catalog-cta";

interface IHomeViewProps {
  locale: string;
}

export async function HomeView({ locale }: IHomeViewProps) {
  try {
    // Fetch all data in parallel
    const [pageConfig, categories, translations] = await Promise.all([
      getHomePage(locale),
      getCategories(locale),
      getTranslations(locale),
    ]);

    // Fetch hero games
    const heroGames = await getGamesByFilter(
      pageConfig.hero.filter,
      locale,
      1,
      pageConfig.hero.elements
    );

    // Fetch games for each section
    const gameSectionsData = await Promise.all(
      pageConfig.gameSections.map(async (section) => {
        try {
          const result = await getGamesByFilter(
            section.filter,
            locale,
            1,
            section.elements
          );
          return {
            config: section,
            games: result.items,
          };
        } catch {
          return {
            config: section,
            games: [],
          };
        }
      })
    );

    // Fetch games for each category (for genres tabs)
    const GAMES_LIMIT = 5;
    const gamesByCategory: Record<string, typeof heroGames.items> = {};
    await Promise.all(
      categories?.map(async (category) => {
        try {
          const result = await getGames({
            locale,
            category: category.slug,
            elements: GAMES_LIMIT,
          });
          gamesByCategory[category.slug] = result.items;
        } catch {
          gamesByCategory[category.slug] = [];
        }
      }) || []
    );

    return (
      <div className="space-y-9 pt-[40px]">
        {/* Hero Carousel */}
        <HeroCarousel
          games={heroGames.items}
          locale={locale}
          label={pageConfig.hero.label}
          translations={translations ? {
            moreDetails: translations.common.play_now,
          } : undefined}
        />

        {/* Genres Tabs */}
        <GenresTabs
          categories={categories}
          gamesByCategory={gamesByCategory}
          locale={locale}
          title={pageConfig.genres.title}
          subtitle={pageConfig.genres.subtitle}
          translations={translations ? {
            seeAll: translations.common.see_all,
            all: translations.category.all_games,
            download: translations.common.download,
            browser: translations.common.play_now,
            freeToPlay: translations.common.free_to_play,
          } : undefined}
        />

        {/* Game Sections (Top games, New games, etc.) */}
        <GameSections 
          sections={gameSectionsData} 
          locale={locale}
          translations={translations ? {
            download: translations.common.download,
            browser: translations.common.play_now,
            freeToPlay: translations.common.free_to_play,
          } : undefined}
        />

        {/* Catalog CTA */}
        <CatalogCta data={pageConfig.catalogCta} locale={locale} />

      </div>
    );
  } catch (error) {
    // Если API недоступен, возвращаем пустую страницу
    console.error("Error loading home page data:", error);
    return (
      <div className="space-y-9">
        <p>Unable to load page content. Please try again later.</p>
      </div>
    );
  }
}
