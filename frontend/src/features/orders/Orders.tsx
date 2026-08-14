import { useState, useMemo } from "react";
import {
  Receipt,
  Warehouse,
  LayoutGrid,
  Menu,
  UserCircle,
  Search,
  ChevronUp,
  ChevronDown,
  Inbox,
  Globe,
  Smartphone,
  Calculator,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "new"
  | "received"
  | "preparing"
  | "delivering"
  | "complete"
  | "cancelled";

export type OrderSource = "web" | "app" | "pos";
export type TimeFilter = "today" | "future" | "past";

export interface Order {
  id: string;
  source: OrderSource;
  branch: string;
  type: string;
  total: string;
  trackingCode: string;
  status: OrderStatus;
  customer: string;
  area: string;
  province: string;
  expectedDate: string;
  expectedTime: string;
}

export interface CustomerOrdersPageProps {
  orders: Order[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "received", label: "Received" },
  { key: "preparing", label: "Preparing" },
  { key: "delivering", label: "Delivering/Ready" },
  { key: "complete", label: "Complete" },
  { key: "cancelled", label: "Cancelled" },
];

const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "today", label: "For Today" },
  { key: "future", label: "Future" },
  { key: "past", label: "Past" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  received: "bg-green-50 text-green-700",
  preparing: "bg-amber-50 text-amber-700",
  delivering: "bg-teal-50 text-teal-700",
  complete: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  received: "Received",
  preparing: "Preparing",
  delivering: "Delivering/Ready",
  complete: "Complete",
  cancelled: "Cancelled",
};

const SOURCE_ICONS: Record<OrderSource, React.ReactNode> = {
  web: <Globe size={13} />,
  app: <Smartphone size={13} />,
  pos: <Calculator size={13} />,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FilterBtn = ({
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
    className={`px-3 py-1.5 text-[12px] rounded-lg border transition-colors cursor-pointer ${
      active
        ? "bg-sky-500 text-white border-sky-500"
        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const SortIcons = () => (
  <span className="flex flex-col ml-1 opacity-40">
    <ChevronUp size={9} />
    <ChevronDown size={9} />
  </span>
);

const StatusPill = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);

const SourceCell = ({ source }: { source: OrderSource }) => (
  <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-400">
    {SOURCE_ICONS[source]}
    {source}
  </span>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-14">
    <Inbox size={40} className="text-gray-200 mb-3" />
    <p className="text-[13px] text-gray-400">No data</p>
  </div>
);

interface OrderRowProps {
  order: Order;
}

const OrderRow = ({ order }: OrderRowProps) => (
  <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
    <td className="px-3 py-3 text-center">
      <input
        type="checkbox"
        className="w-3.5 h-3.5 cursor-pointer accent-sky-500"
      />
    </td>
    <td className="px-3 py-3">
      <SourceCell source={order.source} />
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-500 whitespace-nowrap">
      {order.branch}
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-500 whitespace-nowrap">
      {order.type}
    </td>
    <td className="px-3 py-3 text-[12px] text-sky-600 font-medium whitespace-nowrap">
      {order.id}
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-800 font-medium whitespace-nowrap">
      {order.total}
    </td>
    <td className="px-3 py-3 text-[11px] text-gray-400 font-mono whitespace-nowrap">
      {order.trackingCode}
    </td>
    <td className="px-3 py-3">
      <StatusPill status={order.status} />
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-600 whitespace-nowrap">
      {order.customer}
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-500 whitespace-nowrap">
      {order.area}
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-500 whitespace-nowrap">
      {order.province}
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-500 whitespace-nowrap">
      {order.expectedDate}
    </td>
    <td className="px-3 py-3 text-[12px] text-gray-500 whitespace-nowrap">
      {order.expectedTime}
    </td>
  </tr>
);

const TableHead = () => (
  <thead>
    <tr className="border-b border-gray-100 bg-gray-50">
      {[
        { label: "", sortable: false, center: true },
        { label: "Source", sortable: false },
        { label: "For branch", sortable: true },
        { label: "Type", sortable: false },
        { label: "Id", sortable: true },
        { label: "Total", sortable: false },
        { label: "Tracking code", sortable: false },
        { label: "Status", sortable: true },
        { label: "Customer", sortable: false },
        { label: "Area", sortable: true },
        { label: "Province", sortable: true },
        { label: "Expected date", sortable: true },
        { label: "Expected time", sortable: false },
      ].map((col, i) => (
        <th
          key={i}
          className={`px-3 py-2.5 text-[11px] font-medium text-gray-400 whitespace-nowrap select-none ${
            col.center ? "text-center" : "text-left"
          }`}
        >
          {col.label && (
            <span className="inline-flex items-center gap-0.5 cursor-pointer hover:text-gray-600 transition-colors">
              {col.label}
              {col.sortable && <SortIcons />}
            </span>
          )}
        </th>
      ))}
    </tr>
  </thead>
);

// ─── Root page component ───────────────────────────────────────────────────────

export const CustomerOrdersPage = ({ orders }: CustomerOrdersPageProps) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, query]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-gray-400" />
          <span className="text-[14px] font-medium text-gray-800">
            Customer Orders
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
            <Warehouse size={13} /> Pickups
          </button>
          {[LayoutGrid, Menu, UserCircle].map((Icon, i) => (
            <button
              key={i}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white border-b border-gray-100 flex-wrap">
        <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
          <Search size={13} />
        </button>
        {STATUS_FILTERS.map((f) => (
          <FilterBtn
            key={f.key}
            label={f.label}
            active={statusFilter === f.key}
            onClick={() => setStatusFilter(f.key as OrderStatus | "all")}
          />
        ))}
      </div>

      {/* Time filters */}
      <div className="flex gap-1.5 px-4 py-2 bg-white border-b border-gray-100">
        {TIME_FILTERS.map((f) => (
          <FilterBtn
            key={f.key}
            label={f.label}
            active={timeFilter === f.key}
            onClick={() => setTimeFilter(f.key)}
          />
        ))}
      </div>

      {/* Search + action */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center border border-gray-200 rounded-lg bg-white px-2 h-8 gap-1.5 flex-1 max-w-xs">
          <Search size={13} className="text-gray-300 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by id, customer name..."
            className="border-none outline-none bg-transparent text-[12px] text-gray-700 placeholder:text-gray-300 w-full"
          />
        </div>
        <button className="px-3 h-8 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
          Perform Action
        </button>
      </div>

      {/* Edit columns row */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 bg-gray-50">
        <button className="px-3 h-7 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
          Edit Columns
        </button>
        {[ChevronUp, ChevronDown].map((Icon, i) => (
          <button
            key={i}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Icon size={13} />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mx-4 mb-4 bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="border-collapse"
            style={{ width: "max-content", minWidth: "100%" }}
          >
            <TableHead />
            <tbody>
              {filtered.length > 0
                ? filtered.map((o) => <OrderRow key={o.id} order={o} />)
                : null}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState />}
        </div>
      </div>

      {/* Footer */}
      <p className="px-4 pb-4 text-[12px] text-gray-400">
        Total: {filtered.length} order{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-001",
    source: "web",
    branch: "GRA",
    type: "Delivery",
    total: "₦4,500",
    trackingCode: "TRK9821",
    status: "new",
    customer: "Ade Bello",
    area: "Lekki",
    province: "Lagos",
    expectedDate: "2026-06-29",
    expectedTime: "12:00",
  },
  {
    id: "ORD-002",
    source: "app",
    branch: "ICM",
    type: "Pickup",
    total: "₦2,200",
    trackingCode: "TRK9822",
    status: "received",
    customer: "Kemi Ojo",
    area: "Ikeja",
    province: "Lagos",
    expectedDate: "2026-06-29",
    expectedTime: "13:30",
  },
  {
    id: "ORD-003",
    source: "web",
    branch: "MMA",
    type: "Delivery",
    total: "₦6,100",
    trackingCode: "TRK9823",
    status: "preparing",
    customer: "Emeka Nwosu",
    area: "Surulere",
    province: "Lagos",
    expectedDate: "2026-06-29",
    expectedTime: "14:00",
  },
  {
    id: "ORD-004",
    source: "pos",
    branch: "N1",
    type: "Dine-in",
    total: "₦3,800",
    trackingCode: "TRK9824",
    status: "delivering",
    customer: "Fatima Umar",
    area: "Wuse",
    province: "Abuja",
    expectedDate: "2026-06-29",
    expectedTime: "14:30",
  },
  {
    id: "ORD-005",
    source: "app",
    branch: "GRA",
    type: "Delivery",
    total: "₦5,500",
    trackingCode: "TRK9825",
    status: "complete",
    customer: "Tunde Akande",
    area: "VI",
    province: "Lagos",
    expectedDate: "2026-06-29",
    expectedTime: "11:00",
  },
  {
    id: "ORD-006",
    source: "web",
    branch: "Novare",
    type: "Pickup",
    total: "₦1,900",
    trackingCode: "TRK9826",
    status: "cancelled",
    customer: "Ngozi Eze",
    area: "Sangotedo",
    province: "Lagos",
    expectedDate: "2026-06-29",
    expectedTime: "10:00",
  },
  {
    id: "ORD-007",
    source: "app",
    branch: "MMA2",
    type: "Delivery",
    total: "₦7,200",
    trackingCode: "TRK9827",
    status: "new",
    customer: "Bode Adeyemi",
    area: "Gbagada",
    province: "Lagos",
    expectedDate: "2026-06-29",
    expectedTime: "15:00",
  },
  {
    id: "ORD-008",
    source: "pos",
    branch: "ICM",
    type: "Dine-in",
    total: "₦2,800",
    trackingCode: "TRK9828",
    status: "received",
    customer: "Amaka Obi",
    area: "Maitama",
    province: "Abuja",
    expectedDate: "2026-06-29",
    expectedTime: "15:30",
  },
];

// ─── Entry point ───────────────────────────────────────────────────────────────

export default function App() {
  return <CustomerOrdersPage orders={SAMPLE_ORDERS} />;
}
