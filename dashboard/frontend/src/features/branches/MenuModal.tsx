import { ReactNode, useEffect, useState } from "react";
import { X, MapPin, LucideIcon, LucideProps } from "lucide-react";
import { useBranchStore } from "../../store/branchStore";
import { useBranch } from "../../api/branchQuery";
import { MenuModalSkeleton } from "../../ui/ModalSkeleton";

// ---------------------------------------------------------------------------
// Local shape of a catalog row, inferred from how it's used below
// (row.id, row.name, row.nameLocalized, row.image, row.isActive,
// row.category.name). If `toBranchWithProducts` already exports a real
// Product/BranchProduct type, prefer importing that instead of this —
// this is a stand-in so the component type-checks without guessing at
// a type definition that lives elsewhere.
// ---------------------------------------------------------------------------

interface ModalTabProps<TKey extends string> {
  key: TKey;
  label: string;
  icon?: LucideIcon | LucideProps;
  content: ReactNode;
}

type ModalProps<TKey extends string> = {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  tabs: ModalTabProps<TKey>[];
};

// Columns for the catalog table — order preserved from the original screenshots.

export default function MenuModal<TKey extends string>({
  id,
  open,
  setOpen,
  tabs,
}: ModalProps<TKey>) {
  const setSelected = useBranchStore((state) => state.setSelectedBranch);
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  // console.log(id);
  // console.log(selectedBranch);

  // Guard against a force-unwrap here: on the very first render
  // `selectedBranch` may still be null/undefined, since it's only
  // populated by the effect below once `branch` has loaded. Falls back to
  // an empty product list so hooks below always have a stable value to
  // work with regardless of load order.
  // console.log("MenuModal rendered", {
  //   id,
  //   open,
  // });
  const { data: branch, isPending, isError, error } = useBranch(id!);
  // console.log("Branch query", {
  //   id,
  //   branch,
  //   isPending,
  //   isError,
  //   error,
  // });
  useEffect(() => {
    if (branch) {
      setSelected(branch);
      // console.log("Branch:", branch);
      // console.log("ID:", id);
    }
  }, [branch, id, setSelected]);

  const [activeTab, setActiveTab] = useState<TKey>(tabs[0].key);
  // const scrollRatio = useHorizontalScrollProgress(tableScrollRef);

  if (!open) return null;

  if (isPending) {
    return <MenuModalSkeleton />;
  }
  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.content;
  return (
    // <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans max-h-[120vh]  overflow-y-auto overflow-x-hidden ">
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-6">
      <div className="flex w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0d1a2e] to-[#0d0f14] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <MapPin size={18} />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-100">
                {selectedBranch?.name}
              </h2>
              <p className="text-xs text-slate-500">
                Manage catalog, hours, delivery and messaging for this location
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 bg-[#0d0f14] px-4">
          {tabs?.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[13px] font-medium transition ${
                  active
                    ? "text-sky-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {/* <Icon size={14} /> */}
                {tab.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-sky-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeTabContent}
        </div>
      </div>
    </div>
  );
}
