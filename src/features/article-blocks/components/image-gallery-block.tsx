"use client";

import { useEffect, useState } from "react";
import type { CarouselApi } from "@/shared/ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { IBlogImageGalleryBlock } from "@/entities/blog/model/blog.types";
import { ArticleImageWithLoader } from "./article-image-with-loader";

interface IImageGalleryBlockProps {
  block: IBlogImageGalleryBlock;
  baseKey: string;
}

export function ImageGalleryBlock({ block, baseKey }: IImageGalleryBlockProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} opts={{ align: "start", loop: block.images.length > 1 }} className="w-full">
        <CarouselContent className="-ml-0">
          {block.images.map((image, imageIndex) => (
            <CarouselItem key={`${baseKey}-${imageIndex}`} className="pl-0">
              <div className="overflow-hidden rounded-[14px]">
                <ArticleImageWithLoader
                  src={image}
                  alt=""
                  width={1775}
                  height={1000}
                  sizes="(max-width: 1200px) 100vw, 1008px"
                  className="h-auto max-h-[500px] w-full rounded-[14px] object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="left-4 z-10 h-10 w-10 border-none bg-[#FFFFFFC4] text-[#656565] hover:bg-[#FFFFFFC4] hover:text-[#656565]"
          aria-label="Previous image"
        />
        <CarouselNext
          className="right-4 z-10 h-10 w-10 border-none bg-[#FFFFFFC4] text-[#656565] hover:bg-[#FFFFFFC4] hover:text-[#656565]"
          aria-label="Next image"
        />
      </Carousel>

      {count > 1 ? (
        <div className="flex items-center justify-center gap-3" role="tablist" aria-label="Image gallery navigation">
          {Array.from({ length: count }).map((_, index) => {
            const isActive = index === current;
            return (
              <button
                key={`${baseKey}-dot-${index}`}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn("h-2.5 w-2.5 rounded-full transition-colors", isActive ? "bg-white" : "bg-[#766A95]")}
                aria-label={`Go to image ${index + 1}`}
                aria-current={isActive ? "true" : "false"}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
