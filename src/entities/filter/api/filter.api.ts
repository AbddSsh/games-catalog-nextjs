import type { IFilters } from "../model/filter.types";
import { apiGet } from "@/shared/api";

export async function getFilters(locale: string, category?: string): Promise<IFilters> {
  return apiGet<IFilters>("/filters", {
    locale,
    params: category ? { category } : undefined,
  });
}
