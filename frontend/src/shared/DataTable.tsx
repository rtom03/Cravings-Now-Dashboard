import { useMemo, useState } from "react";
import { HeaderCell, PlainHeaderCell, type Column } from "./TableHeaderCell";
import type { FilterOption } from "../shared/FilterDropDown";

// ─── Column contract ────────────────────────────────────────────────────────
// Extends the existing generic Column<T> (sort/filter contract already
// shared with WorkingHoursTab) with the two things a fully generic table
// needs on top: how to render a cell, and what a loading placeholder for
// that cell should look like.

export type SkeletonVariant =
  | "checkbox"
  | "avatar"
  | "toggle"
  | "badge"
  | "text"
  | "text-wide"
  | "dash"
  | "dropdown"
  | "button"
  | "icon";

export interface DataTableColumn<T> extends Omit<Column<T>, "label"> {
  label: string;
  align?: "left" | "center" | "right";
  /** Cell content for a real row. */
  render: (row: T, rowIndex: number) => React.ReactNode;
  /** Shape of the shimmer placeholder while `loading` is true. Defaults to "text". */
  skeletonVariant?: SkeletonVariant;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  minWidth?: string;
  loading?: boolean;
  loadingRows?: number;
  error?: string | null;
  emptyMessage?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
}

// ─── Shimmer (shared with CatalogTableSkeleton's visual language) ──────────

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/[0.06] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[skeletonSweep_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

function SkeletonCell({ variant = "text" }: { variant?: SkeletonVariant }) {
  switch (variant) {
    case "checkbox":
      return <Shimmer className="h-3.5 w-3.5 rounded-[4px]" />;
    case "avatar":
      return <Shimmer className="h-9 w-9 !rounded-full" />;
    case "toggle":
      return <Shimmer className="h-5 w-5 !rounded-full" />;
    case "badge":
      return <Shimmer className="h-[22px] w-16 !rounded-full" />;
    case "text":
      return <Shimmer className="h-3.5 w-20" />;
    case "text-wide":
      return <Shimmer className="h-3.5 w-32" />;
    case "dropdown":
      return <Shimmer className="h-8 w-full max-w-[150px]" />;
    case "button":
      return <Shimmer className="h-7 w-14" />;
    case "icon":
      return <Shimmer className="h-7 w-7" />;
    case "dash":
    default:
      return <Shimmer className="h-3.5 w-6" />;
  }
}

function alignClass(align: DataTableColumn<any>["align"]) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

// ─── Table ──────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  rowKey,
  minWidth = "100%",
  loading = false,
  loadingRows = 8,
  error = null,
  emptyMessage = "No results found.",
  selectable = false,
  onSelectionChange,
  className = "",
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string | null; dir: "asc" | "desc" }>(
    {
      key: null,
      dir: "asc",
    },
  );
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);

  const rows = useMemo(() => {
    let r = data;

    for (const col of columns) {
      const active = filters[col.key];
      if (col.filterAccessor && active && active.length > 0) {
        const allowed = new Set(active);
        r = r.filter((row) => allowed.has(col.filterAccessor!(row)));
      }
    }

    if (sort.key) {
      const col = columns.find((c) => c.key === sort.key);
      const accessor = col?.sortAccessor;
      if (accessor) {
        r = [...r].sort((a, b) => {
          const av = accessor(a);
          const bv = accessor(b);
          if (av < bv) return sort.dir === "asc" ? -1 : 1;
          if (av > bv) return sort.dir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }

    return r;
  }, [data, columns, filters, sort]);

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const applyFilter = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    setOpenFilterKey(null);
  };

  const emitSelection = (map: Record<string, boolean>) => {
    onSelectionChange?.(Object.keys(map).filter((id) => map[id]));
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    const map: Record<string, boolean> = {};
    rows.forEach((r) => (map[rowKey(r)] = next));
    setCheckedRows(map);
    emitSelection(map);
  };

  const toggleRow = (id: string) => {
    setCheckedRows((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      emitSelection(next);
      return next;
    });
  };

  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div
      className={`flex-1 overflow-auto border-t border-white/10 ${className}`}
    >
      <table
        className="w-full border-collapse text-[13px]"
        style={{ minWidth }}
      >
        <thead>
          <tr>
            {selectable && (
              <th className="sticky top-0 z-10 border-b border-white/10 bg-[#12151b] px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  disabled={loading}
                  className="h-3.5 w-3.5 accent-sky-500"
                />
              </th>
            )}
            {columns.map((col) =>
              col.sortable || col.filterable ? (
                <HeaderCell
                  key={col.key}
                  col={col}
                  sort={sort}
                  onSort={handleSort}
                  style={{ minWidth: col.width }}
                  filterOptions={
                    col.filterOptions
                      ? col.filterOptions(data)
                      : ([] as FilterOption[])
                  }
                  activeFilter={filters[col.key] ?? []}
                  isFilterOpen={openFilterKey === col.key}
                  onToggleFilter={() =>
                    setOpenFilterKey((prev) =>
                      prev === col.key ? null : col.key,
                    )
                  }
                  onApplyFilter={(values) => applyFilter(col.key, values)}
                  onCloseFilter={() => setOpenFilterKey(null)}
                />
              ) : (
                <PlainHeaderCell
                  key={col.key}
                  label={col.label}
                  width={col.width}
                  align={col.align === "left" ? "left" : "center"}
                />
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <tr
                key={i}
                className={`border-b border-white/[0.06] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}
              >
                {selectable && (
                  <td className="px-3 py-3">
                    <Shimmer className="h-3.5 w-3.5 rounded-[4px]" />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-3 ${alignClass(col.align)}`}
                  >
                    <div
                      className={`flex ${col.align === "center" ? "justify-center" : "items-center"}`}
                    >
                      <SkeletonCell variant={col.skeletonVariant} />
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : error ? (
            <tr>
              <td
                colSpan={colSpan}
                className="px-6 py-10 text-center text-sm text-rose-400"
              >
                {error}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={colSpan}
                className="px-6 py-10 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const id = rowKey(row);
              return (
                <tr
                  key={id}
                  className={`border-b border-white/[0.06] transition hover:bg-white/[0.03] ${
                    i % 2 === 1 ? "bg-white/[0.015]" : ""
                  }`}
                >
                  {selectable && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={!!checkedRows[id]}
                        onChange={() => toggleRow(id)}
                        className="h-3.5 w-3.5 accent-sky-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-3 ${alignClass(col.align)}`}
                    >
                      {col.render(row, i)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <style>{`
        @keyframes skeletonSweep {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// ─── Small shared cell primitives ──────────────────────────────────────────
// Common enough across tables (Catalog's On/Off, Delivery Areas' On/Off,
// any future toggle column) that they belong here rather than being
// redefined per table file.

export function ToggleCell({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
        on ? "bg-emerald-500" : "bg-slate-600"
      }`}
      aria-label={on ? "Enabled" : "Disabled"}
    >
      {on ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-slate-950" fill="none">
          <path
            d="M2 6.2L4.7 9 10 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span className="h-2 w-2 rounded-full bg-slate-400" />
      )}
    </span>
  );
}

export function DashCell() {
  return <span className="text-slate-500">–</span>;
}
