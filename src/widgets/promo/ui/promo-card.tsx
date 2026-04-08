"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { appendSearchParamsToUrl } from "@/shared/lib";
import type { IGamePromo } from "@/entities/game";
import Link from "next/link";
import { Button, Skeleton } from "@/shared/ui";
import gameCatalogIcon from "@/shared/icons/game-catalog-icon.png";
import { useTrackingParams } from "@/shared/hooks";
import { Info, Loader, Play, Star } from "lucide-react";
import { PromoModal, PromoVideoModal } from "@/features/promo";

interface IPromoCardProps {
  game: IGamePromo;
  locale: string;
  translations: {
    video: string;
    info: string;
    play: string;
  };
}

export function PromoCard({ game, locale, translations }: IPromoCardProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPosterLoading, setIsPosterLoading] = useState(true);
  const trackingParams = useTrackingParams();
  const trackingLinkWithParams = useMemo(
    () => appendSearchParamsToUrl(game.trackingLink, trackingParams),
    [game.trackingLink, trackingParams]
  );

  const ratingValue = typeof game?.promo?.rating === "number" ? game.promo.rating : 0;
  const votesAmount = game?.promo?.votesAmount ?? 0;
  const ratingPercent = Math.max(0, Math.min(100, ratingValue));

  return (
    <>
      <Link
        href={trackingLinkWithParams}
        target="_blank"
        className="block"
      >
      <article
        className="group relative flex flex-col md:flex-row gap-12 rounded-[18px] bg-transparent cursor-pointer"
      >
        {/* Hover only: gradient + border */}
        <div
          aria-hidden
          className="group-hover:!shadow-[0_0_14.6px_rgba(255,255,255,0.25)] pointer-events-none absolute inset-0 z-[0] rounded-[18px] bg-gradient-to-r from-[#A869E4]/5 via-[#A869E4]/10 to-[#A869E4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className="shadow-none transition-[box-shadow,filter,opacity] duration-300 ease-out group-hover:shadow-[inset_0_0_17.32px_rgba(255,255,255,0.25)] pointer-events-none absolute inset-0 z-[3] rounded-[18px] border-[1px] border-[#A869E4] opacity-0 group-hover:opacity-100"
        />

        {/* Left: poster */}
        <div className="relative z-[1] w-full max-w-[175px] overflow-hidden rounded-[18px] bg-white/[0.03] md:w-[175px]">
          <div className="relative block w-full aspect-[1/1.45]">
            {isPosterLoading && (
              <Skeleton className="absolute inset-0 flex items-center justify-center bg-muted z-[1]">
                <Loader className="size-6 animate-spin text-muted-foreground" />
              </Skeleton>
            )}
            <Image
              src={game?.cardImage || "/images/placeholder-game.jpg"}
              alt={game?.name}
              fill
              quality={100}
              sizes="175px"
              className={`object-cover transition-[transform,opacity] duration-300 ease-out group-hover:scale-[1.05] ${
                isPosterLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setIsPosterLoading(false)}
            />
          </div>
        </div>

        {/* Middle: title + meta + description */}
        <div className="relative z-[1] flex flex-1 flex-col justify-center gap-5">
          <h2 className="text-2xl font-bold text-white">
            {game?.name}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {game?.tags?.map((tag) => (
              <span key={tag.slug} className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: tag.color ?? "#047bf6" }}>
                {tag.name}
              </span>
            ))}
            {game.genres?.length > 0 && (
              <span className="text-sm font-semibold text-[#A869E4]">
                {game?.genres?.map((g) => g.name).join(", ")}
              </span>
            )}
          </div>

          <p className="line-clamp-3 text-sm text-[#B8B8B8]">
            {game?.shortDescription}
          </p>

          <Button
            size="lg"
            className="min-w-[200px] w-fit flex gap-[10px] bg-[#6C5CE7] group-hover:bg-[#D2189A] hover:bg-[#D2189A] text-white font-bold text-lg px-10 py-1 rounded-full h-auto transition-colors duration-300"
          >
            <Image src={gameCatalogIcon} alt="game catalog" width={23} quality={100} className="size-1object-contain h-auto" />
            {translations.play}
          </Button>
        </div>

        {/* Right: controls + tags */}
        <div className="relative z-[1] w-full xl:w-1/3 xl:max-w-none xl:flex-[0_0_33%] md:w-[45%] md:max-w-none md:flex-[0_0_45%] my-[30px] mr-[30px] rounded-[18px] bg-white/[0.03] p-[25px] border-none transition-[transform] duration-300 ease-out group-hover:scale-[1.05]">
              <div className="flex items-center justify-between gap-5">
                <div className="flex gap-3">
                  {game?.videoUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsVideoOpen(true);
                        setIsInfoOpen(false);
                      }}
                      className="text-button w-full flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:bg-white/10"
                    >
                      <Play className="size-4" />
                      {translations.video}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsVideoOpen(false);
                      setIsInfoOpen(true);
                    }}
                    className="text-button w-full flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:bg-white/10"
                  >
                    <Info className="size-4" />
                    {translations.info}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const STAR_FILL_PERCENT = Math.max(0, Math.min(100, (ratingPercent - idx * 20) * 5));

                      return (
                        <div key={`star-${idx}`} className="relative size-4">
                          <Star className="size-4 text-white/25 fill-current" />
                          <div
                            className="absolute inset-y-0 left-0 overflow-hidden"
                            style={{ width: `${STAR_FILL_PERCENT}%` }}
                          >
                            <Star className="size-4 text-yellow-300 fill-current" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-white/70 text-[11px] font-medium">
                    Votes ({votesAmount})
                  </div>
                </div>
              </div>

              <div className="h-px my-5 w-full bg-[#3B314C]/50" />

              {game?.promo?.icons?.length > 0 && (
                <div className="grid grid-flow-col items-start gap-4 w-fit">
                  {game?.promo?.icons?.map((icon) => (
                    <div key={icon.slug} className="w-fit flex flex-col items-center gap-2 text-center">
                      <div className="flex size-[46px] items-center justify-center rounded-full">
                        <Image src={icon.url} alt={icon.name} width={46} height={46} quality={100} className="object-contain" />
                      </div>
                      <div className="text-[11px] font-semibold text-white/90 leading-none">
                        {icon?.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </article>
      </Link>

      <PromoModal
        slug={game?.slug}
        locale={locale}
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      <PromoVideoModal
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={game?.videoUrl}
        title={game?.name}
      />
    </>
  );
}

