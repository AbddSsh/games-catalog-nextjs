import Link from "next/link";
import { BlogArticleCard, type IBlogArticleCard } from "@/entities/blog";
import { ChevronDown } from "lucide-react";
import { localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IBlogListProps {
  locale: string;
  items: IBlogArticleCard[];
  title?: string;
  sortModal: Record<string, string>;
  currentSort?: string;
  activeCategory?: string;
  searchQuery?: string;
}

function getSortHref(
  locale: string,
  sort: string,
  activeCategory?: string,
  searchQuery?: string
): string {
  const params = new URLSearchParams();
  if (activeCategory) params.set("category", activeCategory);
  if (searchQuery && searchQuery.trim().length >= 2) params.set("q", searchQuery.trim());
  params.set("sort", sort);

  const query = params.toString();
  return `${localePath(locale, ROUTES.BLOG)}${query ? `?${query}` : ""}`;
}

export function BlogList({
  locale,
  items,
  title = "All Articles",
  sortModal,
  currentSort,
  activeCategory,
  searchQuery,
}: IBlogListProps) {
  const BLOG_SORT_OPTIONS = Object.entries(sortModal).map(([key, value]) => ({ key, value }));
  const activeSort = BLOG_SORT_OPTIONS.find((item) => item.key === currentSort) ?? BLOG_SORT_OPTIONS[0];

  return (
    <section className="space-y-5">
      {title ? (
        <div className="flex items-center justify-between gap-2.5">
          <h2 className="text-[34px] font-extrabold leading-none text-text-primary">{title}</h2>
          {activeSort ? (
            <details className="group relative">
              <summary className="flex h-[37px] min-w-[119px] cursor-pointer list-none items-center justify-center gap-2 rounded-[18.5px] bg-[#342148] px-5 text-sm font-bold uppercase text-[#c5a7e8] marker:content-none [&::-webkit-details-marker]:hidden">
                {activeSort.value}
                <ChevronDown className="h-4 w-4 text-[#c5a7e8] transition-transform group-open:rotate-180" />
              </summary>

              <div className="absolute right-0 top-[45px] z-20 w-[182px] overflow-hidden rounded-[20px] bg-[#3a2551]">
                {BLOG_SORT_OPTIONS.map((option) => {
                  const isActive = option.key === currentSort;
                  return (
                    <Link
                      key={option.key}
                      href={getSortHref(locale, option.key, activeCategory, searchQuery)}
                      scroll={false}
                      className={`block px-8 py-3 text-[16px] transition-colors ${
                        isActive
                          ? "bg-[#5a4372] text-white"
                          : "text-white hover:bg-[#5a4372]/70"
                      }`}
                    >
                      {option.value}
                    </Link>
                  );
                })}
              </div>
            </details>
          ) : null}
        </div>
      ) : null}
      {items.length > 0 ? (
        <div className="grid gap-2.5 grid-cols-2">
          {items.map((item) => (
            <BlogArticleCard key={item.slug} article={item} locale={locale} compact />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border-main bg-bg-card p-8 text-center text-text-secondary">
          No articles found. Reset filters and try again.
        </div>
      )}
    </section>
  );
}
