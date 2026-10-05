import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { navItems } from "../../constants";
import {
  Volume2,
  VolumeX,
  User,
  Headset,
  X,
  ChevronDown,
  UserCircle,
  QrCode,
  LogOut,
  Check,
} from "lucide-react";
import { Groups } from "../../types/type";
import { useUserStore } from "../../store/userStore";
import { useGroups } from "../../api/groupQuery";
import { useBrandStore } from "../../store/brandStore";
import { UserRole } from "../../constants/index.type";

// ─── Types ──────────────────────────────────────────────────────────────────

// Labels get a small status dot without needing navItems itself to carry
// badge metadata — keeps the existing constants file untouched.
const DOT_LABELS = new Set(["Orders", "Customers"]);
const GREEN_DOT_LABELS = new Set(["Help"]);

// ─── User menu popover ──────────────────────────────────────────────────────

function UserMenu({
  onClose,
  userEmail,
  brands,
  currentBrandId,
  onBrandChange,
  onLogout,
  user,
}: {
  onClose: () => void;
  userEmail: string | undefined;
  brands: Groups[];
  currentBrandId?: string;
  onBrandChange?: (id: string) => void;
  onLogout?: () => void;
  user: UserRole;
}) {
  const [branchListOpen, setBranchListOpen] = useState(false);
  const currentBrand =
    brands?.find((b) => b.id === currentBrandId) ?? brands[0];

  return (
    <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-white/10 bg-[#12151b] shadow-2xl shadow-black/60">
      {/* Email */}
      <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-3">
        <span className="truncate text-[12.5px] text-slate-300">
          {userEmail}
        </span>
        <button
          onClick={onClose}
          className="shrink-0 rounded p-0.5 text-slate-500 hover:bg-white/5 hover:text-slate-300"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3 p-3">
        {/* Branch switcher */}
        {user === "ADMIN" && (
          <div className="relative">
            <button
              onClick={() => setBranchListOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-md border border-white/10 bg-[#0d0f14] px-3 py-2 text-[12.5px] text-slate-200 hover:border-white/20"
            >
              <span className="truncate">
                {currentBrand?.name ?? "Select a branch"}
              </span>
              <ChevronDown size={13} className="shrink-0 text-slate-500" />
            </button>
            {branchListOpen && brands.length > 0 && (
              <div className="absolute left-0 top-full z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-white/10 bg-[#0d0f14] py-1 shadow-xl">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onBrandChange?.(b.id);
                      setBranchListOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] text-slate-200 hover:bg-white/5"
                  >
                    <span className="truncate">{b.name}</span>
                    {b.id === currentBrandId && (
                      <Check size={13} className="text-sky-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Profile / QR code */}
        <div className="space-y-0.5">
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-slate-200 hover:bg-white/5">
            <UserCircle size={16} className="text-slate-400" />
            Profile
          </button>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-slate-200 hover:bg-white/5">
            <QrCode size={16} className="text-slate-400" />
            QR Code
          </button>
        </div>

        {/* Language */}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-md border-t border-white/5 px-2 pt-3 text-left text-[13px] text-rose-400 hover:text-rose-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [soundOn, setSoundOn] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUserStore();
  // console.log(user?.user?.role);
  const isAdmin = user?.user.role === "ADMIN";
  console.log(user?.user.role);

  const { data } = useGroups(isAdmin);
  // console.log(data);
  const { brands } = useBrandStore();
  const setBrands = useBrandStore((state) => state.setBrands);
  // console.log(brands);
  useEffect(() => {
    if (data) {
      setBrands(data);
    }
  }, [data, setBrands]);
  // console.log(brands);

  const selectedBrandId = useBrandStore((s) => s.selectedBrandId);
  const setSelectedBrandId = useBrandStore((s) => s.setSelectedBrandId);

  useEffect(() => {
    if (!selectedBrandId && brands && brands.length > 0) {
      setSelectedBrandId(brands[0].id);
    }
  }, [brands, selectedBrandId, setSelectedBrandId]);

  // console.log(brands);

  // Close the popover on outside click, same convention as the modal/panel
  // dismiss behavior used elsewhere in the app.
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/10 bg-[#0d0f14] font-sans">
      {/* Brand header */}
      <div
        ref={headerRef}
        className="relative border-b border-white/10 bg-gradient-to-br from-sky-600/30 via-sky-500/10 to-transparent px-4 pb-4 pt-5"
      >
        <p className="text-[19px] font-bold tracking-tight text-slate-100">
          Cravings<span className="text-sky-400">Now</span>
        </p>

        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={() => setSoundOn((v) => !v)}
            aria-label={soundOn ? "Mute order alerts" : "Unmute order alerts"}
            aria-pressed={soundOn}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              soundOn
                ? "bg-white/10 text-slate-200 hover:bg-white/15"
                : "bg-rose-500/15 text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-label="Account menu"
            aria-expanded={userMenuOpen}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              userMenuOpen
                ? "bg-sky-500 text-white"
                : "bg-white/10 text-slate-200 hover:bg-white/15"
            }`}
          >
            <User size={15} />
          </button>

          <button
            aria-label="Support"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-200 transition hover:bg-white/15"
          >
            <Headset size={15} />
          </button>
        </div>

        {userMenuOpen && (
          <UserMenu
            onClose={() => setUserMenuOpen(false)}
            userEmail={user?.user?.email}
            brands={brands!}
            currentBrandId={selectedBrandId ?? undefined}
            onBrandChange={(id) => {
              setSelectedBrandId(id);
              // if switching brands should re-scope data (branches, orders,
              // products under the new brand), invalidate here — not inside
              // the store, since the store shouldn't know about react-query
              // brands.invalidateQueries();
            }}
            onLogout={logout}
            user={user?.user.role!}
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            <i className={`ti ${item.icon} text-[15px]`} />
            <span className="flex-1 truncate">{item.label}</span>
            {DOT_LABELS.has(item.label) && (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
            {GREEN_DOT_LABELS.has(item.label) && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-[12px] font-semibold text-sky-400">
          CS
        </div>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium text-slate-200">
            Cravings Now
          </p>
          <p className="truncate text-[11px] text-slate-500">
            {user?.user?.email}
          </p>
        </div>
      </div>
    </aside>
  );
}
