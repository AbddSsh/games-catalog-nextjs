import { getPromoGames, getGameBySlug } from "@/entities/game";
import { notFound } from "next/navigation";
import { PromoCard, PromoFeaturedCard } from "@/widgets/promo";

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

  let featuredBannerImage: string | null = null;
  if (featuredGame) {
    const detail = await getGameBySlug(featuredGame.slug, locale);
    featuredBannerImage = detail?.bannerImage ?? null;
  }

  return (
    <section className="flex flex-col gap-10 pt-[40px] max-w-[1080px] mx-auto">
      <h1 className="text-3xl font-bold text-text-primary">
        Best Free Online {optionTitle} Games 2026
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
    </section>
  );
}
