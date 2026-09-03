import { useState } from "react";
import {
  Plus,
  Upload,
  Pencil,
  Check,
  Trash2,
  History,
  X,
  ChevronDown,
} from "lucide-react";
import { GroupProductModifiers, Options } from "../../types/type";
import { useUpdateModifierOption } from "../../api/productMutate";
import MainImageUpload from "../../shared/MainImageUpload";

// Local alias kept only because ProductOptionsTab was written against
// `OptionEntry` internally — maps directly to the canonical `Options` type,
// no shape difference.
type OptionEntry = Options;

// ─── Small primitives ────────────────────────────────────────────────────────

function IconButton({
  icon: Icon,
  tone,
  onClick,
  label,
}: {
  icon: React.ElementType;
  tone: "edit" | "confirm" | "danger" | "history";
  onClick?: () => void;
  label: string;
}) {
  const toneClasses = {
    edit: "border border-white/15 text-slate-300 hover:bg-white/5",
    confirm: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
    danger: "border border-rose-500/40 text-rose-400 hover:bg-rose-500/10",
    history: "text-sky-400 hover:bg-sky-500/10",
  }[tone];

  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${toneClasses}`}
    >
      <Icon size={13} />
    </button>
  );
}

function ConstraintBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 text-[12px] font-medium text-emerald-400">
      <Check size={12} strokeWidth={3} />
      {label}
    </span>
  );
}

// ─── Options table header ───────────────────────────────────────────────────

function OptionsTableHeader() {
  const cols = [
    { label: "Sort order", width: "100px" },
    { label: "Image", width: "90px" },
    { label: "English", width: "1fr" },
    { label: "Arabic", width: "1fr" },
    { label: "Price", width: "100px" },
    { label: "Modifier", width: "140px" },
    { label: "Controls", width: "120px" },
    { label: "History", width: "80px" },
  ];
  return (
    <div
      className="grid items-center border-b border-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
      style={{ gridTemplateColumns: cols.map((c) => c.width).join(" ") }}
    >
      {cols.map((c) => (
        <span
          key={c.label}
          className={c.label === "Sort order" ? "" : "text-center"}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}

// ─── One option row ──────────────────────────────────────────────────────────

function OptionRow({
  option,
  onUpdate,
  onRemove,
  onToggleActive,
}: {
  option: Options["modifierOption"];
  onUpdate: (patch: Partial<Options["modifierOption"]>) => void;
  onRemove: () => void;
  onToggleActive: () => void;
}) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // temporary — upload file and get URL here
    const imageUrl = URL.createObjectURL(file);

    onUpdate({
      image: imageUrl,
    });
  };
  return (
    <div
      className="grid items-center border-b border-white/[0.06] px-4 py-3 transition hover:bg-white/[0.03]"
      style={{
        gridTemplateColumns: "100px 90px 1fr 1fr 100px 140px 120px 80px",
      }}
    >
      <div className="relative flex justify-center">
        <div className="h-14 w-14 overflow-hidden rounded-md border border-white/10 bg-white/5">
          {/* <img src={option?.image} alt="" /> */}
          <label className="cursor-pointer">
            <div className="h-14 w-14 overflow-hidden rounded-md border border-white/10 bg-white/5">
              {option.image ? (
                <img
                  src={option.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  Upload
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <button
          onClick={onRemove}
          aria-label="Remove option"
          className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white"
        >
          <X size={10} strokeWidth={3} />
        </button>
      </div>

      <span className="text-center text-[13px] font-medium text-slate-100">
        {option.name}
      </span>
      <span className="text-center text-[13px] text-slate-300">
        {option.nameLocalized ?? option.name}
      </span>
      <span className="text-center text-[13px] text-slate-300">
        {option.price.toFixed(2)}
      </span>

      {/* "No Modifier" — literal constant; no nested-modifier field exists
          on ModifierOption in the data we have, matching the same
          "Type: Produced" convention used in the Products table. */}
      <span className="text-center text-[12.5px] text-slate-500">
        No Modifier
      </span>

      <div className="flex items-center justify-center gap-1.5">
        <IconButton icon={Pencil} tone="edit" label="Edit option" />
        <IconButton
          icon={Check}
          tone="confirm"
          label={option.isActive ? "Deactivate option" : "Activate option"}
          onClick={onToggleActive}
        />
        <IconButton
          icon={Trash2}
          tone="danger"
          label="Delete option"
          onClick={onRemove}
        />
      </div>

      <div className="flex justify-center">
        <IconButton icon={History} tone="history" label="View history" />
      </div>
    </div>
  );
}

// ─── Inline "add new option" row ────────────────────────────────────────────

function AddOptionRow({
  onAdd,
}: {
  onAdd: (draft: Partial<Options["modifierOption"]>) => void;
}) {
  const [draft, setDraft] = useState({
    sortOrder: "",
    name: "",
    nameLocalized: "",
    price: "",
  });

  const submit = () => {
    if (!draft.name.trim()) return;
    onAdd({
      index: draft.sortOrder ? Number(draft.sortOrder) : 0,
      name: draft.name.trim(),
      nameLocalized: draft.nameLocalized.trim() || null,
      price: Number(draft.price) || 0,
    });
    setDraft({ sortOrder: "", name: "", nameLocalized: "", price: "" });
  };

  return (
    <div
      className="grid items-center gap-2 border-b border-white/[0.06] px-4 py-3"
      style={{ gridTemplateColumns: "100px 90px 1fr 1fr 100px 140px 40px" }}
    >
      <input
        placeholder="Sort or..."
        value={draft.sortOrder}
        onChange={(e) => setDraft((d) => ({ ...d, sortOrder: e.target.value }))}
        className="w-full rounded-md border border-white/10 bg-[#12151b] px-2 py-1.5 text-center text-[12.5px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
      />

      <button className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-white/15 py-2 text-[10.5px] text-slate-400 hover:border-sky-500/40">
        <Upload size={13} />
        Upload
      </button>

      <input
        placeholder="English name"
        value={draft.name}
        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        className="w-full rounded-md border border-white/10 bg-[#12151b] px-2.5 py-1.5 text-[12.5px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
      />
      <input
        placeholder="Arabic name"
        value={draft.nameLocalized}
        onChange={(e) =>
          setDraft((d) => ({ ...d, nameLocalized: e.target.value }))
        }
        className="w-full rounded-md border border-white/10 bg-[#12151b] px-2.5 py-1.5 text-[12.5px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
      />
      <input
        placeholder="Price"
        value={draft.price}
        onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
        className="w-full rounded-md border border-white/10 bg-[#12151b] px-2.5 py-1.5 text-center text-[12.5px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
      />

      <button className="flex items-center justify-between gap-1.5 rounded-md border border-white/10 bg-[#12151b] px-2.5 py-1.5 text-[12px] text-slate-500 hover:border-white/20">
        Select modifier (optional)
        <ChevronDown size={12} />
      </button>

      <button
        onClick={submit}
        aria-label="Add option"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/50 text-emerald-400 transition hover:bg-emerald-500/10"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ─── One modifier group section ─────────────────────────────────────────────

function ModifierGroupSection({
  group,
  index,
  onGroupChange,
}: {
  group: GroupProductModifiers;
  index: number;
  onGroupChange: (next: GroupProductModifiers) => void;
}) {
  const isRequired = group.minimumOptions > 0; // inferred — no direct boolean field
  const isMultiple = group.maximumOptions > 1; // inferred — no direct boolean field

  // const updateOption = (
  //   optionId: string,
  //   patch: Partial<Options["modifierOption"]>,
  // ) => {
  //   onGroupChange({
  //     ...group,
  //     modifier: {
  //       ...group.modifier,
  //       options: group.modifier.options.map((o) =>
  //         o.modifierOptionId === optionId
  //           ? { ...o, modifierOption: { ...o.modifierOption, ...patch } }
  //           : o,
  //       ),
  //     },
  //   });
  // };
  const updateModifierOption = useUpdateModifierOption();

  const updateOption = (
    optionId: string,
    patch: Partial<Options["modifierOption"]>,
  ) => {
    // Update UI immediately
    onGroupChange({
      ...group,
      modifier: {
        ...group.modifier,
        options: group.modifier.options.map((o) =>
          o.modifierOptionId === optionId
            ? {
                ...o,
                modifierOption: {
                  ...o.modifierOption,
                  ...patch,
                },
              }
            : o,
        ),
      },
    });

    // Save to backend
    updateModifierOption.mutate({
      id: optionId,
      data: patch,
    });
  };
  const removeOption = (optionId: string) => {
    onGroupChange({
      ...group,
      modifier: {
        ...group.modifier,
        options: group.modifier.options.filter(
          (o) => o.modifierOptionId !== optionId,
        ),
      },
    });
  };

  const addOption = (draft: Partial<Options["modifierOption"]>) => {
    const newOption: OptionEntry = {
      modifierId: group.modifierId,
      modifierOptionId: `temp-${Date.now()}`,
      modifierOption: {
        id: `temp-${Date.now()}`,
        foodicsId: "",
        sku: "",
        name: draft.name ?? "",
        nameLocalized: draft.nameLocalized ?? null,
        isActive: true,
        isInStock: true,
        costingMethod: 1,
        price: draft.price ?? 0,
        cost: null,
        calories: null,
        index: draft.index ?? 0,
        taxGroupId: null,
      },
    };
    onGroupChange({
      ...group,
      modifier: {
        ...group.modifier,
        options: [...group.modifier.options, newOption],
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      {/* Group header */}
      <div className="flex items-center justify-between bg-white/[0.04] px-4 py-3">
        <div>
          <p className="text-[11px] text-slate-500">#{index}</p>
          <p className="text-[13px] font-semibold text-slate-100">
            {group.modifier.name}
          </p>
          <p className="text-[12px] text-slate-400">
            {group.modifier.nameLocalized ?? group.modifier.name}
          </p>
        </div>
        <button className="flex items-center gap-1 text-[12.5px] font-medium text-sky-400 hover:text-sky-300">
          Edit
          <ChevronDown size={12} className="-rotate-90" />
        </button>
      </div>

      {/* Constraints bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#0a0c10] px-4 py-2">
        <span className="text-[12px] font-medium text-slate-300">
          (Min: {group.minimumOptions}, Max: {group.maximumOptions})
        </span>
        {isRequired && <ConstraintBadge label="Required" />}
        {isMultiple && <ConstraintBadge label="Multiple" />}
      </div>

      {/* Table */}
      <OptionsTableHeader />
      {group.modifier.options
        .filter((opt) => opt.modifierOption.isActive)
        .map((option) => (
          <OptionRow
            key={option.modifierOptionId}
            option={option.modifierOption}
            onUpdate={(patch) => updateOption(option.modifierOptionId, patch)}
            onRemove={() => removeOption(option.modifierOptionId)}
            onToggleActive={() =>
              updateOption(option.modifierOptionId, {
                isActive: !option.modifierOption.isActive,
              })
            }
          />
        ))}
      <AddOptionRow onAdd={addOption} />
    </div>
  );
}

// ─── Tab ────────────────────────────────────────────────────────────────────

export default function ProductOptionsTab({
  groupProductModifiers,
}: {
  groupProductModifiers: GroupProductModifiers[];
}) {
  const [groups, setGroups] = useState(groupProductModifiers);

  // updateMutation.mutate({
  //   id: groups,
  //   data: {
  //     price: 2500,
  //   },
  // });

  // console.log(groups);

  const updateGroup = (i: number, next: GroupProductModifiers) => {
    setGroups((prev) => prev.map((g, idx) => (idx === i ? next : g)));
  };

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
          <Plus size={15} />
          Add Option
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-400">Copy Options:</span>
          <button className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
            <Plus size={15} />
            From product
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
            <Plus size={15} />
            To other products
          </button>
        </div>
      </div>

      {/* Modifier groups */}
      {groups?.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-slate-500">
          This product has no modifier groups yet.
        </p>
      ) : (
        groups?.map((group, i) => (
          <ModifierGroupSection
            key={group.modifierId}
            group={group}
            index={i}
            onGroupChange={(next) => updateGroup(i, next)}
          />
        ))
      )}
    </div>
  );
}
