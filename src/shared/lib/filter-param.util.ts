export const FILTER_PARAM_SEPARATOR = "__";

export function parseFilterParam(value: string | null | undefined): string[] {
  if (value == null || value === "") return [];
  return value.split(FILTER_PARAM_SEPARATOR).map((s) => s.trim()).filter(Boolean);
}

export function buildFilterParam(values: string[]): string {
  return values.filter(Boolean).join(FILTER_PARAM_SEPARATOR);
}
