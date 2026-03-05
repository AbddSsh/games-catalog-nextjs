"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { IGameBase } from "@/entities/game";
import { localePath } from "@/shared/lib";

const TRANSITION_DURATION = 500;
const SLIDE_GAP = 12;

interface IHeroCarouselProps {
  games: IGameBase[];
  locale: string;
  label?: string;
  autoPlayInterval?: number;
  translations?: {
    moreDetails?: string;
  };
}

export function HeroCarousel({
  games,
  locale,
  label = "Today's Best Pick",
  autoPlayInterval = 4000,
  translations,
}: IHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  }, [games.length]);

  useEffect(() => {
    if (games.length <= 1) return;

    autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    return () => stopAutoPlay();
  }, [games.length, goToNext, autoPlayInterval, stopAutoPlay]);

  if (games.length === 0) return null;

  const trackOffset = -(currentIndex * 100);

  return (
    <section className="relative overflow-hidden rounded-[20px]">
      {/* Slide Track */}
      <div
        className="flex"
        style={{
          gap: `${SLIDE_GAP}px`,
          transform: `translateX(calc(${trackOffset}% - ${currentIndex * SLIDE_GAP}px))`,
          transition: `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        }}
      >
        {games.map((game, index) => (
          <div key={game.slug ?? index} className="w-full flex-shrink-0 relative rounded-[20px] overflow-hidden h-[26vw]">
            <Link
              href={localePath(locale, `/game/${game.slug}`)}
              className="absolute inset-0 z-10 block"
            >
              <span className="sr-only">{game.name}</span>
            </Link>
            <Image
              src={game.bannerImage || "/images/placeholder-hero.jpg"}
              alt={game.name}
              priority={index === 0}
              fill
              quality={100}
              className="object-cover"
            />
            <div className="absolute inset-0 -bottom-10 bg-gradient-to-t from-bg-main/95 via-bg-main/70 to-transparent pointer-events-none" />

            {/* Per-slide content */}
            <div className="absolute left-10 bottom-10 flex items-center z-20 pointer-events-none">
              <div className="max-w-xl grid grid-rows-[1fr_auto] gap-5">
                <div>
                  <h2 className="text-sm font-bold text-text-primary line-clamp-3">
                    {game.shortDescription}
                  </h2>
                </div>
                <span className="pointer-events-auto w-fit">
                  <Link href={localePath(locale, `/game/${game.slug}`)}>
                    <Button
                      size="lg"
                      className="rounded-full text-base bg-button hover:bg-button/90 text-white font-bold px-8"
                    >
                      {translations?.moreDetails || "MORE DETAILS"}
                    </Button>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ribbon Badge */}
      <div className="absolute right-0 top-0 overflow-hidden h-32 w-32">
        <div className="absolute right-[-35px] top-[32px] w-[170px] rotate-45 bg-accent-purple py-2 text-center shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {label}
          </span>
        </div>
      </div>

      {/* Navigation Dots */}
      {games.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30" role="group" aria-label="Carousel navigation">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-3 w-3 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
