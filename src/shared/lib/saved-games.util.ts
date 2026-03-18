const LOCAL_STORAGE_KEY = "saved_games";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSavedGameSlugs(): string[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "string");
  } catch {
    return [];
  }
}

export function isGameSaved(slug: string): boolean {
  return getSavedGameSlugs().includes(slug);
}

export function toggleSavedGame(slug: string): string[] {
  if (!isBrowser()) return [];

  const current = getSavedGameSlugs();
  const exists = current.includes(slug);
  const next = exists ? current.filter((s) => s !== slug) : [...current, slug];

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore write errors
  }

  return next;
}

