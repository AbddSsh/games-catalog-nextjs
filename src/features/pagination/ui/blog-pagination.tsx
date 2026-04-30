"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IBlogPaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
}

const PAGINATION_SCROLL_KEY = "pagination-scroll-y";
const PAGINATION_NAV_FALLBACK_TIMEOUT_MS = 1200;

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
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
}

export function BlogPagination({
  currentPage,
  totalPages,
  locale,
}: IBlogPaginationProps) {
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

  const getPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const query = params.toString();
    return `${localePath(locale, ROUTES.BLOG)}${query ? `?${query}` : ""}`;
  };

  return (
    <nav className="flex items-center justify-center">
      <div className="flex items-center gap-3">
        {getPageNumbers(currentPage, totalPages).map((page, index) => (
          <span key={index}>
            {page === "..." ? (
              <span className="flex h-10 w-10 items-center justify-center text-[18px] font-bold text-white/80">
                ...
              </span>
            ) : page === currentPage ? (
              <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-button px-3 text-[16px] font-bold leading-none text-white">
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
                className="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[16px] font-bold leading-none text-white transition-colors hover:bg-bg-card-hover"
              >
                {page}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
