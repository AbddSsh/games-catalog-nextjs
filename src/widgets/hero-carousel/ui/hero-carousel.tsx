"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { IGameBase } from "@/entities/game";

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
  autoPlayInterval = 5000,
  translations,
}: IHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  }, [games.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  }, [games.length]);

  // Auto-play
  useEffect(() => {
    if (games.length <= 1 || isDragging) return;

    autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [games.length, goToNext, autoPlayInterval, isDragging]);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum drag distance to trigger slide change

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  }, [isDragging, startX, currentX, goToNext, goToPrev]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum drag distance to trigger slide change

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  }, [isDragging, startX, currentX, goToNext, goToPrev]);

  if (games.length === 0) {
    return null;
  }

  const currentGame = games[currentIndex];

  return (
    <section 
      ref={carouselRef}
      className="relative overflow-hidden rounded-[20px] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <div className="relative w-full">
        <Image
          src={currentGame.image || "/images/placeholder-hero.jpg"}
          alt={currentGame.name}
          priority
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main/95 via-bg-main/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute left-10 bottom-10 flex items-center">
          <div className="max-w-xl grid grid-rows-[1fr_auto] gap-5">

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold text-text-primary line-clamp-3">
                {currentGame.shortDescription}
              </h2>
            </div>

            {/* CTA Button */}
              <Link href={`/${locale}/game/${currentGame.slug}`}>
                <Button
                  size="lg"
                  className="rounded-full text-base bg-button hover:bg-button/90 text-white font-bold px-8"
                >
                  {translations?.moreDetails || "MORE DETAILS"}
                </Button>
              </Link>
          </div>
      </div>

      {/* Ribbon Badge - "TODAY'S BEST PICK" */}
      <div className="absolute right-0 top-0 overflow-hidden h-32 w-32">
        <div className="absolute right-[-35px] top-[32px] w-[170px] rotate-45 bg-accent-purple py-2 text-center shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {label}
          </span>
        </div>
      </div>

      {/* Navigation Dots */}
      {games.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
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
