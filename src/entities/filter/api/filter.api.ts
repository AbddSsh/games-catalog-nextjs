import type { IFilters } from "../model/filter.types";

export async function getFilters(locale: string, category?: string): Promise<IFilters> {
  const { apiGet } = await import("@/shared/api");
  return apiGet<IFilters>("/filters", {
    locale,
    params: category ? { category } : undefined,
  });
}
