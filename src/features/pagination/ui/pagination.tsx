"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

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

export function Pagination({
  currentPage,
  totalPages,
  locale,
  basePath = "/catalog",
  showLoadMore = true,
  currentElements,
  elementsStep = 12,
  totalItems = 0,
  translations,
}: IPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const queryString = params.toString();
    router.push(`/${locale}${basePath}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const loadMore = () => {
    if (currentElements == null || totalItems == null) return;
    const nextElements = currentElements + elementsStep;
    const params = new URLSearchParams(searchParams.toString());
    params.set("elements", String(nextElements));
    params.delete("page");
    const queryString = params.toString();
    router.push(`/${locale}${basePath}${queryString ? `?${queryString}` : ""}`, { scroll: false });
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

  return (
    <div className="space-y-4">
      {/* Show More: увеличивает кол-во запрашиваемых элементов (12 → 24 → 36 …) */}
      {showLoadMore && hasMoreItems && (
        <Button
          onClick={loadMore}
          className="w-full bg-gradient-button text-white font-bold hover:opacity-90 transition-opacity"
        >
          <ChevronDown className="mr-2 h-4 w-4" />
          {translations?.loadMore || "Load More"}
        </Button>
      )}

      {/* Pagination */}
      <nav className="flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrevPage}
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-colors",
            hasPrevPage
              ? "text-text-secondary hover:text-text-primary"
              : "cursor-not-allowed text-text-muted opacity-50"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          {translations?.back || "Back"}
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="flex h-9 w-9 items-center justify-center text-text-muted">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => goToPage(page)}
                  className={cn(
                    "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
                    page === currentPage
                      ? "bg-accent-purple text-white"
                      : "text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
                  )}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNextPage}
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-colors",
            hasNextPage
              ? "text-text-secondary hover:text-text-primary"
              : "cursor-not-allowed text-text-muted opacity-50"
          )}
          aria-label="Next page"
        >
          {translations?.next || "Next"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
