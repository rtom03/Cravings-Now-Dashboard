import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AreaRow {
  country: string;
  province: string;
  area: string;
  arabicName: string;
  numberOfBranches: number;
}

type SortKey = keyof AreaRow;
type SortDir = "asc" | "desc";

interface SortState {
  key: SortKey;
  dir: SortDir;
}

interface HelpCenterTableProps {
  rows: AreaRow[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SortIcons = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <span className="flex flex-col gap-0 ml-1">
    <ChevronUp
      size={9}
      className={active && dir === "asc" ? "text-sky-500" : "text-gray-300"}
    />
    <ChevronDown
      size={9}
      className={active && dir === "desc" ? "text-sky-500" : "text-gray-300"}
    />
  </span>
);

interface ThProps {
  label: string;
  sortKey: SortKey;
  current: SortState | null;
  onSort: (key: SortKey) => void;
  align?: "left" | "center" | "right";
}

const Th = ({ label, sortKey, current, onSort, align = "left" }: ThProps) => {
  const active = current?.key === sortKey;
  return (
    <th
      className={`px-4 py-3 text-[12px] font-medium text-gray-500 whitespace-nowrap select-none text-${align}`}
    >
      <button
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-0.5 bg-transparent border-none cursor-pointer p-0 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        {label}
        <SortIcons active={active} dir={current?.dir ?? "asc"} />
      </button>
    </th>
  );
};

const LinkCell = ({ value }: { value: string }) => (
  <td className="px-4 py-3.5 text-[13px] text-sky-500 cursor-pointer hover:underline">
    {value}
  </td>
);

const TextCell = ({ value }: { value: string }) => (
  <td className="px-4 py-3.5 text-[13px] text-gray-500">{value}</td>
);

const NumberCell = ({ value }: { value: number }) => (
  <td className="px-4 py-3.5 text-[13px] text-gray-500 text-center">{value}</td>
);

interface TableRowProps {
  row: AreaRow;
}

const TableRow = ({ row }: TableRowProps) => (
  <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
    <LinkCell value={row.country} />
    <LinkCell value={row.province} />
    <TextCell value={row.area} />
    <TextCell value={row.arabicName} />
    <NumberCell value={row.numberOfBranches} />
  </tr>
);

const EmptyRow = ({ query }: { query: string }) => (
  <tr>
    <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-gray-400">
      {query ? `No results for "${query}"` : "No data available"}
    </td>
  </tr>
);

// ─── Root component ───────────────────────────────────────────────────────────

export const HelpCenterTable = ({ rows }: HelpCenterTableProps) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const processed = useMemo(() => {
    const q = query.toLowerCase();
    let result = q
      ? rows.filter(
          (r) =>
            r.area.toLowerCase().includes(q) ||
            r.province.toLowerCase().includes(q) ||
            r.country.toLowerCase().includes(q),
        )
      : rows;

    if (sort) {
      const { key, dir } = sort;
      result = [...result].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return dir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [rows, query, sort]);

  return (
    <div className="p-5 bg-[var(--bg)] min-h-screen">
      <h1 className="text-[15px] font-medium text-[var(--text)] mb-3">
        Help Center
      </h1>

      {/* Search */}
      <div className="flex mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an area"
          className="text-[12px] px-3 py-1.5 border border-gray-300 border-r-0 rounded-l-md outline-none w-48 bg-white text-gray-700 placeholder:text-gray-400"
        />
        <button className="bg-sky-500 hover:bg-sky-600 transition-colors px-3 rounded-r-md flex items-center justify-center border-none cursor-pointer">
          <Search size={14} className="text-white" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <Th
                label="Country"
                sortKey="country"
                current={sort}
                onSort={handleSort}
              />
              <Th
                label="Province"
                sortKey="province"
                current={sort}
                onSort={handleSort}
              />
              <Th
                label="Area"
                sortKey="area"
                current={sort}
                onSort={handleSort}
              />
              <Th
                label="Arabic name"
                sortKey="arabicName"
                current={sort}
                onSort={handleSort}
              />
              <Th
                label="Number of branches"
                sortKey="numberOfBranches"
                current={sort}
                onSort={handleSort}
                align="center"
              />
            </tr>
          </thead>
          <tbody>
            {processed.length > 0 ? (
              processed.map((row, i) => <TableRow key={i} row={row} />)
            ) : (
              <EmptyRow query={query} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_ROWS: AreaRow[] = [
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Abijo",
    arabicName: "Abijo",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Abraham Adesanya",
    arabicName: "Abraham Adesanya",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Abule Egba",
    arabicName: "Abule Egba",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Abule Ijesha",
    arabicName: "Abule Ijesha",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Abule Oja",
    arabicName: "Abule Oja",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Abuja",
    area: "Aco",
    arabicName: "Aco",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Adeniyi Jones",
    arabicName: "Adeniyi Jones",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Agege",
    arabicName: "Agege",
    numberOfBranches: 2,
  },
  {
    country: "Nigeria",
    province: "Abuja",
    area: "Apo",
    arabicName: "Apo",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Badagry",
    arabicName: "Badagry",
    numberOfBranches: 1,
  },
  {
    country: "Nigeria",
    province: "Lagos",
    area: "Berger",
    arabicName: "Berger",
    numberOfBranches: 3,
  },
  {
    country: "Nigeria",
    province: "Abuja",
    area: "Central Business District",
    arabicName: "Central Business District",
    numberOfBranches: 2,
  },
];

// ─── Entry point ───────────────────────────────────────────────────────────────

export default function HelpTable() {
  return <HelpCenterTable rows={SAMPLE_ROWS} />;
}
