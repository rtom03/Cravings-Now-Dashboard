import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { FilterOption } from "../types/compo.type";

interface FilterDropdownProps {
  options: FilterOption[];
  /** Currently applied selection (from the parent's filter state). */
  selected: string[];
  onApply: (next: string[]) => void;
  onClose: () => void;
}

/**
 * Generic multi-select checkbox filter popover — not specific to any one
 * column. Feed it a list of {value,label} options and it works the same
 * way for Category, On/Off, Type, or anything else.
 *
 * Keeps its own draft selection so nothing is applied until "OK" is
 * pressed; "Reset" clears the draft (not the already-applied filter, until
 * OK confirms that too); clicking outside dismisses without applying —
 * matching the reference design's behavior.
 */
export function FilterDropdown({
  options,
  selected,
  onApply,
  onClose,
}: FilterDropdownProps) {
  const [draft, setDraft] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const toggle = (value: string) => {
    setDraft((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-30 mt-1 w-56 rounded-lg border border-white/10 bg-[#12151b] p-1 shadow-xl shadow-black/40"
    >
      <ul className="max-h-64 overflow-auto py-1">
        {options.length === 0 && (
          <li className="px-3 py-4 text-center text-[12px] text-slate-500">
            No options
          </li>
        )}
        {options.map((opt) => {
          const checked = draft.includes(opt.value);
          return (
            <li key={opt.value}>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-[13px] text-slate-200 hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    checked ? "border-sky-500 bg-sky-500" : "border-white/20"
                  }`}
                >
                  {checked && (
                    <Check
                      size={11}
                      className="text-slate-950"
                      strokeWidth={3}
                    />
                  )}
                </span>
                {opt.label}
              </label>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 px-2 py-2">
        <button
          onClick={() => setDraft([])}
          className="text-[12px] font-medium text-slate-400 hover:text-slate-200"
        >
          Reset
        </button>
        <button
          onClick={() => onApply(draft)}
          className="rounded-md bg-sky-500 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-sky-400"
        >
          OK
        </button>
      </div>
    </div>
  );
}
