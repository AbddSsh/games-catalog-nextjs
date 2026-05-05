"use client";

import useEmblaCarousel from "embla-carousel-react";
import { BlogArticleCard, type IBlogArticleCard } from "@/entities/blog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface IBlogReadersChoiceProps {
  locale: string;
  items: IBlogArticleCard[];
  title: string;
}

export function BlogReadersChoice({ locale, items, title }: IBlogReadersChoiceProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(items.length > 3);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const handlePrev = () => emblaApi?.scrollPrev();
  const handleNext = () => emblaApi?.scrollNext();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-8">
        <h2 className="text-[34px] font-extrabold leading-none text-text-primary">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollPrev}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-main bg-bg-card text-text-muted transition-colors hover:text-text-primary disabled:pointer-events-none disabled:opacity-40"
            aria-label="Previous readers choice slide"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollNext}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-main bg-bg-card text-text-primary transition-colors hover:border-accent-purple disabled:pointer-events-none disabled:opacity-40"
            aria-label="Next readers choice slide"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {items.map((item) => (
            <div key={item.slug} className="flex min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_33.3333%]">
              <BlogArticleCard article={item} locale={locale} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
