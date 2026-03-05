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

function GameBadge({
  children,
  variant = "browser",
}: {
  children: React.ReactNode;
  variant?: "browser" | "download" | "free";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium text-white w-fit",
        variant === "browser" && "bg-option-blue",
        variant === "download" && "bg-accent-pink",
        variant === "free" && "bg-option-green"
      )}
    >
      {children}
    </span>
  );
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

function GameCardGrid({ game, locale, className, translations }: Omit<IGameCardProps, "variant">) {
  const gameUrl = localePath(locale, `${ROUTES.GAME}/${game.slug}`);
  const isDownload = game.ctaType !== "play";
  const platformBadge = isDownload ? translations?.download : translations?.browser;
  const hasFreeBadge = game.tags.some(
    (tag) => tag.toLowerCase() === "free" || tag.toLowerCase() === "zadarmo" || tag.toLowerCase() === "new"
  );
  const freeBadgeText = translations?.freeToPlay;

  return (
    <Link
      href={gameUrl}
      className={cn(
        "group flex flex-col overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      {/* Image with badges */}
      <div className="relative aspect-[1/1.45] flex-shrink-0 overflow-hidden rounded-[16px]">
        <GameCardImage
          src={game.cardImage || "/images/placeholder-game.jpg"}
          alt={game.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="300px"
        />
        {/* Badges in top-right corner */}
        <div className="absolute right-2 top-2 flex flex-col gap-1 items-end">
          {platformBadge && (
            <GameBadge variant={isDownload ? "download" : "browser"}>{platformBadge}</GameBadge>
          )}
          {hasFreeBadge && freeBadgeText && (
            <GameBadge variant="free">{freeBadgeText}</GameBadge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-fit min-w-0 pt-3 truncate">
        {/* Title */}
        <h3 className="truncate text-base font-bold text-text-primary group-hover:text-text-primary transition-colors">
          {game.name}
        </h3>
        {/* Genres */}
        <p className="truncate text-sm font-bold text-text-secondary">
          {game.genres.join(", ")}
        </p>
      </div>
    </Link>
  );
}

function GameCardList({ game, locale, className, translations }: Omit<IGameCardProps, "variant">) {
  const gameUrl = localePath(locale, `${ROUTES.GAME}/${game.slug}`);
  const isDownload = game.ctaType !== "play";
  const platformBadge = isDownload ? translations?.download : translations?.browser;
  const hasFreeBadge = game.tags.some(
    (tag) => tag.toLowerCase() === "free" || tag.toLowerCase() === "zadarmo" || tag.toLowerCase() === "new"
  );
  const freeBadgeText = translations?.freeToPlay;

  return (
    <Link
      href={gameUrl}
      className={cn(
        "group flex gap-10 overflow-hidden transition-all hover:bg-bg-card-hover",
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
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center space-y-4">
        {/* Title */}
        <h3 className="line-clamp-1 leading-none text-[26px] font-bold text-text-primary group-hover:text-text-primary transition-colors">
          {game.name}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {platformBadge && (
            <GameBadge variant={isDownload ? "download" : "browser"}>{platformBadge}</GameBadge>
          )}
          {hasFreeBadge && freeBadgeText && (
            <GameBadge variant="free">{freeBadgeText}</GameBadge>
          )}
          {/* Genre badges */}
          <div className="flex flex-nowrap gap-2 ml-3">
            {game.genres.map((genre, index) => (
              <span
                key={genre}
                className="text-[#A869E4] font-bold text-sm"
              >
                {genre}{index < game.genres.length - 1 && ", "}
              </span>
            ))}
          </div>
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
