"use client";

import { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Breadcrumbs, type IBreadcrumbItem } from "@/shared/ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { IGameDetail } from "@/entities/game";
import gameCatalogIcon from "@/shared/icons/game-catalog-icon.png";
import { ROUTES } from "@/shared/router";

interface IGameViewProps {
  game: IGameDetail;
  locale: string;
  translations: {
    overview: string;
    specialFeatures: string;
    facts: string;
    similarGames: string;
    playNow: string;
    download: string;
    freeToPlay: string;
    browser: string;
    home: string;
    games: string;
  };
}

export function GameView({ game, locale, translations }: IGameViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "features">("overview");
  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  // Автоскролл ленты миниатюр к активному слайду, если он вне зоны видимости
  useEffect(() => {
    if (carouselApi == null) return;
    carouselApi.scrollTo(selectedImage, true);
  }, [carouselApi, selectedImage]);

  // All media (video thumbnail + screenshots)
  const allMedia = [
    // game.videoUrl,
    ...game.screenshots,
  ];

  // Build catalog URL with filters from game data
  const buildCatalogUrl = () => {
    const params = new URLSearchParams();
    if (game.genres?.length) params.set("genres", game.genres.join(","));
    if (game.settings?.length) params.set("settings", game.settings.join(","));
    if (game.platforms?.length) params.set("platforms", game.platforms.join(","));
    if (game.features?.length) params.set("features", game.features.join(","));
    const queryString = params.toString();
    return `/${locale}${ROUTES.CATALOG}${queryString ? `?${queryString}` : ""}`;
  };

  // Breadcrumbs - need translations passed from parent
  const breadcrumbs: IBreadcrumbItem[] = [
    { label: translations.home, href: `/${locale}` },
    { label: translations.games, href: `/${locale}${ROUTES.CATALOG}` },
    ...(game.genres[0]
      ? [{ label: game.genres[0], href: `/${locale}${ROUTES.CATEGORY}/${game.genres[0].toLowerCase()}` }]
      : []),
    { label: game.name },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner - Full Width of screen */}
      <section className="relative overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        {/* Background Image */}
        <div className="relative w-full">
          <Image
            src={game.bannerImage || "/images/placeholder-game.jpg"}
            alt={game.name}
            width={1920}
            height={600}
            quality={100}
            className="w-full h-auto object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/70 to-bg-main/40" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-[1400px] mx-auto w-full px-4 pb-8">
            {/* Breadcrumbs */}
            {/* <Breadcrumbs items={breadcrumbs} className="mb-4 text-text-secondary" /> */}

            {/* Game Info Row */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-[30px]">
                  {/* Title */}
                  <h1 className="text-4xl font-bold text-text-primary md:text-5xl">
                    {game.name}
                  </h1>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-[4px] bg-option-blue px-2 py-1 text-xs font-normal text-white">
                      {game.ctaType === "play" ? translations.browser : translations.download}
                    </span>
                    {game.tags.slice(0, 2).map((tag) => {
                      const isFreeTag = tag.toLowerCase() === "free" || tag.toLowerCase() === "zadarmo";
                      return (
                        <span
                          key={tag}
                          className="rounded-[4px] bg-option-green px-2 py-1 text-xs font-normal text-white"
                        >
                          {isFreeTag ? translations.freeToPlay : tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* Genres */}
                <p className="mt-4 text-sm font-normal text-text-primary">
                  {game.genres.join(", ")}
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href={game.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-button hover:bg-button/90 text-white font-bold text-[28px] px-10 py-3 gap-4 rounded-full h-[58px]"
                >
                  <Image src={gameCatalogIcon} alt="game catalog" width={40} quality={100} className="size-10 object-contain h-auto" />
                  {translations.playNow.toUpperCase()}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6">
      {/* Main Content */}
        <div className="grid gap-11 lg:grid-cols-[1fr_0.3fr]">
          {/* Left Column */}
            {/* About Section */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-text-primary">
                {translations.overview}
              </h2>

              {/* Main Media with Video Play Button */}
              <div className="relative aspect-video overflow-hidden rounded-[14px]">
                <Image
                  src={allMedia[selectedImage] || "/images/placeholder-game.jpg"}
                  alt={game.name}
                  fill
                  quality={100}
                  className="object-cover"
                />
                {/* Video play button (only on first slide if video exists) */}
                {selectedImage === 0 && game.videoUrl && (
                  <Link
                    href={game.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
                  >
                    <div className="flex size-[150px] items-center justify-center rounded-full bg-black/70 hover:bg-black/90 transition-colors">
                      <Play className="size-[60px] text-white fill-current" />
                    </div>
                  </Link>
                )}
                {/* Navigation arrows on image */}
                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev - 1 + allMedia.length) % allMedia.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-black hover:bg-white/70 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-7" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev + 1) % allMedia.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-black hover:bg-white/70 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="size-7" />
                    </button>
                  </>
                )}
              </div>

              {/* CTA Button under video */}
              <div className="relative z-10 -mt-5">
                <Link
                  href={game.trackingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-fit mx-auto h-[44px]"
                >
                  <Button className="rounded-full h-full w-full text-base bg-button hover:bg-button/90 text-white font-bold py-3 px-[80px] uppercase">
                    {game.ctaText}
                  </Button>
                </Link>
              </div>

              {/* Screenshots Gallery */}
              {allMedia.length > 1 && (
                <div className="mt-6">
                  <Carousel opts={{ align: "start" }} setApi={setCarouselApi} className="w-full">
                    <CarouselContent className="-ml-2">
                      {allMedia.map((src, index) => (
                        <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5 lg:basis-1/6">
                          <button
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                              "relative aspect-video w-full overflow-hidden rounded-[13px] transition-all",
                              selectedImage === index
                                ? ""
                                : "opacity-30 hover:opacity-100"
                            )}
                          >
                            <Image
                              src={src}
                              alt={`${game.name} screenshot ${index + 1}`}
                              fill
                              quality={100}
                              className="object-cover"
                            />
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}
            </section>
          {/* Right Sidebar */}
            {/* Similar Games */}
            {game?.relatedGames?.length > 0 && (
            <section>
              <Link href={buildCatalogUrl()} className="mb-4 flex items-center justify-start gap-3">
                <h2 className="text-2xl font-bold text-text-primary">
                  {translations.similarGames}
                </h2>
                <ChevronRight className="size-6 text-text-primary" />
              </Link>
              <div className="space-y-4">
                {game.relatedGames.slice(0, 3).map((relatedGame) => (
                  <Link
                    key={relatedGame.slug}
                    href={`/${locale}${ROUTES.GAME}/${relatedGame.slug}`}
                    className="group block overflow-hidden rounded-[9px] transition-colors hover:opacity-90"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={relatedGame?.bannerImage}
                        alt={relatedGame.name}
                        fill
                        quality={100}
                        className="object-cover"
                      />
                      {/* Free badge */}
                      <span className="absolute left-2 top-2 rounded-full bg-option-green px-2 py-0.5 text-xs font-medium text-white">
                        {translations.freeToPlay}
                      </span>
                    </div>
                    {/* Card Info */}
                    <div className="mt-2">
                      <h3 className="font-bold text-sm text-text-primary group-hover:text-accent-purple line-clamp-1">
                        {relatedGame.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-[4px] bg-option-blue px-2 py-0.5 text-xs font-medium text-white">
                          {translations.browser}
                        </span>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              </section>
            )}
        </div>
                {/* Tab Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={cn(
                      "rounded-full px-5 py-2 text-xs font-black uppercase tracking-wide transition-colors",
                      activeTab === "overview"
                        ? "bg-[#E4E4E4] text-black"
                        : "bg-bg-text-block text-text-primary"
                    )}
                  >
                    {translations.overview}
                  </button>
                  <button
                    onClick={() => setActiveTab("features")}
                    className={cn(
                      "rounded-full px-5 py-2 text-xs font-black uppercase tracking-wide transition-colors",
                      activeTab === "features"
                        ? "bg-[#E4E4E4] text-black"
                        : "bg-bg-text-block text-text-primary"
                    )}
                  >
                    {translations.specialFeatures}
                  </button>
                </div>
        <div className="grid gap-11 lg:grid-cols-[1fr_0.3fr]">
          {/* Content Tabs */}
          <div className="space-y-5">
            {/* Tab Content */}
            <section className="rounded-[13px] bg-bg-text-block px-5 py-6">
                <div className="space-y-6">
                  {activeTab === "overview" && game.gameOverview.map((section, index) => (
                    <div key={index}>
                      {section.title && (
                        <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-text-primary">
                          {section.title}
                        </h3>
                      )}
                      <p
                        className="text-text-primary text-sm font-normal"
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    </div>
                  ))}
                  {activeTab === "features" && game.specialFeatures.map((section, index) => (
                    <div key={index}>
                      {section.title && (
                        <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-text-primary">
                          {section.title}
                        </h3>
                      )}
                      <p
                        className="text-text-primary text-sm font-normal"
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    </div>
                  ))}
                </div>
            </section>
              {/* Bottom CTA */}
              <Link
                href={game.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-11 w-fit"
              >
                <Button className="h-full w-full text-base font-bold rounded-full bg-button hover:bg-button/90 text-white py-3 px-[80px] uppercase">
                  {game.ctaText}
                </Button>
              </Link>
          </div>
          {/* Facts */}
          <section className="rounded-[13px] bg-bg-text-block px-5 py-6 h-fit">
            <h2 className="mb-3 text-lg font-black text-text-primary">
              {translations.facts}
            </h2>
            <dl className="grid grid-cols-[minmax(auto,0.5fr)_1fr] gap-x-4 gap-y-3">
              {game.facts.map((fact, index) => (
                <Fragment key={index}>
                  <dt className="max-w-fit whitespace-normal text-text-primary text-xs font-normal">{fact.title}:</dt>
                  <dd className="text-start text-text-primary text-xs font-black">
                    {fact.text}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
