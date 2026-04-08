"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader } from "lucide-react";
import { appendSearchParamsToUrl } from "@/shared/lib";
import { useTrackingParams } from "@/shared/hooks";
import { Button, Skeleton } from "@/shared/ui";
import type { IGamePromo } from "@/entities/game";

interface IPromoFeaturedCardProps {
  game: IGamePromo;
  bannerImage: string;
  locale: string;
  translations: {
    play: string;
  };
}

export function PromoFeaturedCard({ game, bannerImage, translations }: IPromoFeaturedCardProps) {
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const trackingParams = useTrackingParams();
  const trackingLinkWithParams = useMemo(
    () => appendSearchParamsToUrl(game.trackingLink, trackingParams),
    [game.trackingLink, trackingParams]
  );

  const ratingValue = typeof game?.promo?.rating === "number" ? game.promo.rating : 0;
  const votesAmount = game?.promo?.votesAmount ?? 0;
  const ratingPercent = Math.max(0, Math.min(100, ratingValue));

  return (
    <Link
      href={trackingLinkWithParams}
      target="_blank"
      className="group mb-[30px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative rounded-[15px] bg-[#110C2C] min-h-[290px] flex flex-col md:flex-row"
    >
      {/* Hover border (2.02px gradient) */}
      {/* <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3] rounded-[15px] opacity-0 transition-opacity duration-300 group-hover:opacity-75 bg-[linear-gradient(90deg,_#B774FF_0%,_#3B9BC4_52.4%,_#B067FF_100%)] p-[2.02px] group-hover:!shadow-[0_0_14.6px_rgba(195,180,219,0.64)]"
      >
        <div className="h-full w-full rounded-[15px] shadow-[inset_0_0_25.64px_0_#A869E4] bg-[linear-gradient(90deg,_rgba(31,26,59,0)_0%,_rgba(31,26,59,0.51)_0%,_rgba(31,26,59,0.77)_0%,_#1F1A3B_0%,_#1F1A3B_0%)]" />
      </div> */}

        <div
          aria-hidden
          className="group-hover:!shadow-[0_0_14.6px_rgba(195,180,219,0.64)] pointer-events-none absolute inset-0 z-[0] rounded-[15px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className="shadow-none transition-[box-shadow,filter,opacity] duration-300 ease-out group-hover:shadow-[inset_0_0_25.64px_0_#A869E4] pointer-events-none absolute inset-0 z-[3] rounded-[15px] border-[2.02px] border-[#A869E4] opacity-0 group-hover:opacity-100"
        />

      {/* Banner image */}
      <div className="rounded-l-[15px] overflow-hidden relative z-[1] w-full md:w-[55%] md:absolute md:inset-y-0 md:left-0 aspect-[16/9] md:aspect-auto">
        {isBannerLoading && (
          <Skeleton className="absolute inset-0 flex items-center justify-center bg-[#110C2C/50] z-[1]">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </Skeleton>
        )}
        <Image
          src={bannerImage}
          alt={game?.name}
          fill
          quality={100}
          className={isBannerLoading
            ? "object-cover transition-[opacity,transform] duration-300 opacity-0"
            : "object-cover transition-[opacity,transform] duration-300 ease-out opacity-100 group-hover:scale-105"
          }
          onLoadingComplete={() => setIsBannerLoading(false)}
        />
        {/* Gradient overlay — fades image into card background */}
        <div
          className="absolute inset-y-0 left-0 right-0 hidden md:block"
          style={{
            background: "linear-gradient(to right, rgba(17,12,44,0) 0%, rgba(17,12,44,0.55) 60%, rgba(17,12,44,0.9) 85%, #110C2C 100%)",
          }}
        />
        {/* Mobile: bottom fade */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: "linear-gradient(to bottom, rgba(17,12,44,0) 40%, #110C2C 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[10] md:ml-auto md:w-[50%] flex flex-col justify-center gap-4 py-8 pr-7">
        {/* Title + rating */}
        <div className="flex items-center justify-between gap-5">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {game?.name}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
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
            <span className="text-white/60 text-xs font-medium">({votesAmount})</span>
          </div>
        </div>

        {/* Tags + genres */}
        <div className="flex flex-wrap items-center gap-3">
          {game?.tags?.map((tag) => (
            <span
              key={tag.slug}
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: tag.color ?? "#047bf6" }}
            >
              {tag.name}
            </span>
          ))}
          {game.genres?.length > 0 && (
            <span className="text-sm font-semibold text-[#A869E4]">
              {game?.genres?.map((g) => g.name).join(", ")}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-3 text-sm text-[#B8B8B8]">
          {game?.shortDescription}
        </p>

        {/* CTA */}
        <div className="relative w-fit mt-1">
          {/* Gradient "2px border" on card hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[2px] rounded-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(90deg,_#F4DBAC_0%,_#A88C56_25%,_#FFFB3B_50%,_#AF8C4C_75%,_#FFF7BD_100%)]"
          />
          <Button
            size="lg"
            className="relative z-[1] w-fit min-w-[200px] border-0 drop-shadow-[0px_4px_4px_rgba(244,209,94,0.51)] text-[#212121] font-bold text-2xl px-10 py-2 rounded-[9px] h-auto bg-gradient-to-r from-[#C2913C] via-[#F6E078] to-[#A76F15] transition-all duration-300 group-hover:from-[#F4DBAC] group-hover:via-[#FFF7BD] group-hover:to-[#AF8C4C] group-hover:drop-shadow-[0px_0_11.21px_rgba(244,209,94,0.51)]"
          >
            {translations.play}
          </Button>
        </div>
      </div>
    </Link>
  );
}
