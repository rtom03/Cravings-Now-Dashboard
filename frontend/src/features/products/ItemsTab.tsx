import { useRef, useState } from "react";
import { Upload, ChevronDown, RefreshCw } from "lucide-react";

// ─── Shared form primitives (same conventions as AddressTab/GeneralTab) ────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
      <label className="text-[13px] text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-white/10 bg-[#12151b] px-3 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
    />
  );
}

function Dropdown({
  value,
  placeholder,
}: {
  value?: string;
  placeholder: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-md border border-white/10 bg-[#12151b] px-3 py-2.5 text-[13px] hover:border-white/20 focus:border-sky-500/60 focus:outline-none"
    >
      <span className={value ? "text-slate-200" : "text-slate-500"}>
        {value ?? placeholder}
      </span>
      <ChevronDown size={14} className="text-slate-500" />
    </button>
  );
}

// ─── Reference data — taken directly from the screenshots ──────────────────

interface ProductDetailsForm {
  productType: string;
  mainCategory: string;
  otherCategories: string;
  price: string;
  discountedFrom: string;
  barcode: string;
  baseUnit: string;
  supplier: string;
  cost: string;
  sku: string;
  assignedSection: string;
}

const INITIAL_FORM: ProductDetailsForm = {
  productType: "Produced",
  mainCategory: "KREME DEALS",
  otherCategories: "",
  price: "15300.00",
  discountedFrom: "21500.00",
  barcode: "",
  baseUnit: "",
  supplier: "",
  cost: "",
  sku: "sk-2117",
  assignedSection: "",
};

// ─── Main image upload ──────────────────────────────────────────────────────

function MainImageUpload({
  imageUrl,
  onChange,
  onDelete,
}: {
  imageUrl: string | null;
  onChange: (url: string) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-3">
      <p className="text-[13px] font-medium text-slate-300">Main image</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="mx-auto flex w-40 cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-white/15 bg-[#12151b] p-3 text-center transition hover:border-sky-500/40"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            className="h-28 w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-28 w-full items-center justify-center rounded-md bg-white/[0.03]">
            <Upload size={20} className="text-slate-600" />
          </div>
        )}
      </div>

      <div className="text-center">
        {imageUrl && (
          <button
            onClick={onDelete}
            className="text-[12.5px] font-medium text-rose-400 hover:text-rose-300"
          >
            Delete
          </button>
        )}
        <p className="text-[12px] text-slate-500">Click or drag to change</p>
      </div>

      <div className="space-y-0.5 text-center text-[11.5px] text-slate-500">
        <p>Recommended ratio 4:5 (Width to height)</p>
        <p>Recommended size: 1080 width x 1350 height</p>
        <p>Max image size: 2.5 MB</p>
        <p>Applies to all images</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

function GallerySection() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3 border-t border-white/10 pt-5">
      <p className="text-[13px] font-medium text-slate-300">Gallery</p>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-md border border-white/10 px-3.5 py-2 text-[13px] font-medium text-slate-300 transition hover:bg-white/5"
      >
        <Upload size={14} />
        Upload
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}

// ─── Barcode preview (simulated bars, not a real barcode-generation lib) ───

function BarcodePreview({
  brandName,
  price,
}: {
  brandName: string;
  price: string;
}) {
  // A deterministic-looking bar pattern from a hash of the value, purely
  // visual — swap for a real barcode library (e.g. jsbarcode) when this
  // needs to be scannable rather than illustrative.
  const bars = Array.from({ length: 40 }, (_, i) =>
    i % 7 === 0 ? 3 : (i % 3) + 1,
  );

  return (
    <div className="w-52 rounded-md border border-white/10 bg-white px-4 py-4 text-center">
      <p className="text-[13px] font-bold uppercase tracking-wide text-slate-900">
        {brandName}
      </p>
      <div className="mt-2 flex h-12 items-end justify-center gap-[1.5px]">
        {bars.map((w, i) => (
          <span
            key={i}
            className="bg-slate-900"
            style={{ width: `${w}px`, height: "100%" }}
          />
        ))}
      </div>
      <p className="mt-2 text-[12px] font-semibold text-slate-900">
        NGN {Number(price || 0).toFixed(3)}
      </p>
    </div>
  );
}

// ─── Tab ────────────────────────────────────────────────────────────────────

export default function ItemsTab({
  productName = "KRISPY KREME",
}: {
  productName?: string;
}) {
  const [form, setForm] = useState<ProductDetailsForm>(INITIAL_FORM);
  const [imageUrl, setImageUrl] = useState<string | null>(
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=250&fit=crop",
  );
  const [barcodeGenerated, setBarcodeGenerated] = useState(false);

  const setField =
    (key: keyof ProductDetailsForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const generateSku = () => {
    setForm((prev) => ({
      ...prev,
      sku: `sk-${Math.floor(1000 + Math.random() * 9000)}`,
    }));
  };

  return (
    <div className="grid flex-1 grid-cols-2 gap-8 overflow-y-auto px-6 py-5">
      {/* Left — image */}
      <div className="space-y-5">
        <MainImageUpload
          imageUrl={imageUrl}
          onChange={setImageUrl}
          onDelete={() => setImageUrl(null)}
        />
        <GallerySection />
      </div>

      {/* Right — General Info */}
      <div className="space-y-4">
        <p className="text-[13px] font-medium text-slate-300">General Info</p>

        <Field label="Product Type">
          <Dropdown value={form.productType} placeholder="Select type" />
        </Field>
        <Field label="Main category">
          <Dropdown value={form.mainCategory} placeholder="Select category" />
        </Field>
        <Field label="Other categories">
          <TextInput
            placeholder="Other categories (optional)"
            value={form.otherCategories}
            onChange={setField("otherCategories")}
          />
        </Field>
        <Field label="Price">
          <TextInput value={form.price} onChange={setField("price")} />
        </Field>
        <Field label="Discounted from">
          <TextInput
            value={form.discountedFrom}
            onChange={setField("discountedFrom")}
          />
        </Field>
        <Field label="Barcode">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TextInput
                placeholder="Barcode"
                value={form.barcode}
                onChange={setField("barcode")}
                className="flex-1"
              />
              <button
                disabled={!barcodeGenerated}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-white/10 px-3 py-2.5 text-[13px] text-slate-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Upload size={14} className="rotate-180" />
                Download
              </button>
              <button
                onClick={() => setBarcodeGenerated(true)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-white/10 px-3 py-2.5 text-[13px] font-medium text-slate-200 transition hover:bg-white/5"
              >
                <RefreshCw size={14} />
                Generate
              </button>
            </div>

            {barcodeGenerated && (
              <BarcodePreview brandName={productName} price={form.price} />
            )}
          </div>
        </Field>

        <div className="space-y-4 border-t border-white/10 pt-4">
          <Field label="Base Unit">
            <Dropdown placeholder="Unit (Optional)" />
          </Field>
          <Field label="Supplier">
            <Dropdown placeholder="Supplier (Optional)" />
          </Field>
          <Field label="Cost">
            <TextInput
              placeholder="Cost"
              value={form.cost}
              onChange={setField("cost")}
            />
          </Field>
          <Field label="SKU">
            <div className="flex items-center gap-2">
              <TextInput
                value={form.sku}
                onChange={setField("sku")}
                className="flex-1"
              />
              <button
                onClick={generateSku}
                className="whitespace-nowrap rounded-md border border-white/10 px-3 py-2.5 text-[13px] font-medium text-slate-200 transition hover:bg-white/5"
              >
                Generate SKU
              </button>
            </div>
          </Field>
          <Field label="Assigned to section">
            <Dropdown placeholder="Section (Optional)" />
          </Field>
        </div>
      </div>
    </div>
  );
}
