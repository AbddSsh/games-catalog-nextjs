"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { cn, localePath } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";
import type { IGameBase } from "@/entities/game";
import { ROUTES } from "@/shared/router";

export type TGameCardVariant = "grid" | "list";

interface IGameCardProps {
  game: IGameBase;
  locale: string;
  variant?: TGameCardVariant;
  className?: string;
  translations?: {
    download: string;
    browser: string;
    freeToPlay: string;
  };
}

function GameCardImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => setIsLoading(false);

  return (
    <>
      {isLoading && (
        <Skeleton className="absolute inset-0 flex items-center justify-center bg-muted z-[1]">
          <Loader className="animate-spin size-6 text-muted-foreground" />
        </Skeleton>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        quality={100}
        sizes={sizes}
        className={cn(className, "transition-[transform,opacity] duration-300", isLoading ? "opacity-0" : "opacity-100")}
        onLoad={handleImageLoad}
      />
    </>
  );
}

function GameCardGrid({ game, locale, className }: Omit<IGameCardProps, "variant">) {
  const gameUrl = localePath(locale, `${ROUTES.GAME}/${game.slug}`);
  const tags = game.tags ?? [];

  return (
    <Link
      href={gameUrl}
      className={cn(
        "group flex flex-col overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      {/* Image with badges — только tags */}
      <div className="relative aspect-[1/1.45] flex-shrink-0 overflow-hidden rounded-[16px]">
        <GameCardImage
          src={game.cardImage || "/images/placeholder-game.jpg"}
          alt={game.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="300px"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px] bg-gradient-to-t from-black/65 to-transparent"
          aria-hidden
        />
        {tags.length > 0 && (
          <div className="absolute right-2 top-2 flex flex-col gap-1 items-end">
            {tags.map((tag, idx) => {
              const isObj = typeof tag === "object" && tag !== null && "name" in tag;
              const name = isObj ? (tag as { name: string }).name : String(tag);
              const color = isObj && (tag as { color?: string }).color ? (tag as { color: string }).color : undefined;
              const key = isObj ? (tag as { slug: string }).slug : `t-${idx}`;
              return (
                <span
                  key={key}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium text-white w-fit",
                    !color && "bg-bg-text-block"
                  )}
                  style={color ? { backgroundColor: color } : undefined}
                >
                  {name}
                </span>
              );
            })}
          </div>
        )}
        <span
          className="absolute w-[80%] bottom-16 left-1/2 -translate-x-1/2 opacity-0 translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
        >
          <span className="inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-base font-semibold text-white bg-gradient-button transition-transform duration-200 hover:scale-105 hover:brightness-110">
            View Game
          </span>
        </span>
      </div>

      {/* Content */}
      <div className="w-fit min-w-0 pt-3 truncate">
        {/* Title */}
        <h3 className="truncate text-base font-bold text-text-primary group-hover:text-text-primary transition-colors">
          {game.name}
        </h3>
        {/* Genres */}
        <p className="truncate text-sm font-bold text-text-secondary">
          {(game.genres ?? []).map((g) => (typeof g === "string" ? g : g.name)).join(", ")}
        </p>
      </div>
    </Link>
  );
}

function GameCardList({ game, locale, className }: Omit<IGameCardProps, "variant">) {
  const gameUrl = localePath(locale, `${ROUTES.GAME}/${game.slug}`);
  const tags = game.tags ?? [];
  const genres = game.genres ?? [];

  return (
    <Link
      href={gameUrl}
      className={cn(
        "group flex gap-10 overflow-hidden rounded-[16px] transition-all hover:bg-bg-card-hover",
        className
      )}
    >
      {/* Image - aspect ratio 1:1.5 */}
      <div className="relative w-44 aspect-[1/1.44] flex-shrink-0 overflow-hidden rounded-[12px]">
        <GameCardImage
          src={game.cardImage || "/images/placeholder-game.jpg"}
          alt={game.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px] bg-gradient-to-t from-black/65 to-transparent"
          aria-hidden
        />
        <span
          className="absolute w-[80%] bottom-12 left-1/2 -translate-x-1/2 opacity-0 translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
        >
          <span className="inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-base font-semibold text-white bg-gradient-button transition-transform duration-200 hover:scale-105 hover:brightness-110">
            View Game
          </span>
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center space-y-4">
        {/* Title */}
        <h3 className="line-clamp-1 leading-none text-[26px] font-bold text-text-primary group-hover:text-text-primary transition-colors">
          {game.name}
        </h3>

        {/* Только tags + genres */}
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 && (
            <>
              {tags.map((tag, idx) => {
                const isObj = typeof tag === "object" && tag !== null && "name" in tag;
                const name = isObj ? (tag as { name: string }).name : String(tag);
                const color = isObj && (tag as { color?: string }).color ? (tag as { color: string }).color : undefined;
                const key = isObj ? (tag as { slug: string }).slug : `t-${idx}`;
                return (
                  <span
                    key={key}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium text-white w-fit",
                      !color && "bg-bg-text-block"
                    )}
                    style={color ? { backgroundColor: color } : undefined}
                  >
                    {name}
                  </span>
                );
              })}
            </>
          )}
          {genres.length > 0 && (
            <div className="flex flex-nowrap gap-2 ml-3">
              {genres.map((genre, index) => (
                <span
                  key={typeof genre === "string" ? genre : genre.slug}
                  className="text-[#A869E4] font-bold text-sm"
                >
                  {typeof genre === "string" ? genre : genre.name}
                  {index < genres.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-6 text-sm text-text-secondary">
          {game.shortDescription}
        </p>
      </div>
    </Link>
  );
}

/**
 * Main GameCard component
 */
export function GameCard({
  game,
  locale,
  variant = "grid",
  className,
  translations,
}: IGameCardProps) {
  if (variant === "list") {
    return <GameCardList game={game} locale={locale} className={className} translations={translations} />;
  }

  return <GameCardGrid game={game} locale={locale} className={className} translations={translations} />;
}
