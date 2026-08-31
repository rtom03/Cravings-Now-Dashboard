import { ChevronDown, History, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "../../shared/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useHorizontalScrollProgress } from "../../shared/ScrollIndicator";
import { SortDir } from "../../shared/HeaderCell";
import { toBranchWithProducts } from "../../types/type";
import { useBranchStore } from "../../store/branchStore";
import { BR_PRD_COLUMNS } from "../../utils/data.index";
import { HeaderCell } from "../../shared/TableHeaderCell";
import { Product } from "../../types/compo.type";

function Toggle({ on }: { on: boolean }) {
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

function Dash() {
  return <span className="text-slate-500">–</span>;
}

export default function ProductsCatalog({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);
  const [sort, setSort] = useState<{ key: string | null; dir: SortDir }>({
    key: null,
    dir: "asc",
  });
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  // const setSelected = useBranchStore((state) => state.setSelectedBranch);
  const selectedBranch = useBranchStore((state) => state.selectedBranch);

  // console.log(selectedBranch);

  const products = useMemo(() => {
    if (!selectedBranch) return [];

    return toBranchWithProducts(selectedBranch).products;
  }, [selectedBranch]);

  // const map = selectedBranch
  //   ? toBranchWithProducts(selectedBranch!)
  //   : { products: [] as Product[] };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    let r: Product[] = q
      ? products.filter((row) => {
          return (
            row.name.toLowerCase().includes(q) ||
            (row.nameLocalized ?? "").toLowerCase().includes(q) ||
            row.category.name.toLowerCase().includes(q)
          );
        })
      : products;

    for (const col of BR_PRD_COLUMNS) {
      const activeValues = filters[col.key];
      if (col.filterAccessor && activeValues && activeValues.length > 0) {
        const allowed = new Set(activeValues);
        r = r.filter((row) => allowed.has(col.filterAccessor!(row)));
      }
    }

    if (sort.key) {
      const col = BR_PRD_COLUMNS.find((c) => c.key === sort.key);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sort, filters, products]);

  const { page, setPage, pageSize, setPageSize, totalPages, paginated } =
    usePagination(rows ?? [], 10);

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

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    const nextChecked: Record<string, boolean> = {};
    paginated.forEach((r) => {
      nextChecked[r.id] = next;
    });
    setCheckedRows(nextChecked);
  };

  const toggleRow = (id: string) => {
    setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tableScrollRef = useRef<HTMLDivElement>(null);
  const scrollRatio = useHorizontalScrollProgress(tableScrollRef);

  if (!open) return null;
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Location&rsquo;s catalog
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <button className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
            <Plus size={15} />
            Add products
          </button>
          <div className="flex w-full max-w-xs items-center overflow-hidden rounded-md border border-white/10 bg-[#12151b] focus-within:border-sky-500/60">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a product"
              className="w-full bg-transparent px-3 py-2 text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <button className="flex h-full items-center bg-sky-500 px-3 py-2.5 text-white hover:bg-sky-400">
              <Search size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        ref={tableScrollRef}
        className="flex-1  overflow-auto border-t border-white/10 px-0"
      >
        <table className="w-full min-w-[1700px] border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="sticky top-0 z-10 border-b border-white/10 bg-[#12151b] px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 accent-sky-500"
                />
              </th>
              {BR_PRD_COLUMNS.slice(1).map((col) => (
                <HeaderCell
                  key={col.key}
                  col={col}
                  sort={sort}
                  onSort={handleSort}
                  style={{ minWidth: col.width }}
                  filterOptions={
                    col.filterOptions ? col.filterOptions(products ?? []) : []
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
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-white/[0.06] transition hover:bg-white/[0.03] ${
                  i % 2 === 1 ? "bg-white/[0.015]" : ""
                }`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={!!checkedRows[row.id]}
                    onChange={() => toggleRow(row.id)}
                    className="h-3.5 w-3.5 accent-sky-500"
                  />
                </td>
                <td className="px-3 py-3">
                  {row.image ? (
                    <img
                      src={row.image}
                      alt={row.name}
                      className="h-9 w-9 rounded object-cover"
                    />
                  ) : (
                    <Dash />
                  )}
                </td>
                <td className="px-3 py-3">
                  <Toggle on={row.isActive} />
                </td>
                <td className="px-3 py-3 text-slate-300">
                  {row.category.name}
                </td>
                <td className="px-3 py-3 font-medium text-slate-100">
                  {row.name}
                </td>

                <td className="px-3 py-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                    Produced
                  </span>
                </td>
                <td className="px-3 py-3">
                  <Dash />
                </td>
                <td className="px-3 py-3">
                  <Dash />
                </td>
                <td className="px-3 py-3">
                  <Dash />
                </td>
                <td className="px-3 py-3">
                  <Dash />
                </td>
                <td className="px-3 py-3">
                  {row.nameLocalized === null ? (
                    <Dash />
                  ) : (
                    <input
                      type="checkbox"
                      checked={row.isActive}
                      readOnly
                      className="h-3.5 w-3.5 accent-sky-500"
                    />
                  )}
                </td>
                <td className="px-3 py-3">
                  <Dash />
                </td>
                <td className="px-3 py-3">
                  <button className="flex w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-[#12151b] px-3 py-1.5 text-[12.5px] text-slate-400 hover:border-white/20">
                    Select a period
                    <ChevronDown size={13} />
                  </button>
                </td>
                <td className="px-3 py-3">
                  <button className="rounded-md bg-sky-500 px-3 py-1.5 text-[12.5px] font-medium text-white hover:bg-sky-400">
                    Edit
                  </button>
                </td>
                <td className="px-3 py-3">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-rose-400 hover:bg-rose-500/10">
                    <Trash2 size={15} />
                  </button>
                </td>
                <td className="px-3 py-3">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-sky-400 hover:bg-sky-500/10">
                    <History size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {rows?.length === 0 && (
              <tr>
                <td
                  colSpan={BR_PRD_COLUMNS.length}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No products match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: scroll indicator + pagination + cancel */}
      <div className="space-y-3 border-t border-white/10 px-6 py-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-white/10 px-4 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
