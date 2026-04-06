import { getPromoGames, getGameBySlug } from "@/entities/game";
import { notFound } from "next/navigation";
import { PromoCard, PromoFeaturedCard } from "@/widgets/promo";
import { CatalogCta } from "@/widgets/catalog-cta";
import { getHomePage } from "@/entities/page";

interface IPromoOptionViewProps {
  locale: string;
  option: string;
  translations: {
    loadMore: string;
    back: string;
    next: string;
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
  translations,
}: IPromoOptionViewProps) {
  let items: Awaited<ReturnType<typeof getPromoGames>>["items"] = [];

  try {
    const response = await getPromoGames({ locale, option });
    items = response.items;
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
  void translations;

  const featuredGame = items[0] ?? null;
  const restGames = items.slice(1);

  const pageConfig = await getHomePage(locale);

  return (
    <section className="flex flex-col gap-10 pt-[40px] max-w-[1080px] mx-auto">
      <h1 className="text-3xl font-bold text-text-primary">
        Best Free Online {optionTitle} Games 2026
      </h1>

      <div className="flex flex-col gap-3">
        {featuredGame && featuredGame.bannerImage ? (
          <PromoFeaturedCard game={featuredGame} bannerImage={featuredGame.bannerImage} locale={locale} />
        ) : featuredGame ? (
          <PromoCard game={featuredGame} locale={locale} />
        ) : null}

        {restGames.map((game) => (
          <PromoCard key={game.id} game={game} locale={locale} />
        ))}
      </div>
      {/* Catalog CTA */}
      <CatalogCta data={pageConfig.catalogCta} locale={locale} />
    </section>
  );
}
