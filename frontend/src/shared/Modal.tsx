// MenuModal.tsx — now knows nothing about branches, products, or anything else
import { ReactNode, useState } from "react";
import { X, LucideIcon } from "lucide-react";
import { MenuModalSkeleton } from "../ui/ModalSkeleton";

export interface ModalTabProps<TKey extends string> {
  key: TKey;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

type ModalProps<TKey extends string> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  tabs: ModalTabProps<TKey>[];
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

export default function Modal<TKey extends string>({
  open,
  setOpen,
  tabs,
  title,
  subtitle,
  icon: HeaderIcon,
  isLoading = false,
  isError = false,
  errorMessage = "Something went wrong. Please try again.",
}: ModalProps<TKey>) {
  const [activeTab, setActiveTab] = useState<TKey>(tabs[0].key);

  if (!open) return null;
  if (isLoading) return <MenuModalSkeleton />;

  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-6">
      <div className="flex w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0d1a2e] to-[#0d0f14] px-6 py-4">
          <div className="flex items-center gap-3">
            {HeaderIcon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                <HeaderIcon size={18} />
              </span>
            )}
            <div>
              <h2 className="text-[15px] font-semibold text-slate-100">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
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

        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 bg-[#0d0f14] px-4">
          {tabs.map((tab) => {
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
                {Icon && <Icon size={14} />}
                {tab.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-sky-400" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {isError ? (
            <div className="flex flex-1 items-center justify-center text-sm text-rose-400">
              {errorMessage}
            </div>
          ) : (
            activeTabContent
          )}
        </div>
      </div>
    </div>
  );
}
