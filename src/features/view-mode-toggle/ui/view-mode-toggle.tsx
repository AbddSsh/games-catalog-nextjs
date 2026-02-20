/**
 * View Mode Toggle Component
 * Toggle between grid and list view
 */

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/shared/lib";

export type TViewMode = "grid" | "list";

interface IViewModeToggleProps {
  currentMode: TViewMode;
  className?: string;
}

export function ViewModeToggle({ currentMode, className }: IViewModeToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleModeChange = (mode: TViewMode) => {
    if (mode === currentMode) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => handleModeChange("grid")}
        className={cn(
          "p-1 transition-colors",
          currentMode === "grid"
            ? "text-text-primary"
            : "text-text-muted hover:text-text-primary"
        )}
        aria-label="Grid view"
        aria-pressed={currentMode === "grid"}
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleModeChange("list")}
        className={cn(
          "p-1 transition-colors",
          currentMode === "list"
            ? "text-text-primary"
            : "text-text-muted hover:text-text-primary"
        )}
        aria-label="List view"
        aria-pressed={currentMode === "list"}
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  );
}
