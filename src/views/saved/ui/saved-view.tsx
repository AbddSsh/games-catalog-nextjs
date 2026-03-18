"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/features/game-card";
import { getSavedGames, type IGameBase } from "@/entities/game";
import { getSavedGameSlugs } from "@/shared/lib/saved-games.util";

interface ISavedViewProps {
  locale: string;
}

export function SavedView({ locale }: ISavedViewProps) {
  const [games, setGames] = useState<IGameBase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = getSavedGameSlugs();

    if (!slugs.length) {
      setGames([]);
      setLoading(false);
      return;
    }

    getSavedGames(locale, slugs)
      .then((response) => {
        setGames(response.items);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [locale]);

  if (loading) {
    return (
      <section className="flex flex-col gap-4 pt-[40px]">
        <h1 className="text-2xl font-semibold uppercase text-text-primary">
          Favorite games
        </h1>
        <p className="text-sm text-text-secondary">Loading your favorite games...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 pt-[40px]">
      <h1 className="text-2xl font-semibold uppercase text-text-primary">
        Favorite games
      </h1>

      {games.length === 0 ? (
        <p className="text-sm text-text-secondary">
          You have no favorite games yet. Use the bookmark icon on any game card to save it.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} locale={locale} variant="grid" />
          ))}
        </div>
      )}
    </section>
  );
}

