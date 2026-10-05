// components/shared/DeactivateTimeframeSelect.tsx
import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { DEACTIVATION_DURATIONS } from "../lib/duration";

interface DeactivateTimeframeSelectProps {
  onSelect: (minutes: number) => void;
  disabled?: boolean;
}

export function DeactivateTimeframeSelect({
  onSelect,
  disabled,
}: DeactivateTimeframeSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#12151b] px-2.5 py-1.5 text-[12px] text-slate-300 hover:border-white/20 disabled:opacity-50"
      >
        <Clock size={12} />
        Deactivate for...
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-md border border-white/10 bg-[#12151b] py-1 shadow-lg">
          {DEACTIVATION_DURATIONS.map((d) => (
            <button
              key={d.minutes}
              type="button"
              onClick={() => {
                onSelect(d.minutes);
                setOpen(false);
              }}
              className="block w-full px-3 py-1.5 text-left text-[12.5px] text-slate-300 hover:bg-white/5"
            >
              {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
