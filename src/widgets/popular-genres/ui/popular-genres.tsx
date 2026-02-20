import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ICategoryCard } from "@/entities/category";

interface IPopularGenresProps {
  categories: ICategoryCard[];
  locale: string;
  title?: string;
  maxItems?: number;
}

export function PopularGenres({
  categories,
  locale,
  title = "Popular Genres",
  maxItems = 6,
}: IPopularGenresProps) {
  const visibleCategories = categories.slice(0, maxItems);
  const hasMore = categories.length > maxItems;

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        {hasMore && (
          <Link
            href={`/${locale}/catalog`}
            className="flex items-center gap-1 text-sm font-medium text-accent-primary hover:underline"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {visibleCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/${locale}/category/${category.slug}`}
            className="group flex flex-col items-center gap-2 rounded-lg border border-border-main bg-bg-card p-4 text-center transition-all hover:border-accent-primary hover:shadow-md"
          >
            {/* Icon placeholder */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
              <span className="text-xl">{category.name[0]}</span>
            </div>
            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">
              {category.name}
            </span>
            <span className="text-xs text-text-muted">
              {category.gamesCount} games
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
