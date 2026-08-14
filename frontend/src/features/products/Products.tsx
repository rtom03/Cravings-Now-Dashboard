import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Filter,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Image,
  Pencil,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabKey = "categories" | "products" | "modifiers" | "more";

// Column definition — each tab declares its own column list
export interface ColDef<T = Record<string, unknown>> {
  key: string;
  label: string;
  type:
    | "check"
    | "thumb"
    | "toggle"
    | "sortOrder"
    | "nameInput"
    | "text"
    | "count"
    | "minOrderValue"
    | "addButton"
    | "price"
    | "stock"
    | "badge"
    | "editAction"
    | "deleteAction"
    | "modal";
  center?: boolean;
  getValue?: (row: T) => unknown;
}

// ─── Per-tab data shapes ───────────────────────────────────────────────────────

export interface CategoryRow {
  id: string;
  icon?: string;
  on: boolean;
  sort: number;
  name: string;
  arabicName: string;
  products: number;
  minOrderValue: number;
}

export interface ProductRow {
  id: string;
  status: "active" | "draft";
  name: string;
  arabicName: string;
  category: string;
  price: string;
  stock: number;
  on: boolean;
}

export interface ModifierRow {
  id: string;
  name: string;
  arabicName: string;
  type: string;
  required: boolean;
  min: number;
  max: number;
  options: number;
}

export interface MoreRow {
  id: string;
  name: string;
  arabicName: string;
  type: string;
  status: "active" | "draft";
}

export interface TabConfig<T> {
  label: string;
  columns: ColDef<T>[];
  rows: T[];
}

export interface ProductsPageProps {
  categories: TabConfig<CategoryRow>;
  products: TabConfig<ProductRow>;
  modifiers: TabConfig<ModifierRow>;
  more: TabConfig<MoreRow>;
}

// ─── Cell renderers ───────────────────────────────────────────────────────────

const ThumbCell = ({ src }: { src?: string }) => (
  <td className="px-3 py-2">
    <div className="w-12 h-12 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <Image size={18} className="text-gray-300" />
      )}
    </div>
  </td>
);

const ToggleCell = ({ value }: { value: boolean }) => {
  const [on, setOn] = useState(value);
  return (
    <td className="px-3 py-2 text-center">
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`w-8 h-4.5 rounded-full flex items-center px-0.5 cursor-pointer border-none transition-colors ${
          on ? "bg-teal-500" : "bg-gray-300"
        }`}
        style={{ width: 32, height: 18 }}
      >
        <span
          className="w-3.5 h-3.5 rounded-full bg-white transition-transform"
          style={{
            width: 14,
            height: 14,
            transform: on ? "translateX(14px)" : "translateX(0)",
          }}
        />
      </button>
    </td>
  );
};

const SortOrderCell = ({ value }: { value: number }) => (
  <td className="px-3 py-2 text-center">
    <input
      defaultValue={value}
      type="number"
      className="w-14 text-center text-[12px] px-1.5 py-1 border border-gray-200 rounded-md bg-white text-gray-700 outline-none focus:border-blue-400"
    />
  </td>
);

const NameInputCell = ({ value }: { value: string }) => (
  <td className="px-3 py-2">
    <input
      defaultValue={value}
      className="w-28 text-[12px] px-1.5 py-1 border border-blue-300 rounded-md bg-white text-blue-600 outline-none focus:border-blue-500"
    />
  </td>
);

const MinOrderValueCell = ({ value }: { value: number }) => (
  <td className="px-3 py-2 text-center">
    <input
      defaultValue={value}
      type="number"
      className="w-14 text-center text-[12px] px-1.5 py-1 border border-gray-200 rounded-md bg-white text-gray-700 outline-none"
    />
  </td>
);

const AddButtonCell = () => (
  <td className="px-3 py-2">
    <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-sky-500 text-white rounded-md border-none cursor-pointer hover:bg-sky-600 transition-colors whitespace-nowrap">
      <Plus size={11} /> Add
    </button>
  </td>
);

const StockCell = ({ value }: { value: number }) => {
  const cls =
    value === 0
      ? "text-red-500"
      : value < 5
        ? "text-amber-500"
        : "text-green-600";
  return (
    <td className="px-3 py-2 text-center">
      <span className={`text-[12px] font-medium ${cls}`}>
        {value === 0 ? "Out" : value}
      </span>
    </td>
  );
};

const BadgeCell = ({ value }: { value: "active" | "draft" }) => (
  <td className="px-3 py-2">
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
        value === "active"
          ? "bg-green-50 text-green-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {value}
    </span>
  </td>
);

const EditCell = ({ onEdit }: { onEdit?: () => void }) => (
  <td className="px-3 py-2">
    <button
      onClick={onEdit}
      aria-label="Edit"
      className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 bg-transparent cursor-pointer transition-colors"
    >
      <Pencil size={12} />
    </button>
  </td>
);

const DeleteCell = ({ onDelete }: { onDelete?: () => void }) => (
  <td className="px-3 py-2">
    <button
      onClick={onDelete}
      aria-label="Delete"
      className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:text-red-600 hover:border-red-300 bg-transparent cursor-pointer transition-colors"
    >
      <Trash2 size={12} />
    </button>
  </td>
);

// ─── Generic cell dispatcher ───────────────────────────────────────────────────

function renderCell(col: ColDef, row: Record<string, unknown>, idx: number) {
  const val = col.getValue ? col.getValue(row) : row[col.key];

  switch (col.type) {
    case "check":
      return (
        <td key={idx} className="px-3 py-2 text-center">
          <input
            type="checkbox"
            className="w-3.5 h-3.5 cursor-pointer accent-blue-500"
          />
        </td>
      );
    case "thumb":
      return <ThumbCell key={idx} src={val as string | undefined} />;
    case "toggle":
      return <ToggleCell key={idx} value={!!val} />;
    case "sortOrder":
      return <SortOrderCell key={idx} value={val as number} />;
    case "nameInput":
      return <NameInputCell key={idx} value={val as string} />;
    case "minOrderValue":
      return <MinOrderValueCell key={idx} value={val as number} />;
    case "addButton":
      return <AddButtonCell key={idx} />;
    case "price":
      return (
        <td key={idx} className="px-3 py-2 text-center">
          <span className="text-[12px] font-medium text-gray-700">
            {val as string}
          </span>
        </td>
      );
    case "stock":
      return <StockCell key={idx} value={val as number} />;
    case "badge":
      return <BadgeCell key={idx} value={val as "active" | "draft"} />;
    case "count":
      return (
        <td
          key={idx}
          className={`px-3 py-2 ${col.center ? "text-center" : ""}`}
        >
          <span className="text-[12px] font-medium text-gray-700">
            {val as number}
          </span>
        </td>
      );
    case "text":
      return (
        <td key={idx} className="px-3 py-2">
          <span className="text-[12px] text-gray-500">{val as string}</span>
        </td>
      );
    case "editAction":
      return <EditCell key={idx} />;
    case "deleteAction":
      return <DeleteCell key={idx} />;
    default:
      return (
        <td key={idx} className="px-3 py-2 text-[12px] text-gray-400">
          —
        </td>
      );
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 text-[12px] rounded-lg border transition-colors cursor-pointer ${
      active
        ? "bg-sky-500 text-white border-sky-500"
        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

interface DataTableProps {
  columns: ColDef[];
  rows: Record<string, unknown>[];
}

const DataTable = ({ columns, rows }: DataTableProps) => (
  <div className="overflow-x-auto w-full">
    <table
      className="border-collapse"
      style={{ width: "max-content", minWidth: "100%" }}
    >
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          {columns.map((col, i) => (
            <th
              key={i}
              className={`px-3 py-2.5 text-[11px] font-medium text-gray-400 whitespace-nowrap ${
                col.center ? "text-center" : "text-left"
              }`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col, ci) => renderCell(col as ColDef, row, ci))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-10 text-center text-[13px] text-gray-400"
            >
              No results
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// ─── Root page component ───────────────────────────────────────────────────────

export const ProductsPage = ({
  categories,
  products,
  modifiers,
  more,
}: ProductsPageProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [query, setQuery] = useState("");

  const tabMap: Record<TabKey, TabConfig<never>> = {
    categories: categories as TabConfig<never>,
    products: products as TabConfig<never>,
    modifiers: modifiers as TabConfig<never>,
    more: more as TabConfig<never>,
  };

  const currentTab = tabMap[activeTab];

  const filteredRows = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return currentTab.rows as Record<string, unknown>[];
    return (currentTab.rows as Record<string, unknown>[]).filter(
      (r) => typeof r.name === "string" && r.name.toLowerCase().includes(q),
    );
  }, [currentTab, query]);

  const handleTabSwitch = (key: TabKey) => {
    setActiveTab(key);
    setQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
        <ShoppingBag size={17} className="text-gray-400" />
        <span className="text-[14px] font-medium text-gray-800">
          Products / <span className="text-gray-500">{currentTab.label}</span>
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100 flex-wrap">
        <div className="flex gap-1.5">
          {(["categories", "products", "modifiers", "more"] as TabKey[]).map(
            (key) => (
              <TabButton
                key={key}
                label={tabMap[key].label}
                active={activeTab === key}
                onClick={() => handleTabSwitch(key)}
              />
            ),
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
            <Filter size={13} />
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg bg-white px-2 h-7 gap-1.5">
            <Search size={12} className="text-gray-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="border-none outline-none bg-transparent text-[12px] text-gray-700 placeholder:text-gray-300 w-28"
            />
          </div>
          <button className="flex items-center gap-1 px-2.5 h-7 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
            <Plus size={13} /> Actions
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white m-4 rounded-xl border border-gray-100 overflow-hidden">
        <DataTable
          columns={currentTab.columns as ColDef[]}
          rows={filteredRows}
        />
      </div>
    </div>
  );
};

// ─── Column definitions ────────────────────────────────────────────────────────

const CATEGORY_COLS: ColDef<CategoryRow>[] = [
  { key: "check", label: "", type: "check" },
  { key: "icon", label: "Icon", type: "thumb" },
  { key: "on", label: "On/Off", type: "toggle" },
  { key: "sort", label: "Sort order", type: "sortOrder" },
  { key: "name", label: "Name", type: "nameInput" },
  { key: "arabicName", label: "Arabic name", type: "nameInput" },
  { key: "products", label: "Products", type: "count", center: true },
  {
    key: "minOrderValue",
    label: "Min. order value",
    type: "minOrderValue",
    center: true,
  },
  { key: "cover", label: "Cover", type: "thumb" },
  { key: "avail", label: "Availability", type: "addButton" },
  { key: "seo", label: "SEO", type: "editAction" },
  { key: "delete", label: "Delete", type: "deleteAction" },
];

const PRODUCT_COLS: ColDef<ProductRow>[] = [
  { key: "check", label: "", type: "check" },
  { key: "image", label: "Image", type: "thumb" },
  { key: "status", label: "Status", type: "badge" },
  { key: "category", label: "Category", type: "text" },
  { key: "name", label: "Name", type: "nameInput" },
  { key: "price", label: "Price", type: "price", center: true },
  { key: "type", label: "Type", type: "text", center: true },
  { key: "hasoptions", label: "Has Options", type: "modal", center: true },
  {
    key: "product-created",
    label: "Product Created",
    type: "text",
    center: true,
  },

  // { key: "edit", label: "Edit", type: "editAction" },
  { key: "delete", label: "Delete", type: "deleteAction" },
];

const MODIFIER_COLS: ColDef<ModifierRow>[] = [
  { key: "check", label: "", type: "check" },
  { key: "name", label: "Name", type: "nameInput" },
  { key: "arabicName", label: "Arabic name", type: "nameInput" },
  { key: "type", label: "Type", type: "text" },
  { key: "required", label: "Required", type: "toggle" },
  { key: "min", label: "Min select", type: "sortOrder", center: true },
  { key: "max", label: "Max select", type: "sortOrder", center: true },
  { key: "options", label: "Options", type: "count", center: true },
  { key: "edit", label: "Edit", type: "editAction" },
  { key: "delete", label: "Delete", type: "deleteAction" },
];

const MORE_COLS: ColDef<MoreRow>[] = [
  { key: "check", label: "", type: "check" },
  { key: "name", label: "Name", type: "nameInput" },
  { key: "arabicName", label: "Arabic name", type: "nameInput" },
  { key: "type", label: "Type", type: "text" },
  { key: "status", label: "Status", type: "badge" },
  { key: "edit", label: "Edit", type: "editAction" },
  { key: "delete", label: "Delete", type: "deleteAction" },
];

// ─── Sample data ──────────────────────────────────────────────────────────────

const DATA: ProductsPageProps = {
  categories: {
    label: "Categories",
    columns: CATEGORY_COLS,
    rows: [
      {
        id: "1",
        on: true,
        sort: 1,
        name: "SCOOP'D DEALS",
        arabicName: "SCOOP'D DEALS",
        products: 13,
        minOrderValue: 0,
      },
      {
        id: "2",
        on: true,
        sort: 1,
        name: "CHICK N CONE",
        arabicName: "CHICK N CONE",
        products: 3,
        minOrderValue: 0,
      },
      {
        id: "3",
        on: true,
        sort: 1,
        name: "SNACKS",
        arabicName: "SNACKS",
        products: 7,
        minOrderValue: 0,
      },
      {
        id: "4",
        on: true,
        sort: 2,
        name: "ICE CREAM",
        arabicName: "ICE CREAM",
        products: 6,
        minOrderValue: 0,
      },
      {
        id: "5",
        on: true,
        sort: 3,
        name: "SAVOURY",
        arabicName: "SAVOURY",
        products: 13,
        minOrderValue: 0,
      },
      {
        id: "6",
        on: false,
        sort: 4,
        name: "BEVERAGES",
        arabicName: "BEVERAGES",
        products: 5,
        minOrderValue: 0,
      },
    ],
  },
  products: {
    label: "Products",
    columns: PRODUCT_COLS,
    rows: [
      {
        id: "1",
        name: "Scoop'd Deal 1",
        arabicName: "Scoop'd Deal 1",
        category: "DEALS",
        price: "₦2,500",
        stock: 20,
        status: "active",
        on: true,
      },
      {
        id: "2",
        name: "Chick Cone S",
        arabicName: "Chick Cone S",
        category: "CHICK N CONE",
        price: "₦1,800",
        stock: 8,
        status: "active",
        on: true,
      },
      {
        id: "3",
        name: "Chick Cone L",
        arabicName: "Chick Cone L",
        category: "CHICK N CONE",
        price: "₦2,200",
        stock: 0,
        status: "active",
        on: true,
      },
      {
        id: "4",
        name: "Chin Chin",
        arabicName: "Chin Chin",
        category: "SNACKS",
        price: "₦500",
        stock: 50,
        status: "active",
        on: true,
      },
      {
        id: "5",
        name: "Puff Puff",
        arabicName: "Puff Puff",
        category: "SNACKS",
        price: "₦400",
        stock: 3,
        status: "draft",
        on: false,
      },
      {
        id: "6",
        name: "Vanilla Scoop",
        arabicName: "Vanilla Scoop",
        category: "ICE CREAM",
        price: "₦1,200",
        stock: 15,
        status: "active",
        on: true,
      },
    ],
  },
  modifiers: {
    label: "Modifiers",
    columns: MODIFIER_COLS,
    rows: [
      {
        id: "1",
        name: "Size",
        arabicName: "Size",
        type: "Single",
        required: true,
        min: 1,
        max: 1,
        options: 3,
      },
      {
        id: "2",
        name: "Toppings",
        arabicName: "Toppings",
        type: "Multiple",
        required: false,
        min: 0,
        max: 5,
        options: 6,
      },
      {
        id: "3",
        name: "Sauce",
        arabicName: "Sauce",
        type: "Single",
        required: false,
        min: 0,
        max: 1,
        options: 4,
      },
      {
        id: "4",
        name: "Add-ons",
        arabicName: "Add-ons",
        type: "Multiple",
        required: false,
        min: 0,
        max: 3,
        options: 8,
      },
      {
        id: "5",
        name: "Temperature",
        arabicName: "Temperature",
        type: "Single",
        required: true,
        min: 1,
        max: 1,
        options: 2,
      },
    ],
  },
  more: {
    label: "More",
    columns: MORE_COLS,
    rows: [
      {
        id: "1",
        name: "Happy Hour",
        arabicName: "Happy Hour",
        type: "Promotion",
        status: "active",
      },
      {
        id: "2",
        name: "Loyalty Points",
        arabicName: "Loyalty Points",
        type: "Programme",
        status: "active",
      },
      {
        id: "3",
        name: "Student Discount",
        arabicName: "Student Discount",
        type: "Discount",
        status: "draft",
      },
      {
        id: "4",
        name: "Bundle Deal",
        arabicName: "Bundle Deal",
        type: "Promotion",
        status: "active",
      },
    ],
  },
};

// ─── Entry point ───────────────────────────────────────────────────────────────

export default function App() {
  return <ProductsPage {...DATA} />;
}
