// export function MenuModalSkeleton() {
//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-6">
//       <div className="mx-auto flex min-h-[600px] w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/60">
//         {/* Header skeleton */}
//         <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0d1a2e] to-[#0d0f14] px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 animate-pulse rounded-lg bg-white/10" />

//             <div className="space-y-2">
//               <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
//               <div className="h-3 w-72 animate-pulse rounded bg-white/5" />
//             </div>
//           </div>

//           {/* Close button skeleton */}
//           <div className="h-8 w-8 animate-pulse rounded-md bg-white/5" />
//         </div>

//         {/* Tabs skeleton */}
//         <div className="flex items-center gap-6 border-b border-white/10 px-6 py-3">
//           {[1, 2, 3, 4, 5].map((item) => (
//             <div
//               key={item}
//               className="h-4 w-24 animate-pulse rounded bg-white/5"
//             />
//           ))}
//         </div>

//         {/* Body skeleton */}
//         <div className="flex-1 p-6">
//           <div className="space-y-4">
//             <div className="h-6 w-48 animate-pulse rounded bg-white/10" />

//             <div className="space-y-3">
//               {[1, 2, 3, 4, 5, 6].map((row) => (
//                 <div
//                   key={row}
//                   className="h-12 w-full animate-pulse rounded-lg bg-white/5"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

// ─── Shimmer primitive (same sweep animation as CatalogTableSkeleton/AppLoader) ──

function Shimmer({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`relative overflow-hidden rounded-md bg-white/[0.06] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[modalSkeletonSweep_1.6s_ease-out_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

export function MenuModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-6">
      <div className="flex w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/60">
        {/* Header — exact same structure/classes as the real modal, so the
            icon, title, and subtitle just "resolve" in place once loaded */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0d1a2e] to-[#0d0f14] px-6 py-4">
          <div className="flex items-center gap-3">
            <Shimmer className="h-9 w-9 shrink-0 !rounded-lg" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-40" />
              <Shimmer className="h-3 w-64" />
            </div>
          </div>
          <div className="h-[18px] w-[18px] shrink-0 rounded bg-white/[0.04]" />
        </div>

        {/* Tabs — a handful of pill-width bars, count-agnostic since real
            tab counts vary per feature (branch has 5, product has 3, etc) */}
        <div className="flex items-center gap-5 overflow-x-auto border-b border-white/10 bg-[#0d0f14] px-6 py-3.5">
          {[92, 128, 110, 150, 96].map((w, i) => (
            <Shimmer key={i} className="h-4 shrink-0" style={{ width: w }} />
          ))}
        </div>

        {/* Body — generic form-shaped placeholder (label + input rows,
            two columns) since most tab content is form-like; a table-shaped
            tab (Catalog) has its own dedicated CatalogTableSkeleton that
            takes over once this outer skeleton resolves and that tab's own
            data starts loading. */}
        <div className="grid flex-1 grid-cols-2 gap-8 overflow-hidden px-6 py-6">
          <div className="space-y-5">
            <Shimmer className="mx-auto h-40 w-40" />
            <Shimmer className="mx-auto h-3 w-32" />
          </div>
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[140px_1fr] items-center gap-4"
              >
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSkeletonSweep {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
