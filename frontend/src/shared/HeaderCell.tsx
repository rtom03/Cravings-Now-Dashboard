import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { FilterDropdown, FilterOption } from "./FilterDropDown";

export interface Product {
  id: string;
  name: string;
  nameLocalized?: string | null;
  image?: string | null;
  isActive: boolean;
  category: { name: string };
}
export type Column = {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
  sticky?: boolean;
  filterable?: boolean;
  /**
   * How to read a sortable value off a Product row. Sorting by header key
   * directly against the row object (e.g. `row["en"]`) only works if the
   * header key happens to match the data field name — it doesn't here
   * ("en"/"ar" vs. "name"/"nameLocalized"), so each sortable column
   * declares its own accessor instead.
   */
  sortAccessor?: (row: Product) => string | number;
  /** How to read this column's filter value off a row (for the checkbox filter). */
  filterAccessor?: (row: Product) => string;
  /** Computes the checkbox list from the full (unfiltered) row set, so options don't disappear as filters are applied. */
  filterOptions?: (allRows: Product[]) => FilterOption[];
};

export type SortDir = "asc" | "desc";

type HeaderCellProps = {
  col: Column;
  sort: { key: string | null; dir: SortDir };
  onSort: (key: string) => void;
  style: { minWidth: string };
  filterOptions: FilterOption[];
  activeFilter: string[];
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  onApplyFilter: (next: string[]) => void;
  onCloseFilter: () => void;
};

export default function HeaderCell({
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
}: HeaderCellProps) {
  const hasActiveFilter = activeFilter.length > 0;

  function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    return (
      <span className="ml-1 inline-flex flex-col leading-none -space-y-1 align-middle">
        <ChevronUp
          size={11}
          className={
            active && dir === "asc" ? "text-sky-400" : "text-slate-600"
          }
          strokeWidth={3}
        />
        <ChevronDown
          size={11}
          className={
            active && dir === "desc" ? "text-sky-400" : "text-slate-600"
          }
          strokeWidth={3}
        />
      </span>
    );
  }

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
