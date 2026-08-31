import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id?: string;
  value: string | null;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}

function Dropdown({
  id,
  value,
  options,
  placeholder,
  onChange,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-md border bg-[#12151b] px-3 py-2 text-left text-[13px] transition ${
          open
            ? "border-sky-500/70 ring-1 ring-sky-500/30"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className={selected ? "text-slate-200" : "text-slate-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 top-full z-30 mt-1 w-full overflow-hidden rounded-md border border-white/10 bg-[#12151b] py-1 shadow-2xl shadow-black/50"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition ${
                  isSelected
                    ? "text-sky-400"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                {opt.label}
                {isSelected && <Check size={13} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Period select — the specific case, taken directly from the reference ──

export const PERIOD_OPTIONS: DropdownOption[] = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "3h", label: "3 hours" },
  { value: "6h", label: "6 hours" },
  { value: "9h", label: "9 hours" },
  { value: "12h", label: "12 hours" },
  { value: "24h", label: "24 hours" },
];

export interface PeriodSelectProps {
  id?: string;
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export function PeriodSelect({
  id,
  value,
  onChange,
  className,
}: PeriodSelectProps) {
  return (
    <Dropdown
      id={id}
      value={value}
      options={PERIOD_OPTIONS}
      placeholder="Select a period"
      onChange={onChange}
      className={className}
    />
  );
}
