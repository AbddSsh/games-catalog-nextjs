"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/ui";
import type { ILocaleConfig } from "@/entities/locale";
import { GlobalLanguageIcon } from "@/shared/icons";
import { DEFAULT_LOCALE } from "@/shared/config";

interface ILanguageSelectorProps {
  currentLocale: string;
  locales: ILocaleConfig[];
}

const SCROLL_POSITION_KEY = "scroll-position-before-locale-change";

export function LanguageSelector({ currentLocale, locales }: ILanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Restore scroll position after navigation
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      setTimeout(() => {
        window.scrollTo(0, position);
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
      }, 0);
    }
  }, [pathname]);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const scrollPosition = window.scrollY || window.pageYOffset;
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollPosition.toString());

    const nonDefaultCodes = locales.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);

    // Strip current locale prefix from pathname to get the "bare" path
    let barePath = pathname;
    const currentPrefix = nonDefaultCodes.find(
      (c) => pathname.startsWith(`/${c}/`) || pathname === `/${c}`
    );
    if (currentPrefix) {
      barePath = pathname.replace(new RegExp(`^/${currentPrefix}`), "") || "/";
    }

    // Build new path
    let newPath: string;
    if (newLocale === DEFAULT_LOCALE) {
      newPath = barePath;
    } else {
      newPath = `/${newLocale}${barePath === "/" ? "" : barePath}`;
    }

    const search = searchParams.toString();
    const fullPath = search ? `${newPath}?${search}` : newPath;

    router.push(fullPath, { scroll: false });
  };

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="h-9 w-auto gap-2 border-none bg-[#5C2590] text-white hover:bg-[#5C2590]/90 hover:text-white rounded-md px-4">
        <GlobalLanguageIcon className="size-4 shrink-0" />
        <span>Language</span>
      </SelectTrigger>
      <SelectContent className="border-border-main bg-bg-card min-w-[200px]">
        {locales.map((loc) => (
          <SelectItem
            key={loc.code}
            value={loc.code}
            className="text-text-secondary hover:bg-bg-card-hover hover:text-text-primary focus:bg-bg-card-hover focus:text-text-primary cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{loc.nativeName}</span>
              {loc.nativeName !== loc.name && (
                <span className="text-text-muted">({loc.name})</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
