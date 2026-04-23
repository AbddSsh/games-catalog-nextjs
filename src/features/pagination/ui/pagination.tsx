"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/router";
import { localePath } from "@/shared/lib";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
  basePath?: string;
  showLoadMore?: boolean;
  /** Текущее кол-во запрашиваемых элементов (для кнопки "Show More") */
  currentElements?: number;
  /** Шаг увеличения элементов при нажатии "Show More" */
  elementsStep?: number;
  /** Всего элементов (скрыть Show More когда currentElements >= totalItems) */
  totalItems?: number;
  translations?: {
    loadMore: string;
    back: string;
    next: string;
  };
}

const PAGINATION_SCROLL_KEY = "pagination-scroll-y";
const PAGINATION_NAV_FALLBACK_TIMEOUT_MS = 1200;

export function Pagination({
  currentPage,
  totalPages,
  locale,
  basePath = ROUTES.CATALOG,
  showLoadMore = true,
  currentElements,
  elementsStep = 12,
  totalItems = 0,
  translations,
}: IPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navFallbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let savedY: string | null = null;
    try {
      savedY = sessionStorage.getItem(PAGINATION_SCROLL_KEY);
    } catch {
      return;
    }
    if (!savedY) return;

    const y = Number(savedY);
    if (Number.isFinite(y)) {
      window.scrollTo({ top: y, behavior: "auto" });
    }

    try {
      sessionStorage.removeItem(PAGINATION_SCROLL_KEY);
    } catch {
      // Ignore storage access errors
    }
  }, [searchParams]);

  const preserveScrollPosition = () => {
    try {
      sessionStorage.setItem(PAGINATION_SCROLL_KEY, String(window.scrollY));
    } catch {
      // Ignore storage access errors and keep navigation working
    }
  };

  useEffect(() => {
    if (navFallbackTimeoutRef.current != null) {
      window.clearTimeout(navFallbackTimeoutRef.current);
      navFallbackTimeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  const scheduleNavigationFallback = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const fromUrl = `${window.location.pathname}${window.location.search}`;
    navFallbackTimeoutRef.current = window.setTimeout(() => {
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (currentUrl === fromUrl) {
        window.location.assign(href);
      }
    }, PAGINATION_NAV_FALLBACK_TIMEOUT_MS);
  };

  const buildHref = (params: URLSearchParams) => {
    const queryString = params.toString();
    return `${localePath(locale, basePath)}${queryString ? `?${queryString}` : ""}`;
  };

  const getPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    return buildHref(params);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const hasMoreItems =
    currentElements != null && totalItems != null && currentElements < totalItems;
  const loadMoreHref = hasMoreItems
    ? (() => {
        const nextElements = (currentElements ?? 0) + elementsStep;
        const params = new URLSearchParams(searchParams.toString());
        params.set("elements", String(nextElements));
        params.delete("page");
        return buildHref(params);
      })()
    : null;

  return (
    <div className="space-y-4">
      {/* Show More: увеличивает кол-во запрашиваемых элементов (12 → 24 → 36 …) */}
      {/* {showLoadMore && hasMoreItems && loadMoreHref && (
        <Button asChild className="w-full bg-gradient-button text-white font-bold hover:opacity-90 transition-opacity">
          <Link
            href={loadMoreHref}
            scroll={false}
            prefetch={false}
            onClick={(event) => {
              preserveScrollPosition();
              scheduleNavigationFallback(event, loadMoreHref);
            }}
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            {translations?.loadMore || "Load More"}
          </Link>
        </Button>
      )} */}

      {/* Pagination */}
      <nav className="flex items-center justify-between">
        {/* Back Button */}
        {hasPrevPage ? (
          <Link
            href={getPageHref(currentPage - 1)}
            scroll={false}
            prefetch={false}
            onClick={(event) => {
              const href = getPageHref(currentPage - 1);
              preserveScrollPosition();
              scheduleNavigationFallback(event, href);
            }}
            className="flex items-center gap-1 text-sm font-medium transition-colors text-text-secondary hover:text-text-primary"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            {translations?.back || "Back"}
          </Link>
        ) : (
          <span
            className="flex items-center gap-1 text-sm font-medium transition-colors cursor-not-allowed text-text-muted opacity-50"
            aria-label="Previous page"
            aria-disabled="true"
          >
            <ChevronLeft className="h-4 w-4" />
            {translations?.back || "Back"}
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="flex h-9 w-9 items-center justify-center text-text-muted">
                  ...
                </span>
              ) : page === currentPage ? (
                <span className="flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium bg-accent-purple text-white">
                  {page}
                </span>
              ) : (
                <Link
                  href={getPageHref(page)}
                  scroll={false}
                  prefetch={false}
                  onClick={(event) => {
                    const href = getPageHref(page);
                    preserveScrollPosition();
                    scheduleNavigationFallback(event, href);
                  }}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
                  )}
                >
                  {page}
                </Link>
              )}
            </span>
          ))}
        </div>

        {/* Next Button */}
        {hasNextPage ? (
          <Link
            href={getPageHref(currentPage + 1)}
            scroll={false}
            prefetch={false}
            onClick={(event) => {
              const href = getPageHref(currentPage + 1);
              preserveScrollPosition();
              scheduleNavigationFallback(event, href);
            }}
            className="flex items-center gap-1 text-sm font-medium transition-colors text-text-secondary hover:text-text-primary"
            aria-label="Next page"
          >
            {translations?.next || "Next"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            className="flex items-center gap-1 text-sm font-medium transition-colors cursor-not-allowed text-text-muted opacity-50"
            aria-label="Next page"
            aria-disabled="true"
          >
            {translations?.next || "Next"}
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </nav>
    </div>
  );
}
