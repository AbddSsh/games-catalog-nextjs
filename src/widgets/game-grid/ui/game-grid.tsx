import { GameCard, type TGameCardVariant } from "@/features/game-card";
import { cn } from "@/shared/lib";
import type { IGameBase } from "@/entities/game";

interface IGameGridProps {
  games: IGameBase[];
  locale: string;
  columns?: 2 | 3 | 4 | 5;
  viewMode?: TGameCardVariant;
  className?: string;
  translations?: {
    download: string;
    browser: string;
    freeToPlay: string;
    noGames?: string;
  };
}

const GRID_COLS = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

export function GameGrid({
  games,
  locale,
  columns = 4,
  viewMode = "grid",
  className,
  translations,
}: IGameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border-main bg-bg-card">
        <p className="text-text-muted">{translations?.noGames || "No games found"}</p>
      </div>
    );
  }

  // List view - single column
  if (viewMode === "list") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            locale={locale}
            variant="list"
            translations={translations}
          />
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className={cn("grid gap-4", GRID_COLS[columns], className)}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          locale={locale}
          variant="grid"
          translations={translations}
        />
      ))}
    </div>
  );
}
