/**
 * Computes which page numbers to display, with "..." gaps, matching the
 * reference design: near the start it shows the first five pages then a
 * gap then the last page (e.g. `1 2 3 4 5 … 12`), mirrored near the end,
 * and a small window around the current page in the middle.
 *
 * Pure function — no component/render dependency, easy to unit test on
 * its own and reusable by any paginated list, not just this table.
 */
export function getPageList(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}
