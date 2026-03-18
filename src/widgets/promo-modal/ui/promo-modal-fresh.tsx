"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib";
import { appendSearchParamsToUrl } from "@/shared/lib";
import { getPromoGameBySlug, type IGamePromoDetail } from "@/entities/game";
import { getYoutubeEmbedUrl } from "@/shared/lib/video.util";
import { useTrackingParams } from "@/shared/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  Dialog,
  DialogContent,
  DialogTitle,
  ScrollArea,
  useCarousel,
  type CarouselApi,
} from "@/shared/ui";
import Link from "next/link";

interface IPromoModalProps {
  slug: string;
  locale: string;
  open: boolean;
  onClose: () => void;
}

function PromoThumbnailsNav() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous thumbnails"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/40 p-2 text-black transition-colors hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next thumbnails"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/40 p-2 text-black transition-colors hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="size-6" />
      </button>
    </>
  );
}

export function PromoModal({ slug, locale, open, onClose }: IPromoModalProps) {
  const [game, setGame] = useState<IGamePromoDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const trackingParams = useTrackingParams();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setSelectedImage(0);

    getPromoGameBySlug(slug, locale)
      .then((data) => {
        if (!cancelled) setGame(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, locale, open]);

  const trackingLinkWithParams = useMemo(() => {
    if (!game?.trackingLink) return "";
    return appendSearchParamsToUrl(game.trackingLink, trackingParams);
  }, [game?.trackingLink, trackingParams]);

  // Автоскролл миниатюр к активному слайду (при навигации стрелками по большому слайдеру).
  useEffect(() => {
    if (carouselApi == null) return;
    const count = game?.screenshots?.length ?? 0;
    if (count <= 1) return;

    const slidesInView = (carouselApi as unknown as { slidesInView?: () => number[] }).slidesInView?.();

    if (slidesInView && slidesInView.length > 0) {
      if (slidesInView.includes(selectedImage)) return;

      const min = Math.min(...slidesInView);
      const max = Math.max(...slidesInView);

      if (selectedImage > max && carouselApi.canScrollNext()) carouselApi.scrollNext();
      else if (selectedImage < min && carouselApi.canScrollPrev()) carouselApi.scrollPrev();
    } else {
      carouselApi.scrollTo(selectedImage, true);
    }
  }, [carouselApi, selectedImage, game?.screenshots?.length]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        showClose={false}
        className="w-[calc(100vw-2rem)] max-w-5xl h-[85vh] overflow-hidden !rounded-[28px] border-[1px] border-[#4D3C5C]/70 bg-[linear-gradient(90deg,#200C33_0%,#0A172B_100%)] p-0 shadow-xl gap-0"
      >
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-start gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-[30px]">
                  <DialogTitle className="break-words text-[54px] font-bold leading-[1.05] text-white">
                    {game?.name ?? "Loading..."}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                  {game && game.platforms?.length > 0 &&
                        game.platforms.map((p) => (
                          <span
                            key={p.slug}
                            className="rounded-[4px] bg-option-blue px-2 py-1 text-xs font-normal text-white"
                          >
                            {p.name}
                          </span>
                  ))}
                  {game && game.tags?.length > 0 && game.tags.map((tag, idx) => {
                        const isObj = typeof tag === "object" && tag !== null && "name" in tag;
                        const name = isObj ? (tag as { name: string }).name : String(tag);
                        const color = isObj && (tag as { color?: string }).color ? (tag as { color: string }).color : undefined;
                        const key = isObj ? (tag as { slug: string }).slug : `tag-${idx}`;
                        return (
                          <span
                            key={key}
                            className={cn(
                              "rounded-[4px] px-2 py-1 text-xs font-normal text-white",
                              !color && "bg-bg-text-block"
                            )}
                            style={color ? { backgroundColor: color } : undefined}
                          >
                            {name}
                          </span>
                        );
                    })}
                  </div>
                </div>

                {game && (
                  <div className="mt-2">
                    {(game.genres?.length ?? 0) > 0 && (
                      <p className="text-sm font-normal text-text-primary">
                        {game.genres.map((g) => g.name).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

            <div className="min-h-0 overflow-auto space-y-8 p-8 pt-0">
              {/* Slider + shortDesc */}
              <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-[14px] bg-bg-text-block">
                    {!loading && game && game.screenshots.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImage(
                              (prev) => (prev - 1 + game.screenshots.length) % game.screenshots.length
                            )
                          }
                          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/50 p-2 text-black hover:bg-white/70 transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="size-7" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedImage((prev) => (prev + 1) % game.screenshots.length)}
                          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/50 p-2 text-black hover:bg-white/70 transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="size-7" />
                        </button>
                      </>
                    )}

                    {loading && (
                      <div className="flex h-full w-full items-center justify-center text-text-secondary">
                        Loading...
                      </div>
                    )}

                    {!loading && game && (
                      <Image
                        src={game.screenshots[selectedImage] || "/images/placeholder-game.jpg"}
                        alt={`${game.name} screenshot ${selectedImage + 1}`}
                        fill
                        quality={100}
                        className="object-cover"
                      />
                    )}
                  </div>

                  {game && game.screenshots.length > 1 && (
                    <Carousel
                      opts={{ align: "start" }}
                      setApi={setCarouselApi}
                      className="relative w-full"
                    >
                      <CarouselContent className="-ml-2">
                        {game.screenshots.map((src, index) => (
                          <CarouselItem
                            key={`${src}-${index}`}
                            className="pl-2 basis-1/4 sm:basis-1/5 lg:basis-1/6"
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedImage(index)}
                              className={cn(
                                "relative aspect-video w-full overflow-hidden rounded-[12px] transition-all",
                                selectedImage === index ? "" : "opacity-30 hover:opacity-100"
                              )}
                            >
                              <Image
                                src={src}
                                alt={`${game?.name ?? "Game"} screenshot ${index + 1}`}
                                fill
                                quality={100}
                                className="object-cover"
                              />
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  )}
                </div>

                <div>
                  <p className="text-2xl font-bold leading-[1.35] text-[#D09FFF]">
                    {game?.shortDescription}
                  </p>
                </div>
              </div>

              {!!trackingLinkWithParams && game && (
                <Link
                  href={trackingLinkWithParams}
                  target="_blank"
                  className="block w-full rounded-full bg-[#309800] py-3 text-center text-[16px] font-bold text-white hover:bg-[#309800]/90 uppercase"
                >
                  {game.ctaText}
                </Link>
              )}

              {game?.videoUrl && (
                <div className="aspect-video overflow-hidden rounded-[14px] bg-black">
                  <iframe
                    src={getYoutubeEmbedUrl(game.videoUrl, { autoplay: false })}
                    className="h-full w-full"
                    title={game.name}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}

              {game?.gameOverview?.length ? (
                <div className="space-y-8">
                  {game.gameOverview.map((section, index) => (
                    <div key={`${section.title ?? "section"}-${index}`}>
                      {section.title ? (
                        <h3 className="mb-2 text-[18px] font-black text-[#72B7FF]">
                          {section.title}
                        </h3>
                      ) : null}
                      <p
                        className="text-sm font-normal text-[#BFBFBF]"
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {!!trackingLinkWithParams && game && (
                <Link
                  href={trackingLinkWithParams}
                  target="_blank"
                  className="block w-full rounded-full bg-[#309800] py-3 text-center text-[16px] font-bold text-white hover:bg-[#309800]/90 uppercase"
                >
                  {game.ctaText}
                </Link>
              )}
            </div>
      </DialogContent>
    </Dialog>
  );
}

