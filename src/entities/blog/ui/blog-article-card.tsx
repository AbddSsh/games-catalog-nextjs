 "use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Flame, Loader } from "lucide-react";
import type { IBlogArticleCard } from "@/entities/blog";
import { getBlogArticleRoute } from "@/shared/router";
import { cn, localePath } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";

interface IBlogArticleCardProps {
  article: IBlogArticleCard;
  locale: string;
  compact?: boolean;
  heroSide?: boolean;
}

interface IBlogCardImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

function BlogCardImage({ src, alt, className, sizes }: IBlogCardImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-[1] flex items-center justify-center bg-muted">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </Skeleton>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        quality={100}
        sizes={sizes}
        className={cn(
          className,
          "transition-[transform,opacity] duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}

function formatMetaDate(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDate(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, "day");
  }

  const diffWeeks = Math.round(diffDays / 7);
  return rtf.format(diffWeeks, "week");
}

export function BlogArticleCard({
  article,
  locale,
  compact = false,
  heroSide = false,
}: IBlogArticleCardProps) {
  if (!compact) {
    return (
      <Link
        href={localePath(locale, getBlogArticleRoute(article.slug))}
        className="group relative block h-[369px] overflow-hidden rounded-[22px] transition-colors hover:border-accent-purple/70"
      >
        <BlogCardImage
          src={article.bannerImage || "/images/placeholder-game.jpg"}
          alt={article.title}
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <div className="rounded-[16px] absolute inset-x-0 -bottom-[2px] h-full bg-gradient-to-t from-[#19103D] via-[#19103D]/65 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 space-y-2 px-7 pb-6">
          <h3 className="line-clamp-2 text-[26px] font-bold leading-[1.15] text-text-primary">
            {article.title}
          </h3>
          <p className="line-clamp-1 text-[16px] leading-tight text-[#FFFFFF96]">
            {article.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[14px] font-semibold text-[#E660EB]">
            <span className="text-[#E660EB]">{formatMetaDate(article.publishedAt)}</span>
            {article.readMinutes ? <span className="text-[#E660EB]">• {article.readMinutes} min</span> : null}
            <span className="inline-flex items-center gap-1 text-[16px] font-bold leading-[1] text-[#FF8A55]">
              <Flame className="h-4 w-4 fill-current" />
              {article.reactionsCount}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (heroSide) {
    return (
      <Link
        href={localePath(locale, getBlogArticleRoute(article.slug))}
        className="group block h-[146px] rounded-[22px] border border-[#3A264A] bg-[#FFFFFF0F] p-5 transition-colors hover:border-accent-purple/70"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          {article.chip?.label ? (
            <span className="inline-flex h-[22px] items-center rounded-[19px] bg-white/10 px-4 text-sm font-normal text-[#B781E3]">
              {article.chip.label}
            </span>
          ) : (
            <span />
          )}
          <ChevronRight className="h-5 w-5 text-[#6e4f9a]" />
        </div>

        <h3 className="line-clamp-2 text-[16px] font-semibold leading-[1.2] text-text-primary">
          {article.title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold text-[#B781E3]">
          <span>{formatRelativeDate(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-1 text-[16px] font-bold leading-[1] text-[#FF8A55]">
            <Flame className="h-4 w-4 fill-current" />
            {article.reactionsCount}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={localePath(locale, getBlogArticleRoute(article.slug))}
      className="group flex h-full w-full flex-col rounded-2xl border border-[#A869E442] bg-[linear-gradient(120.81deg,rgba(168,105,228,0.07)_6.11%,rgba(255,255,255,0.07)_95.17%)] p-[18px] transition-colors hover:border-accent-purple/70"
    >
      <div
        className="relative mb-3 w-full max-h-[150px] overflow-hidden rounded-[16px]"
        style={{ aspectRatio: "2.327 / 1" }}
      >
        <BlogCardImage
          src={article.bannerImage || "/images/placeholder-game.jpg"}
          alt={article.title}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[#E660EB]">
          <span className="text-[#E660EB]">{formatMetaDate(article.publishedAt)}</span>
          {article.readMinutes ? <span className="text-[#E660EB]">• {article.readMinutes} min</span> : null}
          <span className="ml-auto inline-flex items-center gap-1 text-[16px] font-bold leading-[1] text-[#FF8A55]">
            <Flame className="h-4 w-4 fill-current" />
            {article.reactionsCount}
          </span>
        </div>
        <h3 className={`line-clamp-2 font-bold leading-tight text-white ${compact ? "text-[20px]" : "text-[34px]"}`}>
          {article.title}
        </h3>
        {!compact ? (
          <p className="line-clamp-2 text-sm text-text-secondary">{article.description}</p>
        ) : null}
      </div>
    </Link>
  );
}
