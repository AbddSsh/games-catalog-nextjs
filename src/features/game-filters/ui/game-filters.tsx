"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FilterX } from "lucide-react";
import {
  Checkbox,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";
import type { IFilters, IAppliedFilters } from "@/entities/filter";
import { ROUTES } from "@/shared/router";
import { localePath, buildFilterParam } from "@/shared/lib";

interface IGameFiltersProps {
  filters: IFilters;
  appliedFilters?: IAppliedFilters;
  locale: string;
}

export function GameFilters({
  filters,
  appliedFilters = {},
  locale,
}: IGameFiltersProps) {
  const searchParams = useSearchParams();

  const [activeFilters, setActiveFilters] = useState<IAppliedFilters>({
    genres: appliedFilters.genres || [],
    settings: appliedFilters.settings || [],
    platforms: appliedFilters.platforms || [],
    features: appliedFilters.features || [],
  });

  // Sync activeFilters with appliedFilters from props (when URL changes)
  useEffect(() => {
    const newFilters: IAppliedFilters = {
      genres: appliedFilters.genres || [],
      settings: appliedFilters.settings || [],
      platforms: appliedFilters.platforms || [],
      features: appliedFilters.features || [],
    };
    
    // Check if filters actually changed
    const filtersChanged =
      JSON.stringify(newFilters.genres) !== JSON.stringify(activeFilters.genres) ||
      JSON.stringify(newFilters.settings) !== JSON.stringify(activeFilters.settings) ||
      JSON.stringify(newFilters.platforms) !== JSON.stringify(activeFilters.platforms) ||
      JSON.stringify(newFilters.features) !== JSON.stringify(activeFilters.features);
    
    if (filtersChanged) {
      setActiveFilters(newFilters);
    }
  }, [appliedFilters.genres, appliedFilters.settings, appliedFilters.platforms, appliedFilters.features]);

  const getFiltersHref = (nextFilters: IAppliedFilters): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("genres");
    params.delete("settings");
    params.delete("platforms");
    params.delete("features");
    params.delete("page");
    // Keep previous behavior: clear search query when any filter set changes
    params.delete("q");
    if (nextFilters.genres?.length) params.set("genres", buildFilterParam(nextFilters.genres));
    if (nextFilters.settings?.length) params.set("settings", buildFilterParam(nextFilters.settings));
    if (nextFilters.platforms?.length) params.set("platforms", buildFilterParam(nextFilters.platforms));
    if (nextFilters.features?.length) params.set("features", buildFilterParam(nextFilters.features));
    const queryString = params.toString();
    return `${localePath(locale, ROUTES.CATALOG)}${queryString ? `?${queryString}` : ""}`;
  };

  const getClearFiltersHref = (): string => {
    // Keep previous behavior: clear all params except q
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    const queryString = params.toString();
    return `${localePath(locale, ROUTES.CATALOG)}${queryString ? `?${queryString}` : ""}`;
  };

  const filterGroups = [
    { key: "genres" as const, name: "Genres", options: filters.genres },
    { key: "settings" as const, name: "Settings", options: filters.settings },
    { key: "platforms" as const, name: "Platforms", options: filters.platforms },
    { key: "features" as const, name: "Features", options: filters.features },
  ].filter((group) => group.options.length > 0);

  const hasActiveFilters =
    (activeFilters.genres?.length || 0) > 0 ||
    (activeFilters.settings?.length || 0) > 0 ||
    (activeFilters.platforms?.length || 0) > 0 ||
    (activeFilters.features?.length || 0) > 0;

  return (
    <aside className="p-0">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-accent-purple">Filters</h3>
        {hasActiveFilters && (
          <Link
            href={getClearFiltersHref()}
            scroll={false}
            prefetch={false}
            aria-label="Clear filters"
            title="Clear filters"
            className="inline-flex items-center justify-center rounded-md p-1 text-text-muted hover:text-text-primary hover:bg-bg-card-hover transition-colors"
          >
            <FilterX className="h-4 w-4" />
          </Link>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["genres", "settings", "platforms", "features"]}
      >
        {filterGroups.map((group) => (
          <AccordionItem
            key={group.key}
            value={group.key}
            className="border-border-main/50"
          >
            <AccordionTrigger className="py-5 text-xs font-black text-accent-purple hover:text-text-primary hover:no-underline">
              {group.name}
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="flex flex-col gap-2">
                {group.options.map((option) => {
                  const currentValues = activeFilters[group.key] || [];
                  const isChecked = currentValues.includes(option.slug);
                  const nextValues = isChecked
                    ? currentValues.filter((v) => v !== option.slug)
                    : [...currentValues, option.slug];
                  const nextFilters = { ...activeFilters, [group.key]: nextValues };
                  const href = getFiltersHref(nextFilters);

                  return (
                    <Link
                      key={option.slug}
                      href={href}
                      scroll={false}
                      prefetch={false}
                      onClick={() => setActiveFilters(nextFilters)}
                      className="flex cursor-pointer items-center gap-2 text-xs font-normal text-text-primary transition-colors hover:text-text-muted"
                    >
                      <Checkbox
                        id={`${group.key}-${option.slug}`}
                        checked={isChecked}
                        aria-hidden="true"
                        tabIndex={-1}
                        className="pointer-events-none"
                      />
                      <span className="flex-1">{option.name}</span>
                      <span className="text-xs text-text-secondary">
                        ({option.count})
                      </span>
                    </Link>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
