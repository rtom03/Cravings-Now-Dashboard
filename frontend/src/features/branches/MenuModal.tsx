import { useEffect, useState } from "react";
import {
  X,
  Clock,
  MapPin,
  Megaphone,
  CalendarClock,
  Package,
  ChevronRight,
} from "lucide-react";
import { useBranch } from "../../api/branchQuery";
import { useBranchStore } from "../../store/branchStore";

import {
  CATALOG_SKELETON_COLUMNS,
  CatalogTableSkeleton,
} from "../../ui/CatalogTableSkeleton";
import ProductsCatalog from "./ProductsCatalog";
import WorkingHoursTab from "./WorkingHoursTab";
import DeliveryAreasTab from "./Deliveryareatab";

// ---------------------------------------------------------------------------
// Local shape of a catalog row, inferred from how it's used below
// (row.id, row.name, row.nameLocalized, row.image, row.isActive,
// row.category.name). If `toBranchWithProducts` already exports a real
// Product/BranchProduct type, prefer importing that instead of this —
// this is a stand-in so the component type-checks without guessing at
// a type definition that lives elsewhere.
// ---------------------------------------------------------------------------

const TABS = [
  { key: "catalog", label: "Catalog", icon: Package },
  { key: "hours", label: "Working Hours", icon: Clock },
  { key: "slots", label: "Scheduled Delivery Slots", icon: CalendarClock },
  { key: "areas", label: "Delivery Areas and Rates", icon: MapPin },
  { key: "banner", label: "Notice Banner", icon: Megaphone },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Columns for the catalog table — order preserved from the original screenshots.

export default function MenuModal({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { branches } = useBranchStore();

  const setSelected = useBranchStore((state) => state.setSelectedBranch);
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  // console.log(selectedBranch);

  // Guard against a force-unwrap here: on the very first render
  // `selectedBranch` may still be null/undefined, since it's only
  // populated by the effect below once `branch` has loaded. Falls back to
  // an empty product list so hooks below always have a stable value to
  // work with regardless of load order.

  useEffect(() => {
    if (branches) {
      const match = branches.find((br) => br.id === id);
      // console.log(match);
      if (match) {
        setSelected(match);
      }
    }
  }, [branches, setSelected]);

  const [activeTab, setActiveTab] = useState<TabKey>("catalog");

  // const scrollRatio = useHorizontalScrollProgress(tableScrollRef);

  if (!open) return null;

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
          {TABS.map((tab) => {
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
                <Icon size={14} />
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
          {activeTab === "catalog" ? (
            // isPending ? (
            //   <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
            //     <CatalogTableSkeleton
            //       columns={CATALOG_SKELETON_COLUMNS}
            //       rows={8}
            //     />

            //     {/* <Loader /> */}
            //   </div>
            // ) : isError ? (
            //   <div className="flex flex-1 items-center justify-center text-sm text-rose-400">
            //     Couldn&rsquo;t load this branch&rsquo;s catalog. Try again.
            //   </div>
            // ) : (
            <div>
              <ProductsCatalog setOpen={setOpen} />
            </div>
          ) : // )
          activeTab === "hours" ? (
            <WorkingHoursTab />
          ) : activeTab === "areas" ? (
            <DeliveryAreasTab branchName="icm" />
          ) : (
            <EmptyTab tab={TABS.find((t) => t.key === activeTab)!} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyTab({ tab }: { tab: (typeof TABS)[number] }) {
  const Icon = tab.icon;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm font-medium text-slate-200">{tab.label}</p>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          This tab&rsquo;s layout will follow the same table pattern as Catalog
          once its data and fields are provided.
        </p>
      </div>
      <button className="mt-2 flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300">
        Configure {tab.label.toLowerCase()}
        <ChevronRight size={13} />
      </button>
    </div>
  );
}
