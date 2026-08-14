import { ChevronUp, ChevronDown, Filter } from "lucide-react";
import { FilterDropdown, type FilterOption } from "../shared/FilterDropDown";

export type SortDir = "asc" | "desc";

// ─── Generic column shape ───────────────────────────────────────────────────
// Same contract MenuModal's Column type already had, just parameterized
// over the row type <T> instead of being locked to Product. Any table that
// wants sortable/filterable headers with this exact visual language can
// declare its own Column<Row>[] and reuse HeaderCell as-is.

export interface Column<T> {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
  sticky?: boolean;
  filterable?: boolean;
  sortAccessor?: (row: T) => string | number;
  filterAccessor?: (row: T) => string;
  filterOptions?: (allRows: T[]) => FilterOption[];
}

export function uniqueOptions(values: string[]): FilterOption[] {
  return Array.from(new Set(values))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((v) => ({ value: v, label: v }));
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="ml-1 inline-flex flex-col leading-none -space-y-1 align-middle">
      <ChevronUp
        size={11}
        className={active && dir === "asc" ? "text-sky-400" : "text-slate-600"}
        strokeWidth={3}
      />
      <ChevronDown
        size={11}
        className={active && dir === "desc" ? "text-sky-400" : "text-slate-600"}
        strokeWidth={3}
      />
    </span>
  );
}

export interface HeaderCellProps<T> {
  col: Column<T>;
  sort: { key: string | null; dir: SortDir };
  onSort: (key: string) => void;
  style: { minWidth: string };
  filterOptions: FilterOption[];
  activeFilter: string[];
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  onApplyFilter: (next: string[]) => void;
  onCloseFilter: () => void;
}

export function HeaderCell<T>({
  col,
  sort,
  onSort,
  style,
  filterOptions,
  activeFilter,
  isFilterOpen,
  onToggleFilter,
  onApplyFilter,
  onCloseFilter,
}: HeaderCellProps<T>) {
  const hasActiveFilter = activeFilter.length > 0;

  return (
    <th
      style={style}
      className="sticky top-0 z-10 border-b border-white/10 bg-[#12151b] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400"
    >
      <div className="relative flex items-center gap-1">
        <div
          className={`flex items-center gap-1 ${
            col.sortable
              ? "cursor-pointer select-none hover:text-slate-200"
              : ""
          }`}
          onClick={() => col.sortable && onSort(col.key)}
        >
          <span className="normal-case text-[12.5px] text-slate-300">
            {col.label}
          </span>
          {col.sortable && (
            <SortIcon active={sort.key === col.key} dir={sort.dir} />
          )}
        </div>

        {col.filterable && (
          <button
            onClick={onToggleFilter}
            aria-label={`Filter ${col.label}`}
            className={`ml-0.5 rounded p-0.5 hover:bg-white/5 ${
              hasActiveFilter
                ? "text-sky-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Filter size={12} />
          </button>
        )}

        {col.filterable && isFilterOpen && (
          <FilterDropdown
            options={filterOptions}
            selected={activeFilter}
            onApply={onApplyFilter}
            onClose={onCloseFilter}
          />
        )}
      </div>
    </th>
  );
}

// ─── Plain (non-interactive) header cell ───────────────────────────────────
// Working Hours only needs sort/filter on the Day column — Start, End,
// Maximum number of orders, and Controls are static labels. Rather than
// forcing every column through the full sortable/filterable machinery,
// this covers the "just a label" case with the same visual treatment.

export function PlainHeaderCell({
  label,
  width,
  align = "left",
}: {
  label: string;
  width: string;
  align?: "left" | "center";
}) {
  return (
    <th
      style={{ minWidth: width }}
      className={`sticky top-0 z-10 border-b border-white/10 bg-[#12151b] px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <span className="normal-case text-[12.5px] text-slate-300">{label}</span>
    </th>
  );
}
