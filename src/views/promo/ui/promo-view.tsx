import { getPromoGames } from "@/entities/game";
import { CatalogCta } from "@/widgets/catalog-cta";
import { PromoCard, PromoFeaturedCard } from "@/widgets/promo";
import { Pagination } from "@/features/pagination";
import { ROUTES } from "@/shared/router";
import { getHomePage } from "@/entities/page";

interface IPromoViewProps {
  locale: string;
  page: number;
  elements: number;
  translations: {
    loadMore: string;
    back: string;
    next: string;
    promo: {
      title: { first: string; second: string };
      video: string;
      info: string;
      play: string;
    };
  };
}


export async function PromoView({
  locale,
  page,
  elements,
  translations,
}: IPromoViewProps) {
  const [{ items, pagination }, pageConfig] = await Promise.all([
    getPromoGames({ locale, page, elements }),
    getHomePage(locale),
  ]);
  const promoTranslations = translations.promo;

  const featuredGame = items[0] ?? null;
  const restGames = items.slice(1);

  return (
    <section className="flex flex-col gap-10 pt-[40px] max-w-[1080px] mx-auto">
      <h1 className="text-3xl font-bold text-text-primary">
        {promoTranslations.title.first} {promoTranslations.title.second}
      </h1>

      <div className="flex flex-col gap-3">
        {featuredGame && featuredGame.bannerImage ? (
          <PromoFeaturedCard game={featuredGame} bannerImage={featuredGame.bannerImage} locale={locale} translations={{ play: promoTranslations.play }} />
        ) : featuredGame ? (
          <PromoCard game={featuredGame} locale={locale} translations={promoTranslations} />
        ) : null}

        {restGames.map((game) => (
          <PromoCard key={game.id} game={game} locale={locale} translations={promoTranslations} />
        ))}
      </div>

      {(pagination.totalPages > 1 || pagination.elements < pagination.totalItems) && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          locale={locale}
          basePath={ROUTES.PROMO}
          currentElements={elements}
          elementsStep={6}
          totalItems={pagination.totalItems}
          translations={translations}
        />
      )}

      {/* Catalog CTA */}
      <CatalogCta data={pageConfig.catalogCta} locale={locale} />
    </section>
  );
}
