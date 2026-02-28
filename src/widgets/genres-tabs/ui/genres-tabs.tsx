"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib";
import { GameCard } from "@/features/game-card";
import type { ICategoryCard } from "@/entities/category";
import { getGames, type IGameBase } from "@/entities/game";
import { ROUTES } from "@/shared/router";

interface IGenresTabsProps {
  categories: ICategoryCard[];
  gamesByCategory?: Record<string, IGameBase[]>;
  allGames?: IGameBase[];
  locale: string;
  title?: string;
  subtitle?: string;
  translations?: {
    seeAll: string;
    all: string;
    download: string;
    browser: string;
    freeToPlay: string;
  };
}

const GAMES_LIMIT = 5;

export function GenresTabs({
  categories,
  locale,
  title = "Genres",
  translations,
}: IGenresTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeGames, setActiveGames] = useState<IGameBase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const gamesContainerRef = useRef<HTMLDivElement>(null);

  // Load games when activeTab changes
  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        const result = await getGames({
          locale,
          elements: GAMES_LIMIT,
          ...(activeTab !== "all" && { category: activeTab }),
        });
        setActiveGames(result.items);
      } catch (error) {
        console.error("Failed to load games:", error);
        setActiveGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [activeTab, locale]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-text-primary">{title}</h2>
          <ChevronRight className="h-6 w-6 text-text-primary" />
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ALL tab */}
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex-shrink-0 rounded-full px-5 py-2 text-sm font-black uppercase tracking-wide transition-colors",
            activeTab === "all"
              ? "bg-white text-bg-text-block"
              : "bg-bg-options text-text-primary hover:bg-bg-card-hover hover:text-text-primary"
          )}
        >
          {translations?.all || "All"}
        </button>
        {/* Category tabs */}
        {categories?.map((category) => (
          <button
            key={category.slug}
            onClick={() => setActiveTab(category.slug)}
            className={cn(
              "flex-shrink-0 rounded-full px-5 py-2 text-sm font-black uppercase tracking-wide transition-colors",
              activeTab === category.slug
                ? "bg-white text-bg-text-block"
                : "bg-bg-options text-text-primary hover:bg-bg-card-hover hover:text-text-primary"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Games Horizontal Scroll */}
      <div className="relative w-full">
        <div
          ref={gamesContainerRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 min-w-max">
            {isLoading ? (
              // Loading state
              Array.from({ length: GAMES_LIMIT }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="min-w-[200px] sm:min-w-[220px] lg:min-w-[240px] xl:min-w-[251px] shrink-0"
                >
                  <div className="bg-bg-card rounded-lg h-[427px] animate-pulse" />
                </div>
              ))
            ) : activeGames.length > 0 ? (
              // Games list
              activeGames.map((game) => (
                <div
                  key={game.id}
                  className="min-w-[200px] sm:min-w-[220px] lg:min-w-[240px] xl:min-w-[251px] shrink-0"
                >
                  <GameCard game={game} locale={locale} variant="grid" translations={translations} />
                </div>
              ))
            ) : (
              // Empty state
              <div className="text-text-secondary py-8">No games found</div>
            )}
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div className="flex justify-end">
        <Link
          href={
            activeTab === "all"
              ? `/${locale}${ROUTES.CATALOG}`
              : `/${locale}${ROUTES.CATEGORY}/${activeTab}`
          }
          className="uppercase inline-flex items-center gap-1 text-[12px] font-black text-button hover:text-button/80 transition-colors"
        >
          {translations?.seeAll || "VIEW ALL"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
