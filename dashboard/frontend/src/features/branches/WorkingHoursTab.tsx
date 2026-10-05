import { useMemo, useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Check,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  HeaderCell,
  PlainHeaderCell,
  uniqueOptions,
  type Column,
  type SortDir,
} from "../../shared/TableHeaderCell";
import { FilterOption } from "../../shared/FilterDropDown";

// ─── Types ──────────────────────────────────────────────────────────────────

type ScheduleType = "delivery" | "pickup";

interface WorkingHourSlot {
  id: string;
  day:
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  /** null = "No Maximum" */
  maxOrders: number | null;
}

// ─── Reference data — taken directly from the screenshot, nothing invented ──

const INITIAL_SLOTS: WorkingHourSlot[] = [
  { id: "sun", day: "Sunday", start: "08:00", end: "22:00", maxOrders: null },
  { id: "mon", day: "Monday", start: "08:00", end: "22:00", maxOrders: null },
  { id: "tue", day: "Tuesday", start: "08:00", end: "22:00", maxOrders: null },
  {
    id: "wed",
    day: "Wednesday",
    start: "08:00",
    end: "22:00",
    maxOrders: null,
  },
  { id: "thu", day: "Thursday", start: "08:00", end: "22:00", maxOrders: null },
  { id: "fri", day: "Friday", start: "08:00", end: "22:00", maxOrders: null },
  { id: "sat", day: "Saturday", start: "08:00", end: "22:00", maxOrders: null },
];

const DAY_OPTIONS: WorkingHourSlot["day"][] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ─── Column config for the Day column (the only sortable/filterable one) ───

const DAY_COLUMN: Column<WorkingHourSlot> = {
  key: "day",
  label: "Day",
  sortable: false,
  filterable: true,
  width: "260px",
  filterAccessor: (row) => row.day,
  filterOptions: (rows) => uniqueOptions(rows.map((r) => r.day)),
};

// ─── Small pieces ───────────────────────────────────────────────────────────

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#12151b] px-3 py-2 focus-within:border-sky-500/60">
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[13px] text-slate-200 focus:outline-none [color-scheme:dark]"
      />
      <Clock size={13} className="ml-2 shrink-0 text-slate-500" />
    </div>
  );
}

function DaySelect({
  value,
  onChange,
}: {
  value: WorkingHourSlot["day"];
  onChange: (next: WorkingHourSlot["day"]) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as WorkingHourSlot["day"])}
        className="w-full appearance-none rounded-md border border-white/10 bg-[#12151b] px-3 py-2 text-[13px] font-medium text-slate-200 focus:border-sky-500/60 focus:outline-none"
      >
        {DAY_OPTIONS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function MaxOrdersInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (next: number | null) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value === null ? "" : String(value)}
      placeholder="No Maximum"
      onChange={(e) => {
        const raw = e.target.value.trim();
        onChange(raw === "" ? null : Number(raw.replace(/\D/g, "")) || null);
      }}
      className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-center text-[13px] text-slate-300 placeholder:text-slate-500 focus:border-sky-500/60 focus:bg-[#12151b] focus:outline-none"
    />
  );
}

// ─── Tab component ──────────────────────────────────────────────────────────

export default function WorkingHoursTab() {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("delivery");
  const [slots, setSlots] = useState<WorkingHourSlot[]>(INITIAL_SLOTS);
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);
  const [dayFilter, setDayFilter] = useState<string[]>([]);
  const [isDayFilterOpen, setIsDayFilterOpen] = useState(false);

  const rows = useMemo(() => {
    if (dayFilter.length === 0) return slots;
    const allowed = new Set(dayFilter);
    return slots.filter((s) => allowed.has(s.day));
  }, [slots, dayFilter]);

  const dayFilterOptions: FilterOption[] = useMemo(
    () => DAY_COLUMN.filterOptions!(slots),
    [slots],
  );

  const updateSlot = (id: string, patch: Partial<WorkingHourSlot>) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addSlot = () => {
    const id = `slot-${Date.now()}`;
    setSlots((prev) => [
      ...prev,
      { id, day: "Sunday", start: "08:00", end: "22:00", maxOrders: null },
    ]);
  };

  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    setCheckedRows((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    const map: Record<string, boolean> = {};
    rows.forEach((r) => (map[r.id] = next));
    setCheckedRows(map);
  };

  const toggleRow = (id: string) => {
    setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Type toggle */}
      <div className="flex items-center gap-3 px-6 pt-5">
        <span className="text-[13px] text-slate-400">Type</span>
        <div className="flex overflow-hidden rounded-md border border-white/10">
          {(["delivery", "pickup"] as ScheduleType[]).map((type) => (
            <button
              key={type}
              onClick={() => setScheduleType(type)}
              className={`px-4 py-1.5 text-[13px] font-medium capitalize transition ${
                scheduleType === type
                  ? "bg-sky-500 text-white"
                  : "bg-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-2 pt-4">
        <p className="w-full text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Branch working hours
        </p>
        <button
          onClick={addSlot}
          className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400"
        >
          <Plus size={15} />
          New Slots
        </button>
        <button className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
          <Plus size={15} />
          Copy slots to other branches
        </button>
      </div>
      <div className="px-6 pb-4">
        <button className="flex items-center gap-1.5 rounded-md border border-white/10 px-3.5 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-white/5">
          <Calendar size={14} />
          Manage presets
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border-t border-white/10">
        <table className="w-full min-w-[900px] border-collapse text-[13px]">
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
              <HeaderCell
                col={DAY_COLUMN}
                sort={{ key: null, dir: "asc" as SortDir }}
                onSort={() => {}}
                style={{ minWidth: DAY_COLUMN.width }}
                filterOptions={dayFilterOptions}
                activeFilter={dayFilter}
                isFilterOpen={isDayFilterOpen}
                onToggleFilter={() => setIsDayFilterOpen((v) => !v)}
                onApplyFilter={(values) => {
                  setDayFilter(values);
                  setIsDayFilterOpen(false);
                }}
                onCloseFilter={() => setIsDayFilterOpen(false)}
              />
              <PlainHeaderCell label="Start" width="180px" align="center" />
              <PlainHeaderCell label="End" width="180px" align="center" />
              <PlainHeaderCell
                label="Maximum number of orders"
                width="220px"
                align="center"
              />
              <PlainHeaderCell label="Controls" width="120px" align="center" />
            </tr>
          </thead>
          <tbody>
            {rows.map((slot, i) => (
              <tr
                key={slot.id}
                className={`border-b border-white/[0.06] transition hover:bg-white/[0.03] ${
                  i % 2 === 1 ? "bg-white/[0.015]" : ""
                }`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={!!checkedRows[slot.id]}
                    onChange={() => toggleRow(slot.id)}
                    className="h-3.5 w-3.5 accent-sky-500"
                  />
                </td>
                <td className="px-3 py-3">
                  <DaySelect
                    value={slot.day}
                    onChange={(day) => updateSlot(slot.id, { day })}
                  />
                </td>
                <td className="px-3 py-3">
                  <TimeInput
                    value={slot.start}
                    onChange={(start) => updateSlot(slot.id, { start })}
                  />
                </td>
                <td className="px-3 py-3">
                  <TimeInput
                    value={slot.end}
                    onChange={(end) => updateSlot(slot.id, { end })}
                  />
                </td>
                <td className="px-3 py-3">
                  <MaxOrdersInput
                    value={slot.maxOrders}
                    onChange={(maxOrders) => updateSlot(slot.id, { maxOrders })}
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      aria-label={`Confirm ${slot.day} slot`}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-slate-950 transition hover:bg-emerald-400"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <button
                      aria-label={`Remove ${slot.day} slot`}
                      onClick={() => removeSlot(slot.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 transition hover:bg-rose-500/25"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No slots match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-white/10 px-6 py-4">
        <button className="rounded-md border border-white/10 px-4 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-white/5">
          Cancel
        </button>
      </div>
    </div>
  );
}
