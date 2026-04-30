import { getPromoGames } from "@/entities/game";
import { notFound } from "next/navigation";
import { PromoCard, PromoFeaturedCard } from "@/widgets/promo";
import { CatalogCta } from "@/widgets/catalog-cta";
import { getHomePage } from "@/entities/page";
import { Pagination } from "@/features/pagination";
import { ROUTES } from "@/shared/router";

interface IPromoOptionViewProps {
  locale: string;
  option: string;
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

function formatOptionTitle(option: string): string {
  return option
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function PromoOptionView({
  locale,
  option,
  page,
  elements,
  translations,
}: IPromoOptionViewProps) {
  let items: Awaited<ReturnType<typeof getPromoGames>>["items"] = [];
  let pagination: Awaited<ReturnType<typeof getPromoGames>>["pagination"] | null = null;

  try {
    const response = await getPromoGames({ locale, option, page, elements });
    items = response.items;
    pagination = response.pagination;
  } catch (error) {
    const status = error instanceof Error
      ? Number(error.message.match(/API Error\s+(\d+)/)?.[1])
      : NaN;

    if (status === 404) {
      notFound();
    }

    throw error;
  }

  const optionTitle = formatOptionTitle(option);
  const promoTranslations = translations.promo;

  const featuredGame = items[0] ?? null;
  const restGames = items.slice(1);

  const pageConfig = await getHomePage(locale);

  return (
    <section className="flex flex-col gap-10 pt-[40px] max-w-[1080px] mx-auto">
      <h1 className="text-3xl font-bold text-text-primary">
        {promoTranslations.title.first} {optionTitle} {promoTranslations.title.second}
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

      {pagination && (pagination.totalPages > 1 || pagination.elements < pagination.totalItems) && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          locale={locale}
          basePath={`${ROUTES.PROMO}/${option}`}
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
