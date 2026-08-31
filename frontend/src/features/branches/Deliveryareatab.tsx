import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  DataTable,
  DeleteCell,
  ToggleCell,
  type DataTableColumn,
} from "./../../shared/DataTable";
import { uniqueOptions } from "../../shared/TableHeaderCell";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DeliveryArea {
  id: string;
  isActive: boolean;
  country: string;
  province: string;
  area: string;
  arabicName: string;
  overrideRate: boolean;
  deliveryRate: number;
  overrideMinOrderValue: boolean;
  minOrderValue: number;
  overrideDeliveryMins: boolean;
  deliveryMins: number;
  deliveryCost: number;
}

// ─── Reference data — taken directly from the screenshot, nothing invented ──

const INITIAL_AREAS: DeliveryArea[] = [
  {
    id: "abijo",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Abijo",
    arabicName: "Abijo",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "abraham-adesanya",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Abraham Adesanya",
    arabicName: "Abraham Adesanya",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "awoyaya",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Awoyaya",
    arabicName: "Awoyaya",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "badore",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Badore",
    arabicName: "Badore",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "eputu-town",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Eputu Town",
    arabicName: "Eputu Town",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "jakande",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Jakande",
    arabicName: "Jakande",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "lamgbasa",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Lamgbasa",
    arabicName: "Lamgbasa",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "mayfair-garden",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Mayfair Garden",
    arabicName: "Mayfair Garden",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
  {
    id: "owode",
    isActive: true,
    country: "Nigeria",
    province: "Lagos",
    area: "Owode",
    arabicName: "Owode",
    overrideRate: false,
    deliveryRate: 0,
    overrideMinOrderValue: true,
    minOrderValue: 8000,
    overrideDeliveryMins: false,
    deliveryMins: 30,
    deliveryCost: 0,
  },
];

// ─── Small editable-number cell (same visual language as Working Hours' Max Orders field) ──

export function EditableNumberCell({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
      className="w-24 rounded-md border border-white/10 bg-transparent px-2.5 py-1.5 text-center text-[13px] text-slate-300 focus:border-sky-500/60 focus:bg-[#12151b] focus:outline-none"
    />
  );
}

function CheckboxCell({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-3.5 w-3.5 accent-sky-500"
    />
  );
}

// ─── Tab component ──────────────────────────────────────────────────────────

export default function DeliveryAreasTab({
  branchName,
}: {
  branchName: string;
}) {
  const [areas, setAreas] = useState<DeliveryArea[]>(INITIAL_AREAS);
  const [query, setQuery] = useState("");

  const updateArea = (id: string, patch: Partial<DeliveryArea>) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return areas;
    return areas.filter(
      (a) =>
        a.area.toLowerCase().includes(q) ||
        a.arabicName.toLowerCase().includes(q) ||
        a.province.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q),
    );
  }, [areas, query]);

  const columns: DataTableColumn<DeliveryArea>[] = [
    {
      key: "isActive",
      label: "On/Off",
      width: "90px",
      sticky: true,
      filterable: true,
      sortable: false,
      filterAccessor: (row) => (row.isActive ? "on" : "off"),
      filterOptions: () => [
        { value: "on", label: "Enabled" },
        { value: "off", label: "Disabled" },
      ],
      skeletonVariant: "toggle",
      render: (row) => <ToggleCell on={row.isActive} />,
    },
    {
      key: "country",
      label: "Country",
      width: "110px",
      sortable: false,
      filterable: true,
      filterAccessor: (row) => row.country,
      filterOptions: (rows) => uniqueOptions(rows.map((r) => r.country)),
      skeletonVariant: "text",
      render: (row) => <span className="text-slate-300">{row.country}</span>,
    },
    {
      key: "province",
      label: "Province",
      width: "110px",
      sortable: false,
      filterable: true,
      filterAccessor: (row) => row.province,
      filterOptions: (rows) => uniqueOptions(rows.map((r) => r.province)),
      skeletonVariant: "text",
      render: (row) => <span className="text-slate-300">{row.province}</span>,
    },
    {
      key: "area",
      label: "Area",
      width: "160px",
      sortable: true,
      sortAccessor: (row) => row.area,
      skeletonVariant: "text-wide",
      render: (row) => (
        <span className="font-medium text-slate-100">{row.area}</span>
      ),
    },
    {
      key: "arabicName",
      label: "Arabic name",
      width: "160px",
      sortable: true,
      sortAccessor: (row) => row.arabicName,
      skeletonVariant: "text-wide",
      render: (row) => (
        <span className="text-slate-300" dir="rtl">
          {row.arabicName}
        </span>
      ),
    },
    {
      key: "overrideRate",
      label: "Override Rate?",
      width: "130px",
      sortable: false,
      align: "center",
      skeletonVariant: "checkbox",
      render: (row) => (
        <div className="flex justify-center">
          <CheckboxCell
            checked={row.overrideRate}
            onChange={(v) => updateArea(row.id, { overrideRate: v })}
          />
        </div>
      ),
    },
    {
      key: "deliveryRate",
      label: "Delivery rate",
      width: "110px",
      align: "center",
      sortable: true,
      sortAccessor: (row) => row.deliveryRate,
      skeletonVariant: "dash",
      render: (row) => (
        <span className="text-slate-300">{row.deliveryRate}</span>
      ),
    },
    {
      key: "overrideMinOrderValue",
      label: "Override minimum order value?",
      width: "160px",
      sortable: false,
      align: "center",
      skeletonVariant: "checkbox",
      render: (row) => (
        <div className="flex justify-center">
          <CheckboxCell
            checked={row.overrideMinOrderValue}
            onChange={(v) => updateArea(row.id, { overrideMinOrderValue: v })}
          />
        </div>
      ),
    },
    {
      key: "minOrderValue",
      label: "Minimum order value",
      width: "150px",
      align: "center",
      sortable: true,
      sortAccessor: (row) => row.minOrderValue,
      skeletonVariant: "dropdown",
      render: (row) => (
        <div className="flex justify-center">
          <EditableNumberCell
            value={row.minOrderValue}
            onChange={(v) => updateArea(row.id, { minOrderValue: v })}
          />
        </div>
      ),
    },
    {
      key: "overrideDeliveryMins",
      label: "Override delivery mins?",
      sortable: false,
      width: "150px",
      align: "center",
      skeletonVariant: "checkbox",
      render: (row) => (
        <div className="flex justify-center">
          <CheckboxCell
            checked={row.overrideDeliveryMins}
            onChange={(v) => updateArea(row.id, { overrideDeliveryMins: v })}
          />
        </div>
      ),
    },
    {
      key: "deliveryMins",
      label: "Delivery mins",
      width: "110px",
      align: "center",
      sortable: true,
      sortAccessor: (row) => row.deliveryMins,
      skeletonVariant: "dash",
      render: (row) => (
        <span className="text-slate-300">{row.deliveryMins}</span>
      ),
    },
    {
      key: "deliveryCost",
      label: "Delivery cost",
      width: "120px",
      align: "center",
      sortable: true,
      sortAccessor: (row) => row.deliveryCost,
      skeletonVariant: "dropdown",
      render: (row) => (
        <div className="flex justify-center">
          <EditableNumberCell
            value={row.deliveryCost}
            onChange={(v) => updateArea(row.id, { deliveryCost: v })}
          />
        </div>
      ),
    },
    {
      key: "remove",
      label: "Remove",
      width: "80px",
      sortable: false,
      align: "center",
      skeletonVariant: "icon",
      render: (row) => <DeleteCell id={row.id} onDel={removeArea} />,
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Delivery areas and rates for {branchName}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <button className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
            <Plus size={15} />
            Add areas
          </button>
          <div className="flex w-full max-w-xs items-center overflow-hidden rounded-md border border-white/10 bg-[#12151b] focus-within:border-sky-500/60">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an area"
              className="w-full bg-transparent px-3 py-2 text-[13px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            <button className="flex h-full items-center bg-sky-500 px-3 py-2.5 text-white hover:bg-sky-400">
              <Search size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Table — this is the whole point: no hand-rolled <table> markup here */}
      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        selectable
        minWidth="1500px"
        emptyMessage={`No areas match "${query}".`}
      />

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-4">
        <button className="rounded-md border border-white/10 px-4 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-white/5">
          Cancel
        </button>
      </div>
    </div>
  );
}
