"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader } from "lucide-react";
import { Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface IArticleImageWithLoaderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
}

export function ArticleImageWithLoader({
  src,
  alt,
  width,
  height,
  className,
  sizes,
}: IArticleImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className="absolute inset-0 z-[1] flex items-center justify-center bg-muted">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </Skeleton>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(
          className,
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
