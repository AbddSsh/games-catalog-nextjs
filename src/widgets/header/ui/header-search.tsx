"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui";
import { useDebounce } from "@/shared/hooks";
import { ROUTES } from "@/shared/router";
import { localePath } from "@/shared/lib";

const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const catalogPath = (locale: string) => localePath(locale, ROUTES.CATALOG);

interface IHeaderSearchProps {
  locale: string;
  placeholder?: string;
  /** Начальное значение из URL (как в moneyswap: один раз с сервера, без двусторонней связки) */
  initialQuery?: string;
}

export function HeaderSearch({
  locale,
  placeholder = "Tap to search",
  initialQuery = "",
}: IHeaderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const isOurPushRef = useRef(false);

  // Синхронизация URL → state только при заходе на каталог (pathname/locale), не при каждом searchParams
  useEffect(() => {
    if (pathname !== catalogPath(locale)) return;
    if (isOurPushRef.current) {
      isOurPushRef.current = false;
      return;
    }
    setQuery(searchParams.get("q") || "");
  }, [pathname, locale, searchParams]);

  // Обновление URL по debounced значению (односторонне: инпут → URL)
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    const urlQ = searchParams.get("q") || "";

    if (pathname !== catalogPath(locale)) {
      if (trimmed.length >= MIN_SEARCH_LENGTH) {
        isOurPushRef.current = true;
        router.push(`${catalogPath(locale)}?q=${encodeURIComponent(trimmed)}`);
      }
      return;
    }

    if (trimmed.length >= MIN_SEARCH_LENGTH && trimmed !== urlQ) {
      isOurPushRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", trimmed);
      params.delete("page");
      router.push(`${catalogPath(locale)}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
      return;
    }
    if (trimmed.length < MIN_SEARCH_LENGTH && urlQ) {
      isOurPushRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      router.push(`${catalogPath(locale)}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }
  }, [debouncedQuery, locale, router, pathname, searchParams]);

  const handleClear = () => {
    setQuery("");
    if (pathname === catalogPath(locale)) {
      isOurPushRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      const queryString = params.toString();
      router.push(`${catalogPath(locale)}${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length >= MIN_SEARCH_LENGTH) {
      isOurPushRef.current = true;
      router.push(`${catalogPath(locale)}?q=${encodeURIComponent(trimmed)}`);
    } else if (pathname === catalogPath(locale)) {
      isOurPushRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      const queryString = params.toString();
      router.push(`${catalogPath(locale)}${queryString ? `?${queryString}` : ""}`, { scroll: false });
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
