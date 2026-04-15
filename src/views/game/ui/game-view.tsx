"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/ui";
import { cn, localePath, buildFilterParam, appendSearchParamsToUrl } from "@/shared/lib";
import { getYoutubeEmbedUrl } from "@/shared/lib/video.util";
import { useTrackingParams } from "@/shared/hooks";
import type { IGameDetail } from "@/entities/game";
import gameCatalogIcon from "@/shared/icons/game-catalog-icon.png";
import { ROUTES } from "@/shared/router";
import { GameContentTabs } from "@/widgets/game-content-tabs";
import { FactsSidebar } from "@/widgets/facts-sidebar";

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
  const trackingParams = useTrackingParams();
  const trackingLinkWithParams = useMemo(
    () => appendSearchParamsToUrl(game.trackingLink, trackingParams),
    [game.trackingLink, trackingParams]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (carouselApi == null) return;
    carouselApi.scrollTo(selectedImage, true);
  }, [carouselApi, selectedImage]);

  const allMedia = [...game.screenshots];

  const buildCatalogUrl = () => {
    const params = new URLSearchParams();
    if (game.genres?.length) params.set("genres", buildFilterParam(game.genres.map((g) => g.slug)));
    if (game.settings?.length) params.set("settings", buildFilterParam(game.settings.map((s) => s.slug)));
    if (game.platforms?.length) params.set("platforms", buildFilterParam(game.platforms.map((p) => p.slug)));
    if (game.features?.length) params.set("features", buildFilterParam(game.features.map((f) => f.slug)));
    const qs = params.toString();
    return `${localePath(locale, ROUTES.CATALOG)}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6 mx-auto max-w-[1080px]">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden" style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
        <div className="relative w-full">
          <Image
            src={game.bannerImage || "/images/placeholder-game.jpg"}
            alt={game.name}
            width={1920}
            height={600}
            quality={100}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/70 to-bg-main/40" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end">
          <Link
            href={trackingLinkWithParams}
            target="_blank"
            className="absolute inset-0 z-0"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-[30px]">
                  <h1 className="text-4xl font-bold text-text-primary md:text-5xl">
                    {game.name}
                  </h1>
                  {game.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5">
                      {game.tags.map((tag) => (
                        <span
                          key={tag.slug}
                          className={cn(
                            "rounded-[4px] px-2 py-1 text-xs font-normal text-white",
                            !tag.color && "bg-bg-text-block"
                          )}
                          style={tag.color ? { backgroundColor: tag.color } : undefined}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {game.genres?.length > 0 && (
                  <p className="ml-1 mt-4 text-sm font-normal text-text-primary">
                    {game.genres.map((g) => g.name).join(", ")}
                  </p>
                )}
              </div>

              <Link href={trackingLinkWithParams} target="_blank">
                <Button
                  size="lg"
                  className="h-[58px] gap-4 rounded-full bg-button px-10 py-3 text-[28px] font-bold text-white hover:bg-button/90"
                >
                  <Image src={gameCatalogIcon} alt="game catalog" width={40} quality={100} className="size-10 h-auto object-contain" />
                  {translations.playNow.toUpperCase()}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Media Gallery + Similar Games ── */}
      <div className="space-y-6">
        <div className="grid gap-11 lg:grid-cols-[1fr_0.3fr]">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-text-primary">
              {game.title}
            </h2>

            {/* Main media viewer */}
            <div className="relative aspect-video overflow-hidden rounded-[14px]">
              {selectedImage === 0 && game.videoUrl && isVideoPlaying ? (
                <iframe
                  src={getYoutubeEmbedUrl(game.videoUrl)}
                  className="absolute inset-0 h-full w-full"
                  title={game.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={allMedia[selectedImage] || "/images/placeholder-game.jpg"}
                  alt={game.name}
                  fill
                  quality={100}
                  className="object-cover"
                />
              )}
              {selectedImage === 0 && game.videoUrl && !isVideoPlaying && (
                <button
                  type="button"
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
                >
                  <div className="flex size-[150px] items-center justify-center rounded-full bg-black/70 transition-colors hover:bg-black/90">
                    <Play className="size-[60px] fill-current text-white" />
                  </div>
                </button>
              )}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((p) => (p - 1 + allMedia.length) % allMedia.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-black transition-colors hover:bg-white/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-7" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((p) => (p + 1) % allMedia.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-black transition-colors hover:bg-white/70"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-7" />
                  </button>
                </>
              )}
            </div>

            {/* CTA under video */}
            {/* <div className="relative z-10 -mt-5">
              <Link
                href={trackingLinkWithParams}
                target="_blank"
                className="mx-auto block h-[44px] w-fit"
              >
                <Button className="h-full w-full rounded-full bg-button px-[80px] py-3 text-base font-bold uppercase text-white hover:bg-button/90">
                  {game.ctaText}
                </Button>
              </Link>
            </div> */}

            {/* Thumbnail strip */}
            {allMedia.length > 1 && (
              <div className="mt-12">
                <Carousel opts={{ align: "start" }} setApi={setCarouselApi} className="w-full">
                  <CarouselContent className="-ml-2">
                    {allMedia.map((src, index) => (
                      <CarouselItem key={index} className="basis-1/4 pl-2 sm:basis-1/5 lg:basis-1/6">
                        <button
                          onClick={() => setSelectedImage(index)}
                          className={cn(
                            "relative aspect-video w-full overflow-hidden rounded-[13px] transition-all",
                            selectedImage === index ? "" : "opacity-30 hover:opacity-100"
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

          {/* Similar games sidebar */}
          {game?.relatedGames?.length > 0 && (
            <section>
              <Link href={buildCatalogUrl()} className="mb-4 flex items-center justify-start gap-3">
                <h2 className="text-2xl font-bold text-text-primary">
                  {translations.similarGames}
                </h2>
                <ChevronRight className="size-6 text-text-primary" />
              </Link>
              <div className="space-y-4">
                {game.relatedGames.slice(0, 3).map((rg) => (
                  <Link
                    key={rg.slug}
                    href={localePath(locale, `${ROUTES.GAME}/${rg.slug}`)}
                    className="group block transition-colors hover:opacity-90"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image src={rg.bannerImage} alt={rg.name} fill quality={100} className="object-cover" />
                    </div>
                    <div className="mt-2">
                      <h3 className="line-clamp-1 text-sm font-bold text-text-primary group-hover:text-accent-purple">
                        {rg.name}
                      </h3>
                      {(rg.tags?.length > 0 || rg.genres?.length > 0) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {rg.tags?.map((tag) => (
                            <span
                              key={tag.slug}
                              className="rounded-[4px] px-2 py-0.5 text-xs font-medium text-white"
                              style={tag.color ? { backgroundColor: tag.color } : undefined}
                            >
                              {tag.name}
                            </span>
                          ))}
                          {rg.genres?.map((g) => (
                            <span
                              key={g.slug}
                              className="rounded-[4px] bg-bg-light px-2 py-0.5 text-xs font-medium text-white"
                            >
                              {g.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Tabs + Content + Facts ── */}
        <div className="grid gap-2.5 lg:grid-cols-[1fr_0.3fr]">
          <GameContentTabs
            gameOverview={game.gameOverview}
            specialFeatures={game.specialFeatures}
            trackingCtaUrl={trackingLinkWithParams}
            translations={{
              overview: translations.overview,
              specialFeatures: translations.specialFeatures,
            }}
          />
          <FactsSidebar facts={game.facts} title={translations.facts} />
        </div>
      </div>
    </div>
  );
}
