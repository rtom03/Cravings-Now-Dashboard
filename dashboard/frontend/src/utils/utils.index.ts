import { FilterOption } from "../types/compo.type";

export function uniqueOptions(values: string[]): FilterOption[] {
  return Array.from(new Set(values))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((v) => ({ value: v, label: v }));
}
