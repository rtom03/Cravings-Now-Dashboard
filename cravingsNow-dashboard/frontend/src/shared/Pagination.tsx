import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getPageList } from "../utils/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * Purely presentational — takes page/totalPages/pageSize and change
 * callbacks, renders nothing else. Works with any list; the caller owns
 * the actual data slicing (see usePagination).
 */
export function Pagination({
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pages = getPageList(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1.5 text-[12.5px] text-slate-500"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[12.5px] font-medium transition ${
              p === page
                ? "border border-sky-500 text-sky-400"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </button>

      <div className="relative ml-1">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-7 appearance-none rounded-md border border-white/10 bg-[#12151b] pl-2.5 pr-6 text-[12.5px] text-slate-300 focus:border-sky-500/60 focus:outline-none"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}
