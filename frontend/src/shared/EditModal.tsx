import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TextInput from "./TextInput";
import FieldStack from "./FieldStack";
import { GroupProductModifiers, Options } from "../types/type";

// ─── Shared primitives (same conventions as AddressTab / GeneralTab) ───────

function ToggleSwitch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f14] ${
        on ? "bg-sky-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-transform duration-200 ease-out ${
          on ? "translate-x-[20px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────

interface EditOptionModalProps {
  option: Options["modifierOption"]; // null = closed
  onClose: () => void;
  onSave: (patch: Partial<Options["modifierOption"]>) => void;
}

export default function EditModal({
  option,
  onClose,
  onSave,
}: EditOptionModalProps) {
  const [form, setForm] = useState<Partial<Options["modifierOption"]>>({});

  // Reset the draft whenever a different option is opened, so edits from a
  // previously-closed option never bleed into the next one.
  useEffect(() => {
    if (option) {
      setForm({
        name: option.name,
        nameLocalized: option.nameLocalized,
        price: option.price,
        cost: option.cost,
        sku: option.sku,
        isActive: option.isActive,
        isInStock: option.isInStock,
      });
    }
  }, [option]);

  useEffect(() => {
    if (!option) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [option, onClose]);

  if (!option) return null;

  const setField = <K extends keyof Options["modifierOption"]>(
    key: K,
    value: Options["modifierOption"][K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const title = option.nameLocalized
    ? `${option.name} - ${option.nameLocalized}`
    : option.name;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[480px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/60"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="truncate text-[14px] font-semibold text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <FieldStack label="English name">
            <TextInput
              value={form.name ?? ""}
              onChange={(e) => setField("name", e.target.value)}
            />
          </FieldStack>
          <FieldStack label="Arabic name">
            <TextInput
              value={form.nameLocalized ?? ""}
              placeholder="Arabic name"
              onChange={(e) => setField("nameLocalized", e.target.value)}
            />
          </FieldStack>
          <FieldStack label="Sort order">
            <TextInput
              inputMode="numeric"
              value={form.index ?? 0}
              onChange={(e) =>
                setField(
                  "index",
                  Number(e.target.value.replace(/\D/g, "")) || 0,
                )
              }
            />
          </FieldStack>
          <FieldStack label="Price">
            <TextInput
              inputMode="decimal"
              value={form.price ?? 0}
              onChange={(e) => setField("price", Number(e.target.value) || 0)}
            />
          </FieldStack>
          <FieldStack label="Cost">
            <TextInput
              inputMode="decimal"
              placeholder="Cost"
              value={form.cost ?? ""}
              onChange={(e) =>
                setField("cost", e.target.value ? Number(e.target.value) : null)
              }
            />
          </FieldStack>
          <FieldStack label="SKU">
            <TextInput
              value={form.sku ?? ""}
              onChange={(e) => setField("sku", e.target.value)}
            />
          </FieldStack>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-200">Active</span>
              <ToggleSwitch
                on={!!form.isActive}
                onChange={(v) => setField("isActive", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-200">In stock</span>
              <ToggleSwitch
                on={!!form.isInStock}
                onChange={(v) => setField("isInStock", v)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-white/15 px-4 py-2 text-[13px] text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-sky-500 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
