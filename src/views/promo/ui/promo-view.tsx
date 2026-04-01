import { getPromoGames, getGameBySlug } from "@/entities/game";
import { PromoCard, PromoFeaturedCard } from "@/widgets/promo";
// import { Pagination } from "@/features/pagination";
// import { ROUTES } from "@/shared/router";

interface IPromoViewProps {
  locale: string;
  // Temporarily disabled pagination props
  // page?: number;
  // elements?: number;
  translations: {
    loadMore: string;
    back: string;
    next: string;
  };
}


export async function PromoView({
  locale,
  // Temporarily disabled pagination props
  // page = 1,
  // elements,
  translations,
}: IPromoViewProps) {
  const { items } = await getPromoGames({ locale });
  void translations;

  const featuredGame = items[0] ?? null;
  const restGames = items.slice(1);

  let featuredBannerImage: string | null = null;
  if (featuredGame) {
    const detail = await getGameBySlug(featuredGame.slug, locale);
    featuredBannerImage = detail?.bannerImage ?? null;
  }

  return (
    <section className="flex flex-col gap-10 pt-[40px] max-w-[1080px] mx-auto">
      <h1 className="text-3xl font-bold text-text-primary">
        Best Free Online Games 2026
      </h1>

      <div className="flex flex-col gap-3">
        {featuredGame && featuredBannerImage ? (
          <PromoFeaturedCard game={featuredGame} bannerImage={featuredBannerImage} locale={locale} />
        ) : featuredGame ? (
          <PromoCard game={featuredGame} locale={locale} />
        ) : null}

        {restGames.map((game) => (
          <PromoCard key={game.id} game={game} locale={locale} />
        ))}
      </div>

      {/* Pagination (temporarily disabled) */}
      {/* {(pagination.totalPages > 1 || items.length < pagination.totalItems) && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          locale={locale}
          basePath={ROUTES.PROMO}
          currentElements={elements}
          elementsStep={elements}
          totalItems={pagination.totalItems}
          translations={translations}
        />
      )} */}
    </section>
  );
}
