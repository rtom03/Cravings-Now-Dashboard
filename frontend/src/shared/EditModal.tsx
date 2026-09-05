import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import TextInput from "./TextInput";
import { FieldRow } from "./FieldStack";
import { createPortal } from "react-dom"; // ← add this

import { GroupProductModifiers, Options } from "../types/type";
import { uploadImageToCloudinary } from "../lib/uploadImage";
import Loader from "../components/shared/Loader";
import { ImageUploadBox } from "../components/shared/ImageUploadBox";

// ─── Shared primitives (same conventions as AddressTab / GeneralTab) ───────

// ─── Modal ──────────────────────────────────────────────────────────────────

interface EditOptionModalProps {
  option: Options["modifierOption"] | null; // null = closed
  onClose: () => void;
  onSave: (patch: Partial<Options["modifierOption"]>) => void;
  isPending: boolean;
}

export default function EditModal({
  option,
  onClose,
  onSave,
  isPending,
}: EditOptionModalProps) {
  const [form, setForm] = useState<Partial<Options["modifierOption"]>>({});
  const [uploading, setUploading] = useState(false);

  // Reset the draft whenever a different option is opened, so edits from a
  // previously-closed option never bleed into the next one.
  useEffect(() => {
    if (option) {
      setForm({
        name: option.name,
        nameLocalized: option.nameLocalized,
        image: option.image,
        price: option.price,
        cost: option.cost,
        sku: option.sku,
        isActive: option.isActive,
        isInStock: option.isInStock,
      });
    }
  }, [option]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setField("image", imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

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

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 font-sans"
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
          <FieldRow label="Image">
            <ImageUploadBox
              image={form.image ?? option.image}
              onUploaded={(url) => setField("image", url)}
            />
          </FieldRow>
          <FieldRow label="English name">
            <TextInput
              value={form.name ?? ""}
              onChange={(e) => setField("name", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Price">
            <TextInput
              inputMode="decimal"
              value={form.price ?? 0}
              onChange={(e) => setField("price", Number(e.target.value) || 0)}
            />
          </FieldRow>
          <FieldRow label="Cost">
            <TextInput
              inputMode="decimal"
              placeholder="Cost"
              value={form.cost ?? ""}
              onChange={(e) =>
                setField("cost", e.target.value ? Number(e.target.value) : null)
              }
            />
          </FieldRow>
          <FieldRow label="SKU">
            <TextInput
              value={form.sku ?? ""}
              onChange={(e) => setField("sku", e.target.value)}
            />
          </FieldRow>
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
            disabled={uploading}
          >
            {isPending ? <Loader /> : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
