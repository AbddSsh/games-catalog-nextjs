import Link from "next/link";
import { BlogArticleCard, type IBlogArticleCard } from "@/entities/blog";
import { ENUM_BLOG_SORT, type ENUM_BLOG_SORT_TYPE } from "@/entities/blog";
import { ChevronDown } from "lucide-react";
import { localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IBlogListProps {
  locale: string;
  items: IBlogArticleCard[];
  title?: string;
  currentSort?: ENUM_BLOG_SORT_TYPE;
  activeCategory?: string;
  searchQuery?: string;
}

const BLOG_SORT_OPTIONS: Array<{ label: string; value: ENUM_BLOG_SORT_TYPE }> = [
  { label: "Latest", value: ENUM_BLOG_SORT.PUBLISHED_AT_DESC },
  { label: "Oldest", value: ENUM_BLOG_SORT.PUBLISHED_AT_ASC },
  { label: "Most Popular", value: ENUM_BLOG_SORT.REACTIONS_DESC },
];

function getSortHref(
  locale: string,
  sort: ENUM_BLOG_SORT_TYPE,
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
  currentSort = ENUM_BLOG_SORT.PUBLISHED_AT_DESC,
  activeCategory,
  searchQuery,
}: IBlogListProps) {
  const activeSort = BLOG_SORT_OPTIONS.find((item) => item.value === currentSort) ?? BLOG_SORT_OPTIONS[0];

  return (
    <section className="space-y-5">
      {title ? (
        <div className="flex items-center justify-between gap-2.5">
          <h2 className="text-[34px] font-extrabold leading-none text-text-primary">{title}</h2>
          <details className="group relative">
            <summary className="flex h-[37px] min-w-[119px] cursor-pointer list-none items-center justify-center gap-2 rounded-[18.5px] bg-[#342148] px-5 text-sm font-bold uppercase text-[#c5a7e8] marker:content-none [&::-webkit-details-marker]:hidden">
              {activeSort.label}
              <ChevronDown className="h-4 w-4 text-[#c5a7e8] transition-transform group-open:rotate-180" />
            </summary>

            <div className="absolute right-0 top-[45px] z-20 w-[182px] overflow-hidden rounded-[20px] bg-[#3a2551]">
              {BLOG_SORT_OPTIONS.map((option) => {
                const isActive = option.value === currentSort;
                return (
                  <Link
                    key={option.value}
                    href={getSortHref(locale, option.value, activeCategory, searchQuery)}
                    scroll={false}
                    className={`block px-8 py-3 text-[16px] transition-colors ${
                      isActive
                        ? "bg-[#5a4372] text-white"
                        : "text-white hover:bg-[#5a4372]/70"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </details>
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
