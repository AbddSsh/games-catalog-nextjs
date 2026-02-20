"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui";
import { useDebounce } from "@/shared/hooks";

const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;

interface IHeaderSearchProps {
  locale: string;
  placeholder?: string;
}

export function HeaderSearch({
  locale,
  placeholder = "Tap to search",
}: IHeaderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  // Sync query state with URL parameter q (only when on catalog page)
  useEffect(() => {
    if (pathname === `/${locale}/catalog`) {
      const urlQuery = searchParams.get("q") || "";
      if (urlQuery !== query) {
        setQuery(urlQuery);
      }
    }
  }, [searchParams, pathname, locale]);

  // Update URL when debounced query changes
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    const currentUrlQuery = searchParams.get("q") || "";
    
    // If we're on catalog page, update URL params
    if (pathname === `/${locale}/catalog`) {
      // Only update if query actually changed
      if (trimmedQuery.length >= MIN_SEARCH_LENGTH && trimmedQuery !== currentUrlQuery) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", trimmedQuery);
        params.delete("page"); // Reset to first page when searching
        const queryString = params.toString();
        router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ""}`, { scroll: false });
      } else if (trimmedQuery.length < MIN_SEARCH_LENGTH && currentUrlQuery) {
        // Clear q parameter if query is too short or empty
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("page");
        const queryString = params.toString();
        router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ""}`, { scroll: false });
      }
    } else if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
      // Navigate to catalog if not already there
      router.push(`/${locale}/catalog?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }, [debouncedQuery, locale, router, pathname, searchParams]);

  const handleClear = () => {
    setQuery("");
    // Clear q parameter from URL
    if (pathname === `/${locale}/catalog`) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      const queryString = params.toString();
      router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }
  };

  // Fallback submit for Enter key
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
      router.push(`/${locale}/catalog?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If query is too short, clear search
      if (pathname === `/${locale}/catalog`) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("page");
        const queryString = params.toString();
        router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ""}`, { scroll: false });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full min-w-[200px] pl-3 pr-9 bg-white border-border-main text-bg-main placeholder:text-text-muted"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <Search className="absolute right-3 top-1/2 h-4 w-4 shrink-0 -translate-y-1/2 text-text-muted pointer-events-none" />
        )}
      </div>
    </form>
  );
}
