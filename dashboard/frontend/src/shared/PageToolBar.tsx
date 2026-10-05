import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PageToolbarTab<T extends string = string> {
  key: T;
  label: string;
}

export interface PageToolbarProps<T extends string = string> {
  title: string;
  /** Small icon next to the title. Defaults to a help-circle glyph. */
  icon?: LucideIcon;

  tabs: PageToolbarTab<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;

  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  /** Omit to hide the filter button entirely. */
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;

  actionsLabel?: string;
  /** Omit to hide the actions button entirely. */
  onActionsClick?: () => void;

  /** Omit the whole prev/next cluster by leaving both handlers undefined. */
  onPrevPage?: () => void;
  onNextPage?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PageToolbar<T extends string = string>({
  title,
  icon: Icon = HelpCircle,
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  onFilterClick,
  hasActiveFilters = false,
  actionsLabel = "Actions +",
  onActionsClick,
  onPrevPage,
  onNextPage,
  canGoPrev = true,
  canGoNext = true,
}: PageToolbarProps<T>) {
  const showPagination = onPrevPage !== undefined || onNextPage !== undefined;

  return (
    <div className="border-b border-white/10">
      {/* Title row */}
      <div className="flex items-center gap-2 px-6 py-4">
        <Icon size={16} className="text-slate-500" />
        <h1 className="text-[15px] font-semibold text-slate-100">{title}</h1>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10  py-3">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition ${
                activeTab === tab.key
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                  : "border border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter / search / actions / pagination */}
        <div className="flex items-center gap-2">
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              aria-label="Filters"
              className={`flex h-9 w-9 items-center justify-center rounded-md border transition ${
                hasActiveFilters
                  ? "border-sky-500/60 bg-sky-500/10 text-sky-400"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <Filter size={14} />
            </button>
          )}

          <div className="flex w-56 items-center overflow-hidden rounded-md border border-white/10 bg-[#12151b] transition focus-within:border-sky-500/60">
            <input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent px-3 py-2 text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              aria-label="Search"
              className="flex h-full items-center bg-sky-500 px-3 py-2 text-white transition hover:bg-sky-400"
            >
              <Search size={14} />
            </button>
          </div>

          {onActionsClick && (
            <button
              onClick={onActionsClick}
              className="whitespace-nowrap rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400"
            >
              {actionsLabel}
            </button>
          )}

          {showPagination && (
            <div className="flex items-center overflow-hidden rounded-md border border-white/10">
              <button
                onClick={onPrevPage}
                disabled={!canGoPrev}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center text-slate-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={onNextPage}
                disabled={!canGoNext}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center border-l border-white/10 text-slate-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
