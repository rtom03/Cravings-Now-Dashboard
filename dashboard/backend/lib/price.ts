// lib/price.ts

/**
 * Parses any raw price input into a safe numeric value.
 * Handles strings with commas/currency symbols, empty input, null/undefined,
 * and negative-guard (prices can't go below 0).
 */
export function parsePrice(raw: string | number | null | undefined): number {
  if (raw === null || raw === undefined || raw === "") return 0;

  const numeric =
    typeof raw === "number"
      ? raw
      : Number(raw.toString().replace(/[^0-9.-]/g, ""));

  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, numeric);
}

/**
 * Formats a numeric price to exactly 2 decimal places for display,
 * e.g. 15000 -> "15000.00", 15000.5 -> "15000.50".
 */
export function formatPrice(value: string | number | null | undefined): string {
  return parsePrice(value).toFixed(2);
}
