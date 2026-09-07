import { ChevronDown } from "lucide-react";
import { useBranchStore } from "../../store/branchStore";

// ─── Shared primitives (same conventions as GeneralTab) ────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
      <label className="text-[13px] text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-white/10 bg-[#323e55] px-3 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
    />
  );
}

function Dropdown({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-md border border-white/10 bg-[#12151b] px-3 py-2.5 text-[13px] text-slate-200 hover:border-white/20 focus:border-sky-500/60 focus:outline-none"
    >
      {value}
      <ChevronDown size={14} className="text-slate-500" />
    </button>
  );
}

// ─── Reference data — taken directly from the screenshot, nothing invented ──

// ─── Tab component ──────────────────────────────────────────────────────────

export default function AddressTab() {
  const { selectedBranch } = useBranchStore();

  return (
    <div className="space-y-4">
      <Field label="Country">
        <Dropdown value={"Nigeria"} />
      </Field>
      <Field label="Area">
        <Dropdown value={selectedBranch?.address!} />
      </Field>
      <Field label="Block">
        <TextInput
          placeholder="Block"
          //   onChange={setField("block")}
        />
      </Field>
      <Field label="Street">
        <TextInput
          placeholder="Street"
          value={selectedBranch?.address!}
          //   onChange={setField("street")}
        />
      </Field>
      <Field label="Building">
        <TextInput
          placeholder="Building"
          //   value={form.building}
          //   onChange={setField("building")}
        />
      </Field>
      <Field label="Avenue">
        <TextInput
          placeholder="Avenue"
          //   value={form.avenue}
          //   onChange={setField("avenue")}
        />
      </Field>
      <Field label="Floor">
        <TextInput
          placeholder="Floor"
          //   value={form.floor}
          //   onChange={setField("floor")}
        />
      </Field>
      <Field label="Apartment">
        <TextInput
          placeholder="Apartment"
          //   value={form.apartment}
          //   onChange={setField("apartment")}
        />
      </Field>
    </div>
  );
}
