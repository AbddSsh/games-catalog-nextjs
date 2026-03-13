import Link from "next/link";
import { getCategories } from "@/entities/category";
import { getGames } from "@/entities/game";
import { ROUTES, getCategoryRoute, getGameRoute } from "@/shared/router";
import { localePath } from "@/shared/lib";

const SITEMAP_GAMES_LIMIT = 500;

interface ISitemapPageProps {
  locale: string;
}

export async function SitemapPage({ locale }: ISitemapPageProps) {
  const [categories, gamesResponse] = await Promise.all([
    getCategories(locale),
    getGames({ locale, elements: SITEMAP_GAMES_LIMIT }),
  ]);

  const games = gamesResponse?.items ?? [];

  return (
    <section className="flex flex-col gap-8 pt-[40px]">
      <h1 className="text-2xl font-semibold uppercase text-text-primary">
        Sitemap
      </h1>

      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-xl font-medium uppercase text-text-primary">
          Main sections
        </h2>
        <Link
          className="w-fit font-medium text-accent-purple hover:underline"
          href={localePath(locale, ROUTES.HOME)}
        >
          Home
        </Link>
        <Link
          className="w-fit font-medium text-accent-purple hover:underline"
          href={localePath(locale, ROUTES.CATALOG)}
        >
          Game catalog
        </Link>
        <Link
          className="w-fit font-medium text-accent-purple hover:underline"
          href={localePath(locale, ROUTES.PRIVACY)}
        >
          Privacy Policy
        </Link>
        <Link
          className="w-fit font-medium text-accent-purple hover:underline"
          href={localePath(locale, ROUTES.SITEMAP)}
        >
          Sitemap
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-col gap-2 text-sm">
          <h2 className="text-xl font-medium uppercase text-text-primary">
            Genres
          </h2>
          <ul className="flex flex-col gap-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  className="w-fit font-medium text-accent-purple hover:underline"
                  href={localePath(locale, getCategoryRoute(cat.slug))}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {games.length > 0 && (
        <div className="flex flex-col gap-2 text-sm">
          <h2 className="text-xl font-medium uppercase text-text-primary">
            Games
          </h2>
          <ul className="flex flex-col gap-1">
            {games.map((game) => (
              <li key={game.id}>
                <Link
                  className="w-fit font-medium text-accent-purple hover:underline"
                  href={localePath(locale, getGameRoute(game.slug))}
                >
                  {game.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
