"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { cn, localePath } from "@/shared/lib";
import type { INavItem } from "@/shared/types";
import type { ITranslations } from "@/entities/translations";
import { RevalidateButtons } from "@/features/revalidate-buttons";
import { ROUTES } from "@/shared/router";

interface IFooterProps {
  locale: string;
  navigation?: INavItem[];
  translations: ITranslations;
}

function isLinkActive(href: string, currentPathname: string, currentSearchParams: URLSearchParams): boolean {
  // Extract path and search params from href
  const [path, searchString] = href.split("?");
  const hrefPath = path || href;
  
  // Check if path matches
  const pathMatches = currentPathname === `/${hrefPath.split("/").pop()}` || 
                       currentPathname.endsWith(hrefPath);
  
  if (!pathMatches) return false;
  
  // If href has no query params, check if current URL also has no filter params
  if (!searchString) {
    // Active if no filters are applied (only page/view/sort/q might be present)
    const hasFilters = currentSearchParams.get("genres") ||
                      currentSearchParams.get("settings") ||
                      currentSearchParams.get("platforms") ||
                      currentSearchParams.get("features");
    return !hasFilters;
  }
  
  // Parse href query params
  const hrefParams = new URLSearchParams(searchString);
  
  // Check if all href params match current params
  for (const [key, value] of hrefParams.entries()) {
    const currentValue = currentSearchParams.get(key);
    if (currentValue !== value) {
      return false;
    }
  }
  
  return true;
}

export function Footer({ locale, navigation = [], translations }: IFooterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Default footer navigation items from translations
  const DEFAULT_FOOTER_NAV: INavItem[] = [
    { label: translations.common.games, href: ROUTES.CATALOG, icon: "gamepad" },
    { label: translations.home.top_games, href: ROUTES.CATALOG + "?features=best-pick" },
    { label: translations.home.top_games, href: ROUTES.CATALOG + "?features=top-2025" },
    { label: translations.common.games, href: ROUTES.CATALOG + "?features=new" },
    { label: translations.common.games, href: ROUTES.CATALOG + "?platforms=browser" },
    { label: translations.common.games, href: ROUTES.CATALOG + "?platforms=download" },
  ];
  
  // Use provided navigation or default
  const navItems = navigation.length > 0 ? navigation : DEFAULT_FOOTER_NAV;

  return (
    <footer className="bg-bg-main w-full">
      <div className="max-w-[1400px] mx-auto w-full py-8 px-4">
        {/* Navigation Links */}
        <nav className="">
          <ul className="h-full flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navItems.map((item, index) => {
              const isActive = isLinkActive(item.href, pathname, searchParams);
              
              return (
                <li key={item.href || index}>
                  <Link
                    href={localePath(locale, item.href)}
                    className={cn(
                      "flex items-center gap-2 text-[12px] font-black transition-colors",
                      isActive
                        ? "text-accent-purple"
                        : "text-text-primary hover:text-accent-purple"
                    )}
                  >
                    {/* Show icon for first item (Game catalog) */}
                    {index === 0 && (
                      <Gamepad2 className="h-4 w-4" />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Privacy Policy & Sitemap links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link
            href={localePath(locale, ROUTES.PRIVACY)}
            className="text-[12px] font-black text-text-primary transition-colors hover:text-accent-purple"
          >
            Privacy Policy
          </Link>
          <Link
            href={localePath(locale, ROUTES.SITEMAP)}
            className="text-[12px] font-black text-text-primary transition-colors hover:text-accent-purple"
          >
            Sitemap
          </Link>
        </div>
        {/* <RevalidateButtons /> */}
        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-text-muted">
          {translations.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
