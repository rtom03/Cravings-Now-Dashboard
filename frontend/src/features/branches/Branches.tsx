import { useEffect, useState } from "react";

import {
  Settings,
  AlignJustify,
  Trash2,
  Search,
  Plus,
  Store,
  Cloud,
  Package,
  Clock,
  CalendarClock,
  MapPin,
  Megaphone,
} from "lucide-react";
import HelpTable from "./HelpCenterTable";
import { useBranchStore } from "../../store/branchStore";
import { isBranchOpen } from "../../constants";
import { Branch, Branches } from "../../types/type";
import BranchSettingsModal from "./SettingsModal";
import MenuModal from "./MenuModal";
import AppLoader from "../../ui/AppLoader";
import { useBrandStore } from "../../store/brandStore";
import { useUserStore } from "../../store/userStore";
import { useSuperGroupById } from "../../api/groupQuery";
import { useBranch } from "../../api/branchQuery";
import ProductsCatalog from "./ProductsCatalog";
import WorkingHoursTab from "./WorkingHoursTab";
import DeliveryAreasTab from "./Deliveryareatab";
import BranchDetailsModal from "./branchdetailsModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BranchesPageProps {
  branches: Branches["branches"];
  totalLimit: number;
  posEnabled: number;
  posLimit: number;
  onSettings?: (id: string) => void;
  onMenu?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddOns?: () => void;
}

interface BranchCardProps {
  branch: Branch;
  onSettings?: (id: string) => void;
  onMenu?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// ─── Shared modal state type (defined once) ────────────────────────────────
interface MenuModalState {
  id: string;
  open: boolean;
}

interface SettingsModalState {
  id: string;
  open: boolean;
}

interface DeleteModalState {
  id: string;
  open: boolean;
}

const CLOSED_MENU_MODAL: MenuModalState = { id: "", open: false };
const CLOSED_SETTINGS_MODAL: SettingsModalState = { id: "", open: false };
const CLOSED_DELETE_MODAL: DeleteModalState = { id: "", open: false };

// ─── Sub-components ───────────────────────────────────────────────────────────

// ─── Custom Store Icon ──────────────────────────────────────────────────────

const StoreIcon = ({ size = 56 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Building body */}
    <rect x="8" y="22" width="40" height="28" rx="3" fill="#1d4e57" />
    {/* Door */}
    <rect x="24" y="34" width="8" height="16" rx="2" fill="#ffffff" />
    {/* Awning shadow/base */}
    <path d="M6 20L28 8L50 20V24H6V20Z" fill="#7a1418" />
    {/* Awning stripes */}
    <path d="M6 20L28 8L50 20V22H6V20Z" fill="#e2273e" />
    <path d="M12 20L28 11.5L44 20H12Z" fill="#c81f34" />
    {/* Awning scalloped edge */}
    <path
      d="M6 22C6 22 8.5 25 11 22C13.5 25 16 22 16 22C16 22 18.5 25 21 22C23.5 25 26 22 26 22C26 22 28.5 25 31 22C33.5 25 36 22 36 22C36 22 38.5 25 41 22C43.5 25 46 22 46 22C46 22 48.5 25 50 22V24H6V22Z"
      fill="#e2273e"
    />
  </svg>
);
// ─── Badge ──────────────────────────────────────────────────────────────────

const Badge = ({
  label,
  variant,
  icon: Icon,
}: {
  label: string;
  variant: "green" | "blue" | "red";
  icon?: React.ElementType;
}) => {
  const styles = {
    green: "bg-green-500/15 text-green-400",
    blue: "bg-blue-500/15 text-blue-400",
    red: "bg-red-500/15 text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md ${styles[variant]}`}
    >
      {Icon && <Icon size={11} />}
      {label}
    </span>
  );
};

// ─── BranchCard ─────────────────────────────────────────────────────────────

const BranchCard = ({
  branch,
  onSettings,
  onMenu,
  onDelete,
}: BranchCardProps) => {
  const open = isBranchOpen(branch.openingFrom, branch.openingTo);
  const online = branch.receives_online_orders;

  return (
    <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20"> */}
          <StoreIcon />
          {/* </div> */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[13px] font-bold text-white uppercase tracking-wide leading-snug mb-1.5 truncate">
              {branch.name}
            </p>
            <Badge
              label={online ? "Online" : "Offline"}
              variant={online ? "blue" : "red"}
              icon={Cloud}
            />
          </div>
        </div>

        <p className="text-[12px] text-gray-500 leading-relaxed mb-3">
          {branch.address || "No address set"}
          <br />
          {branch.phone || "No phone set"}
        </p>

        <div className="flex gap-1.5 flex-wrap">
          <Badge
            label={open ? "Available" : "Unavailable"}
            variant={open ? "green" : "red"}
          />
          <Badge label="Active" variant="green" />
        </div>
      </div>

      <div className="border-t border-white/5 flex">
        {[
          {
            icon: Settings,
            label: "Settings",
            handler: onSettings,
            danger: false,
          },
          { icon: AlignJustify, label: "Menu", handler: onMenu, danger: false },
          { icon: Trash2, label: "Delete", handler: onDelete, danger: true },
        ].map(({ icon: Icon, label, handler, danger }) => (
          <button
            key={label}
            aria-label={label}
            onClick={() => handler?.(branch.id)}
            className={`flex-1 flex items-center justify-center py-3 border-r border-white/5 last:border-r-0 transition-colors hover:bg-white/5 ${
              danger
                ? "text-red-400 hover:text-red-300"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
    </div>
  );
};

const FooterInfo = ({
  total,
  totalLimit,
  posEnabled,
  posLimit,
  onAddOns,
}: {
  total: number;
  totalLimit: number;
  posEnabled: number;
  posLimit: number;
  onAddOns?: () => void;
}) => (
  <div className="text-[12px] text-gray-400 space-y-0.5 mt-5">
    <p>
      Total: <strong className="text-gray-700">{total}</strong> branches
    </p>
    <p>
      POS branches enabled:{" "}
      <span className="text-blue-600">
        {posEnabled} out of {posLimit}
      </span>
    </p>
    <p>
      You can increase your branch's limit from{" "}
      <button
        onClick={onAddOns}
        className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer text-[12px]"
      >
        Add-Ons
      </button>
    </p>
  </div>
);

// ─── Presentational page component ─────────────────────────────────────────────

// ─── Entry point ────────────────────────────────────────────────────────────────
const BranchesPage = ({
  branches,
  totalLimit,
  posEnabled,
  posLimit,
  onSettings,
  onMenu,
  onDelete,
  onAddOns,
}: BranchesPageProps) => {
  // console.log("received:", branches);
  const [query, setQuery] = useState("");

  // const filtered = branches?.filter((b) =>
  //   b?.name?.toLowerCase().includes(query.toLowerCase()),
  // );
  const filtered = Array.isArray(branches)
    ? branches.filter((b) =>
        b?.name?.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="bg-gray-50 min-h-screen p-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[15px] font-medium text-gray-800">
            <Store size={18} className="text-gray-400" />
            Branches
          </div>
          <span className="text-[12px] text-gray-300 cursor-pointer hover:text-gray-500 transition-colors">
            Select all
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Search for a branch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none outline-none bg-transparent px-3 py-1.5 text-[12px] text-gray-700 w-44 placeholder:text-gray-300"
            />
            <button className="bg-blue-600 px-2.5 py-1.5 flex items-center justify-center">
              <Search size={14} className="text-white" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors">
            <Plus size={14} />
            Actions
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-1">
        {filtered.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onSettings={onSettings} // already (id) => void — no wrapping needed
            onMenu={onMenu}
            onDelete={() => onDelete?.(branch.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 text-[13px] text-gray-400 py-8 text-center">
            No branches match "{query}"
          </p>
        )}
      </div>

      {/* Footer */}
      <FooterInfo
        total={branches.length}
        totalLimit={totalLimit}
        posEnabled={posEnabled}
        posLimit={posLimit}
        onAddOns={onAddOns}
      />

      <HelpTable />
    </div>
  );
};

export default function Branches() {
  const { selectedBrandId } = useBrandStore();
  const { user } = useUserStore();
  const isAdmin = user?.user.role === "ADMIN";

  const TABS = [
    {
      key: "catalog",
      label: "Catalog",
      icon: Package,
      content: <ProductsCatalog setOpen={() => false} />,
    },
    {
      key: "hours",
      label: "Working Hours",
      icon: Clock,
      content: <WorkingHoursTab />,
    },
    {
      key: "slots",
      label: "Scheduled Delivery Slots",
      icon: CalendarClock,
      content: <WorkingHoursTab />,
    },
    {
      key: "areas",
      label: "Delivery Areas and Rates",
      icon: MapPin,
      content: <DeliveryAreasTab branchName="icm" />,
    },
    {
      key: "banner",
      label: "Notice Banner",
      icon: Megaphone,
      content: <WorkingHoursTab />,
    },
  ];

  // Only fetch the shape each role actually needs — same `enabled` pattern
  // used for useGroups earlier, so the other role's query never fires.
  const { data, isLoading, error } = useSuperGroupById(
    selectedBrandId!,
    isAdmin,
  );
  const { data: branch, isLoading: isBranchLoading } = useBranch(
    user?.user.branchId!,
    !isAdmin,
  );
  // console.log(data);

  const setBranches = useBranchStore((state) => state.setBranches);
  const { branches } = useBranchStore();

  const [menuModal, setMenuModal] = useState<MenuModalState>(CLOSED_MENU_MODAL);
  const [settingsModal, setSettingsModal] = useState<SettingsModalState>(
    CLOSED_SETTINGS_MODAL,
  );
  const [deleteModal, setDeleteModal] =
    useState<DeleteModalState>(CLOSED_DELETE_MODAL);

  // ─── Normalize both shapes into one array, once, right here ─────────────
  // Admin: `data` is already GroupBranch[] (a real list of branches).
  // Store user: `branch` is a single GroupBranch — wrapped in a one-item
  // array so BranchesPage never has to know which role it's rendering for.
  useEffect(() => {
    if (isAdmin && data) {
      setBranches(data);
    } else if (!isAdmin && branch) {
      setBranches([branch]);
    }
  }, [isAdmin, data, branch, setBranches]);

  const loading = isAdmin ? isLoading : isBranchLoading;

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-5 flex items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-5 flex items-center justify-center">
        <p className="text-[13px] text-red-500">
          Failed to load branches. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BranchesPage
        branches={branches || []}
        totalLimit={15}
        posEnabled={0}
        posLimit={0}
        onAddOns={() => console.log("navigate to add-ons")}
        onSettings={(id) => setSettingsModal({ id, open: true })}
        onMenu={(id) => setMenuModal({ id, open: true })}
        onDelete={(id) => setDeleteModal({ id, open: true })}
      />
      {menuModal.open === true && (
        // <MenuModal
        //   id={menuModal.id}
        //   open={menuModal.open}
        //   setOpen={() => setMenuModal((prev) => ({ ...prev, open: false }))}
        //   tabs={TABS!}
        // />
        <BranchDetailsModal
          branchId={menuModal.id}
          open={menuModal.open}
          setOpen={() => setMenuModal((prev) => ({ ...prev, open: false }))}
        />
      )}
      {settingsModal.open && (
        <BranchSettingsModal
          id={settingsModal.id}
          open={settingsModal.open}
          setOpen={() => setSettingsModal((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
}
