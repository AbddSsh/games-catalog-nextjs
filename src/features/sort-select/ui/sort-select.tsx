"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

export type TSortOption = "recommended" | "newest" | "popular" | "name";

interface ISortOption {
  value: TSortOption;
  label: string;
}

const SORT_OPTIONS: ISortOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "name", label: "Name A-Z" },
];

interface ISortSelectProps {
  currentSort: TSortOption;
  className?: string;
}

export function SortSelect({ currentSort, className }: ISortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: TSortOption) => {
    if (value === currentSort) return;

    const params = new URLSearchParams(searchParams.toString());
    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Recommended";

  return (
    <div className={className}>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="h-9 w-auto gap-2 border-border-main bg-transparent text-text-secondary hover:text-text-primary">
          <span className="text-text-muted">First:</span>
          <SelectValue>{currentLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="border-border-main bg-bg-card">
          {SORT_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-text-secondary hover:bg-bg-card-hover hover:text-text-primary focus:bg-bg-card-hover focus:text-text-primary"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
