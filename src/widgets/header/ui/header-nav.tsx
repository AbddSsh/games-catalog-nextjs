"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { INavItem } from "@/shared/types";
import type { ITranslations } from "@/entities/translations";

import gameCatalogIcon from "@/shared/icons/game-catalog-icon.svg";
import browserGamesIcon from "@/shared/icons/browser-games-icon.svg";
import onlineGamesIcon from "@/shared/icons/online-games-icon.svg";
import downloadGamesIcon from "@/shared/icons/download-games-icon.svg";
import { cn, localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IHeaderNavProps {
  locale: string;
  items?: INavItem[];
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

export function HeaderNav({ locale, items, translations }: IHeaderNavProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Use default items if none provided - labels from translations
  const DEFAULT_NAV_ITEMS = [
    { label: translations.common.games.toUpperCase(), href: ROUTES.CATALOG, icon: gameCatalogIcon, hasDropdown: true },
    { label: translations.common.games.toUpperCase(), href: ROUTES.CATALOG + "?platforms=browser", icon: browserGamesIcon },
    { label: translations.common.games.toUpperCase(), href: ROUTES.CATALOG + "?platforms=online", icon: onlineGamesIcon },
    { label: translations.common.games.toUpperCase(), href: ROUTES.CATALOG + "?platforms=download", icon: downloadGamesIcon },
  ];
  
  // Use default items if none provided
  const navItems = items && items.length > 0
    ? items.map((item, index) => ({
        label: item.label,
        href: item.href,
        icon: null as typeof gameCatalogIcon | null,
        hasDropdown: index === 0,
      }))
    : DEFAULT_NAV_ITEMS;

  return (
    <nav className="grid md:grid-cols-[1fr_repeat(3,0.5fr)] grid-cols-2 items-center md:gap-4 gap-2 justify-items-end">
      {navItems.map((item, index) => {
        const href = localePath(locale, item.href);
        const isActive = isLinkActive(item.href, pathname, searchParams);

        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              "flex items-center gap-2 text-xs font-black uppercase tracking-wide transition-colors",
              index === 0 && "justify-self-start", index === 2 && "justify-self-start md:justify-self-end",
              isActive
                ? "text-accent-purple"
                : "text-text-primary hover:text-accent-purple"
            )}
          >
            {item.icon && (
              <Image
                src={item.icon}
                alt=""
                width={16}
                height={16}
                quality={100}
                className="opacity-50"
              />
            )}
            {item.label}
            {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
          </Link>
        );
      })}
    </nav>
  );
}
