/**
 * Filter types based on official API specification
 */

// Filter option (single item in filter list)
export interface IFilterOption {
  slug: string;
  name: string;
  count: number;
}

// All filters (GET /api/filters)
export interface IFilters {
  genres: IFilterOption[];
  settings: IFilterOption[];
  platforms: IFilterOption[];
  features: IFilterOption[];
}

// Applied filters state
export interface IAppliedFilters {
  genres?: string[];
  settings?: string[];
  platforms?: string[];
  features?: string[];
}
