import Link from "next/link";
import Image from "next/image";
import type { IRelatedGame } from "@/entities/game";

interface ISimilarGamesProps {
  games: IRelatedGame[];
  locale: string;
  title?: string;
}

export function SimilarGames({
  games,
  locale,
  title = "Similar Games",
}: ISimilarGamesProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-lg border border-border-main bg-bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold text-text-primary">{title}</h3>
      <div className="space-y-3">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={`/${locale}/game/${game.slug}`}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-bg-card-hover"
          >
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={game?.bannerImage || "/images/placeholder.jpg"}
                alt={game.name}
                fill
                quality={100}
                className="object-cover"
              />
            </div>
            <span className="flex-1 text-sm font-medium text-text-secondary hover:text-text-primary truncate">
              {game.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
