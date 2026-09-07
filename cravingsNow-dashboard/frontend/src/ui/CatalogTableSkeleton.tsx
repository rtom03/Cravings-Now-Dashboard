import React from "react";

// ─── Cell shape variants ─────────────────────────────────────────────────────
// Each catalog column renders a visually distinct control (a toggle pill, a
// badge, a dropdown button, an icon button...). Mirroring that shape in the
// skeleton — not just a generic gray bar in every cell — is what makes the
// loading state read as "this table" rather than "a table."

type CellVariant =
  | "checkbox"
  | "avatar"
  | "toggle"
  | "badge"
  | "text"
  | "text-wide"
  | "dash"
  | "dropdown"
  | "button"
  | "icon";

export interface SkeletonColumn {
  key: string;
  label?: string;
  width: string;
  sticky?: boolean;
  variant: CellVariant;
}

// ─── Shimmer primitive ────────────────────────────────────────────────────
// A moving gradient sweep rather than a flat pulse — reads as "actively
// loading" instead of "static and dimmed."

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/[0.06] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[skeletonSweep_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

function SkeletonCell({ variant }: { variant: CellVariant }) {
  switch (variant) {
    case "checkbox":
      return <Shimmer className="h-3.5 w-3.5 rounded-[4px]" />;
    case "avatar":
      return <Shimmer className="h-9 w-9 !rounded-full" />;
    case "toggle":
      return <Shimmer className="h-5 w-5 !rounded-full" />;
    case "badge":
      return <Shimmer className="h-[22px] w-16 !rounded-full" />;
    case "text":
      return <Shimmer className="h-3.5 w-20" />;
    case "text-wide":
      return <Shimmer className="h-3.5 w-32" />;
    case "dropdown":
      return <Shimmer className="h-8 w-full max-w-[150px]" />;
    case "button":
      return <Shimmer className="h-7 w-14" />;
    case "icon":
      return <Shimmer className="h-7 w-7" />;
    case "dash":
    default:
      return <Shimmer className="h-3.5 w-6" />;
  }
}

// ─── Table skeleton ─────────────────────────────────────────────────────────

interface CatalogTableSkeletonProps {
  columns?: SkeletonColumn[];
  rows?: number;
  /** Render the real (static) header labels above the shimmering body, so
   * layout doesn't shift once real data replaces the skeleton. */
  showHeader?: boolean;
}

export function CatalogTableSkeleton({
  columns,
  rows = 8,
  showHeader = true,
}: CatalogTableSkeletonProps) {
  return (
    <div className="flex-1 overflow-auto border-t border-white/10 px-0">
      <table className="w-full min-w-[1700px] border-collapse text-[13px]">
        {showHeader && (
          <thead>
            <tr>
              {columns?.map((col) => (
                <th
                  key={col.key}
                  style={{ minWidth: col.width }}
                  className={`border-b border-white/10 bg-[#12151b] px-3 py-3 text-left text-[12.5px] font-semibold text-slate-300 ${
                    col.sticky ? "sticky top-0 z-10" : ""
                  }`}
                >
                  {col.label ?? ""}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-white/[0.06] ${
                rowIndex % 2 === 1 ? "bg-white/[0.015]" : ""
              }`}
            >
              {columns?.map((col) => (
                <td key={col.key} className="px-3 py-3">
                  <div
                    className="flex items-center"
                    style={{
                      // slight per-row width jitter on text cells so the
                      // skeleton doesn't look like a rigid, repeated grid
                      opacity: 1 - ((rowIndex * 3) % 20) / 100,
                    }}
                  >
                    <SkeletonCell variant={col.variant} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        @keyframes skeletonSweep {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// ─── Preset matching MenuModal's exact catalog columns ─────────────────────
// Keeps the skeleton in lockstep with the real COLUMNS definition without
// MenuModal needing to hand-build the variant list every time it renders.

export const CATALOG_SKELETON_COLUMNS: SkeletonColumn[] = [
  { key: "select", width: "40px", sticky: true, variant: "checkbox" },
  {
    key: "photo",
    label: "Photo",
    width: "88px",
    sticky: true,
    variant: "avatar",
  },
  {
    key: "on",
    label: "On/Off",
    width: "88px",
    sticky: true,
    variant: "toggle",
  },
  { key: "category", label: "Category", width: "140px", variant: "text" },
  { key: "en", label: "English name", width: "190px", variant: "text-wide" },
  { key: "type", label: "Type", width: "110px", variant: "badge" },
  {
    key: "overrideStock",
    label: "Override Stock?",
    width: "130px",
    variant: "dash",
  },
  { key: "stockLevel", label: "Stock level", width: "110px", variant: "dash" },
  {
    key: "overridePreorderStock",
    label: "Override Preordering Stock?",
    width: "150px",
    variant: "dash",
  },
  {
    key: "preorderStockLevel",
    label: "Preordering Stock Level",
    width: "150px",
    variant: "dash",
  },
  {
    key: "overrideOptions",
    label: "Override Options?",
    width: "130px",
    variant: "checkbox",
  },
  { key: "options", label: "Options", width: "90px", variant: "dash" },
  {
    key: "availability",
    label: "Show not available for",
    width: "190px",
    variant: "dropdown",
  },
  { key: "limits", label: "Limits", width: "80px", variant: "button" },
  { key: "remove", label: "Remove", width: "80px", variant: "icon" },
  { key: "history", label: "History", width: "80px", variant: "icon" },
];
