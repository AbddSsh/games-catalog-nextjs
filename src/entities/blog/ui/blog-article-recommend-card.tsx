"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import type { IBlogArticleRecommendedItem } from "@/entities/blog";
import { cn, localePath } from "@/shared/lib";
import { getBlogArticleRoute } from "@/shared/router";
import { Skeleton } from "@/shared/ui";

interface IBlogArticleRecommendCardProps {
  locale: string;
  article: IBlogArticleRecommendedItem;
}

interface IRecommendedImageProps {
  src: string;
  alt: string;
}

function RecommendedImage({ src, alt }: IRecommendedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <Skeleton className="absolute inset-0 z-[1] overflow-hidden bg-[#2B224B]/55">
          <span className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.12)_50%,transparent_80%)]" />
        </Skeleton>
      ) : null}
      <Image
        src={src}
        alt={alt}
        width={311}
        height={151}
        className={cn(
          "h-[151px] w-full object-cover transition-[transform,opacity] duration-300 group-hover:scale-[1.02]",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  const gradientId = useId();

  return (
    <div className="relative h-[41.24px] w-[41.24px] drop-shadow-[0_0_4.12px_#A869E4]">
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAE08C" />
            <stop offset="34.62%" stopColor="#F1735C" />
            <stop offset="67.31%" stopColor="#B556A8" />
            <stop offset="100%" stopColor="#6049C8" />
          </linearGradient>
        </defs>
        <path
          d="M50 4 C56 4 63 8 69 12 L84 21 C89 24 92 30 92 36 V64 C92 70 89 76 84 79 L69 88 C63 92 56 96 50 96 C44 96 37 92 31 88 L16 79 C11 76 8 70 8 64 V36 C8 30 11 24 16 21 L31 12 C37 8 44 4 50 4 Z"
          fill="#2B224B"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.3"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute inset-0 grid place-items-center text-[16px] font-bold leading-none text-white"
        style={{ textShadow: "0px 3px 5px rgba(0,0,0,0.32)" }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function BlogArticleRecommendCard({
  locale,
  article,
}: IBlogArticleRecommendCardProps) {
  return (
    <Link
      href={localePath(locale, getBlogArticleRoute(article.slug))}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-[9.5px]">
        <RecommendedImage
          src={article.bannerImage || "/images/placeholder-game.jpg"}
          alt={article.articleTitle}
        />
        <div className="absolute bottom-[10px] left-[8px]">
          <RatingBadge rating={article.rating} />
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-[20px] font-bold leading-[25px] text-white transition-colors group-hover:text-[#B944DB] group-hover:underline">
        {article.articleTitle}
      </p>
      <p className="mt-2 line-clamp-2 text-[14px] leading-[17px] text-[#FFFFFF96] transition-colors group-hover:text-white">
        {article.articleSubTitle}
      </p>
    </Link>
  );
}
