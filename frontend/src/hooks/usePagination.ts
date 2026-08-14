import { useEffect, useMemo, useState } from "react";

/**
 * Generic client-side pagination over any array. Not tied to the catalog
 * table specifically — pass it any list and a page size.
 *
 * Self-clamping: if `items` shrinks (e.g. a filter removes rows) such that
 * the current page no longer exists, it steps back to the last valid page
 * automatically, rather than the caller having to remember to reset it on
 * every filter/search/sort change.
 */
export function usePagination<T>(items: T[], initialPageSize = 25) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPage(1);
  };

  return { page, setPage, pageSize, setPageSize, totalPages, paginated };
}
