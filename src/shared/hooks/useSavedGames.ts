"use client";

import { useCallback, useEffect, useState } from "react";
import { getSavedGameSlugs, toggleSavedGame } from "@/shared/lib/saved-games.util";

export function useSavedGames() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSavedSlugs(getSavedGameSlugs());
  }, []);

  const handleToggle = useCallback((slug: string) => {
    const next = toggleSavedGame(slug);
    setSavedSlugs(next);
  }, []);

  const isSaved = useCallback(
    (slug: string) => savedSlugs.includes(slug),
    [savedSlugs]
  );

  return {
    savedSlugs,
    isSaved,
    toggle: handleToggle,
  };
}

