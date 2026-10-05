import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayStat {
  date: string; // "YYYY-MM-DD"
  orders: number;
  sales: number; // raw value e.g. Naira
}

interface DailySalesCardProps {
  data: DayStat[];
  currencySymbol?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number, symbol: string): string {
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}k`;
  return `${symbol}${value.toLocaleString()}`;
}

function shortDate(iso: string): string {
  const [, , day] = iso.split("-");
  return day;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
}

const MetricCard = ({ label, value }: MetricCardProps) => (
  <div className="bg-gray-50 rounded-lg px-4 py-3 flex-1 min-w-0">
    <p className="text-[11px] text-gray-400 mb-1">{label}</p>
    <p className="text-[22px] font-medium text-gray-800 truncate">{value}</p>
  </div>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
    <span
      className="w-2.5 h-2.5 rounded-[2px] inline-block flex-shrink-0"
      style={{ background: color }}
    />
    {label}
  </span>
);

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  currencySymbol: string;
}

const ChartTooltip = ({
  active,
  payload,
  label,
  currencySymbol,
}: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-[12px] text-gray-600 shadow-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "Sales"
            ? `Sales: ${currencySymbol}${p.value.toLocaleString()}`
            : `Orders: ${p.value}`}
        </p>
      ))}
    </div>
  );
};

// ─── Root card component ───────────────────────────────────────────────────────

export const SalesCard = ({
  data,
  currencySymbol = "₦",
}: DailySalesCardProps) => {
  const { totalOrders, totalSales, avgOrderValue } = useMemo(() => {
    const totalOrders = data.reduce((s, d) => s + d.orders, 0);
    const totalSales = data.reduce((s, d) => s + d.sales, 0);
    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    return { totalOrders, totalSales, avgOrderValue };
  }, [data]);

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: shortDate(d.date),
  }));

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-[14px] font-medium text-gray-800 mb-4">Daily sales</p>

      {/* Metric strip */}
      <div className="flex gap-2.5 mb-5">
        <MetricCard label="Total orders" value={totalOrders.toLocaleString()} />
        <MetricCard
          label="Total sales"
          value={formatCurrency(totalSales, currencySymbol)}
        />
        <MetricCard
          label="Avg order value"
          value={formatCurrency(avgOrderValue, currencySymbol)}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <LegendDot color="#E24B4A" label="Orders" />
        <LegendDot color="#3B6D11" label="Sales" />
      </div>

      {/* Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              stroke="#F1EFE8"
              strokeWidth={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: "#B4B2A9" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="orders"
              orientation="left"
              label={{
                value: "# Orders",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#B4B2A9" },
                offset: 10,
              }}
              tick={{ fontSize: 11, fill: "#B4B2A9" }}
              axisLine={false}
              tickLine={false}
              width={40}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="sales"
              orientation="right"
              label={{
                value: `Sales (${currencySymbol})`,
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11, fill: "#B4B2A9" },
                offset: 10,
              }}
              tick={{ fontSize: 11, fill: "#B4B2A9" }}
              tickFormatter={(v) => formatCurrency(v, currencySymbol)}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              content={
                <ChartTooltip currencySymbol={currencySymbol} label="" />
              }
            />
            <Bar
              yAxisId="orders"
              dataKey="orders"
              name="Orders"
              fill="#E24B4A"
              fillOpacity={0.8}
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
            />
            <Line
              yAxisId="sales"
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#3B6D11"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3B6D11" }}
              strokeDasharray="4 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── Sample data factory ───────────────────────────────────────────────────────

function generateSampleData(days = 14): DayStat[] {
  const today = new Date("2026-06-24");
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const isToday = i === days - 1;
    const orders = isToday ? 0 : Math.floor(Math.random() * 12);
    const sales = isToday
      ? 0
      : Math.round(orders * (3500 + Math.random() * 2000));
    return { date: d.toISOString().slice(0, 10), orders, sales };
  });
}

// ─── Entry point ───────────────────────────────────────────────────────────────

export default function DailySalesCard() {
  const data = useMemo(() => generateSampleData(14), []);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <SalesCard data={data} currencySymbol="₦" />
    </div>
  );
}
