import Link from "next/link";
import { Search, X } from "lucide-react";
import { BlogArticleCard, type IBlogArticleCard, type IBlogChip } from "@/entities/blog";
import { ROUTES } from "@/shared/router";
import { localePath } from "@/shared/lib";
import { Input } from "@/shared/ui";

interface IBlogHeroProps {
  locale: string;
  title: string;
  searchPlaceholder: string;
  chips: IBlogChip[];
  activeCategory?: string;
  searchQuery?: string;
  primary: IBlogArticleCard | null;
  secondary: IBlogArticleCard[];
}

function getChipHref(locale: string, chipSlug: string, searchQuery?: string): string {
  const params = new URLSearchParams();
  if (chipSlug !== "all") {
    params.set("category", chipSlug);
  }
  if (searchQuery && searchQuery.trim().length >= 2) {
    params.set("q", searchQuery.trim());
  }
  const queryString = params.toString();

  return `${localePath(locale, ROUTES.BLOG)}${queryString ? `?${queryString}` : ""}`;
}

export function BlogHero({
  locale,
  title,
  searchPlaceholder,
  chips,
  activeCategory,
  searchQuery,
  primary,
  secondary,
}: IBlogHeroProps) {
  const hasSecondary = secondary.length > 0;

  return (
    <section className="space-y-6">
      <h1 className="max-w-[760px] text-[38px] font-extrabold leading-[1.1] text-text-primary laptop:text-[46px]">
        {title}
      </h1>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isActive =
            (activeCategory ?? "all") === chip.slug ||
            (!activeCategory && chip.slug === "all");

          return (
            <Link
              key={chip.slug}
              href={getChipHref(locale, chip.slug, searchQuery)}
              className={`inline-flex h-[39px] items-center rounded-[19.5px] text-sm font-extrabold uppercase tracking-wide transition-colors ${
                isActive
                  ? "border-2 border-[#B744B6] bg-[#682D78] px-[36px] text-white shadow-[inset_0_0_16.1px_0_#D2189A,0_0_8.8px_0_#D2189A]"
                  : "border border-[#312A46] bg-[#2D293F] px-[31px] text-text-secondary hover:text-text-primary"
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>

      {primary ? (
        <div className="grid gap-6 laptop:grid-cols-[minmax(0,1fr)_300px] laptop:gap-5 desktop:grid-cols-[minmax(0,1fr)_320px]">
          <BlogArticleCard article={primary} locale={locale} />
          {hasSecondary ? (
            <div className="space-y-3">
              <form
                action={localePath(locale, ROUTES.BLOG)}
                method="get"
                className="rounded-[15px] border border-[#3A264A] bg-white/10 p-[8px_11px]"
              >
                {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
                <div className="relative">
                  <Input
                    type="search"
                    name="q"
                    defaultValue={searchQuery}
                    disabled
                    placeholder={searchPlaceholder}
                    className="peer h-[37px] rounded-[9px] border border-[#924293] bg-[#D9D9D903] px-5 pr-10 text-sm tracking-wide text-[#ab87cf] shadow-[0_0_4px_0_#D2189A,inset_0_0_8.1px_0_#D2189A] placeholder:text-[#ab87cf] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                  />
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ab87cf] peer-[:not(:placeholder-shown)]:hidden" />
                  <button
                    type="reset"
                    aria-label="Clear search"
                    className="pointer-events-none absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center text-[#ab87cf] opacity-0 transition-opacity peer-[:not(:placeholder-shown)]:pointer-events-auto peer-[:not(:placeholder-shown)]:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
              {secondary.map((item) => (
                <BlogArticleCard key={item.slug} article={item} locale={locale} compact heroSide />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
