"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Checkbox,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";
import type { IFilters, IAppliedFilters } from "@/entities/filter";

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
  const router = useRouter();
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

  const pushFiltersToUrl = useCallback(
    (filters: IAppliedFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("genres");
      params.delete("settings");
      params.delete("platforms");
      params.delete("features");
      params.delete("page");
      // Clear search query when filters are applied
      params.delete("q");
      if (filters.genres?.length) params.set("genres", filters.genres.join(","));
      if (filters.settings?.length) params.set("settings", filters.settings.join(","));
      if (filters.platforms?.length) params.set("platforms", filters.platforms.join(","));
      if (filters.features?.length) params.set("features", filters.features.join(","));
      const queryString = params.toString();
      router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ""}`);
    },
    [router, searchParams, locale]
  );

  const handleFilterChange = useCallback(
    (groupKey: keyof IAppliedFilters, value: string, checked: boolean) => {
      const currentValues = activeFilters[groupKey] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      const next = { ...activeFilters, [groupKey]: newValues };
      setActiveFilters(next);
      pushFiltersToUrl(next);
    },
    [activeFilters, pushFiltersToUrl]
  );

  const clearFilters = useCallback(() => {
    setActiveFilters({
      genres: [],
      settings: [],
      platforms: [],
      features: [],
    });
    // Preserve search query if any
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    const queryString = params.toString();
    router.push(`/${locale}/catalog${queryString ? `?${queryString}` : ""}`);
  }, [router, locale, searchParams]);

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
          <span
            onClick={clearFilters}
            className="cursor-pointer text-xs text-text-muted hover:text-text-primary"
          >
            Clear all
          </span>
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

                  return (
                    <label
                      key={option.slug}
                      className="flex cursor-pointer items-center gap-2 text-xs font-normal text-text-primary transition-colors hover:text-text-muted"
                    >
                      <Checkbox
                        id={`${group.key}-${option.slug}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleFilterChange(
                            group.key,
                            option.slug,
                            checked as boolean
                          )
                        }
                      />
                      <span className="flex-1">{option.name}</span>
                      <span className="text-xs text-text-secondary">
                        ({option.count})
                      </span>
                    </label>
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
