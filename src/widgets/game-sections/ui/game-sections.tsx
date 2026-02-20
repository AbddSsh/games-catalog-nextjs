"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { GameCard } from "@/features/game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/shared/ui";
import type { IGameBase } from "@/entities/game";
import type { IGameSectionConfig } from "@/entities/page";

interface IGameSectionsProps {
  sections: Array<{
    config: IGameSectionConfig;
    games: IGameBase[];
  }>;
  locale: string;
  translations?: {
    download: string;
    browser: string;
    freeToPlay: string;
  };
}

export function GameSections({ sections, locale, translations }: IGameSectionsProps) {
  return (
    <div className="space-y-9">
      {sections.map((section) => (
        <GameSectionRow
          key={section.config.filter}
          config={section.config}
          games={section.games}
          locale={locale}
          translations={translations}
        />
      ))}
    </div>
  );
}

interface IGameSectionRowProps {
  config: IGameSectionConfig;
  games: IGameBase[];
  locale: string;
  translations?: {
    download: string;
    browser: string;
    freeToPlay: string;
  };
}

function GameSectionRow({ config, games, locale, translations }: IGameSectionRowProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselHeader config={config} locale={locale} />
        <CarouselContent className="-ml-4">
          {games.map((game) => (
            <CarouselItem
              key={game.id}
              className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <GameCard game={game} locale={locale} variant="grid" translations={translations} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function CarouselHeader({ config, locale }: { config: IGameSectionConfig, locale: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Link href={`/${locale}/catalog?features=${config.filter}`} className="text-3xl font-bold text-text-primary">{config.title}</Link>
        <ChevronRight className="h-6 w-6 text-text-primary" />
      </div>
      {/* Navigation arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="rounded-full bg-bg-card p-2 text-text-muted hover:bg-bg-card-hover hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Scroll carousel left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="rounded-full bg-accent-purple p-2 text-white hover:bg-accent-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Scroll carousel right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
