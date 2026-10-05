import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type LoaderSize = "sm" | "md" | "lg";

interface AppLoaderProps {
  /** Renders as a fixed full-viewport overlay instead of an inline block */
  fullscreen?: boolean;
  /** Optional label under the mark, e.g. "Loading branches…" */
  label?: string;
  size?: LoaderSize;
  /** Dim the backdrop behind the loader (fullscreen only) */
  overlay?: boolean;
}

const SIZE_MAP: Record<
  LoaderSize,
  { ring: number; stroke: number; dot: number; text: string }
> = {
  sm: { ring: 32, stroke: 3, dot: 5, text: "text-xs" },
  md: { ring: 52, stroke: 3.5, dot: 7, text: "text-sm" },
  lg: { ring: 76, stroke: 4, dot: 10, text: "text-base" },
};

// ─── Mark ───────────────────────────────────────────────────────────────────
// A rotating gradient arc (not a flat spinner) with a soft pulsing core.
// The arc uses a conic-style gradient stroke via SVG so it reads as
// "alive" rather than a mechanical circular sweep.

function LoaderMark({ size = "md" }: { size?: LoaderSize }) {
  const { ring, stroke, dot } = SIZE_MAP[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative" style={{ width: ring, height: ring }}>
      <svg
        width={ring}
        height={ring}
        viewBox={`0 0 ${ring} ${ring}`}
        className="animate-[spin_1.1s_linear_infinite]"
      >
        <defs>
          <linearGradient
            id="loaderGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* faint full track */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* animated arc */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="url(#loaderGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.28} ${circumference}`}
        />
      </svg>
      {/* pulsing core */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 animate-[loaderPulse_1.6s_ease-in-out_infinite]"
        style={{ width: dot, height: dot }}
      />
    </div>
  );
}

// ─── Animated label ─────────────────────────────────────────────────────────
// Three dots stagger in opacity instead of a plain "Loading..." string, so
// the text itself feels tied to the same rhythm as the mark.

function LoaderLabel({ label, size }: { label: string; size: LoaderSize }) {
  return (
    <p
      className={`flex items-center gap-1 font-medium text-slate-400 ${SIZE_MAP[size].text}`}
    >
      <span>{label}</span>
      <span className="flex gap-0.5">
        <span className="animate-[loaderDot_1.4s_ease-in-out_infinite] [animation-delay:0ms]">
          .
        </span>
        <span className="animate-[loaderDot_1.4s_ease-in-out_infinite] [animation-delay:200ms]">
          .
        </span>
        <span className="animate-[loaderDot_1.4s_ease-in-out_infinite] [animation-delay:400ms]">
          .
        </span>
      </span>
    </p>
  );
}

// ─── Public component ───────────────────────────────────────────────────────

export default function AppLoader({
  fullscreen = false,
  label,
  size = "md",
  overlay = true,
}: AppLoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <LoaderMark size={size} />
      {label && <LoaderLabel label={label} size={size} />}
    </div>
  );

  if (!fullscreen) {
    return content;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center font-sans ${
        overlay ? "bg-[#05060a]/80 backdrop-blur-sm" : ""
      }`}
    >
      {content}
      <style>{`
        @keyframes loaderPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes loaderDot {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Inline variant ─────────────────────────────────────────────────────────
// For use inside buttons, table cells, or small panels — no wrapper, no
// backdrop, just the mark sized to sit next to text.

export function InlineLoader({ size = "sm" }: { size?: LoaderSize }) {
  return (
    <>
      <LoaderMark size={size} />
      <style>{`
        @keyframes loaderPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ─── Skeleton row loader ────────────────────────────────────────────────────
// For table/list contexts (e.g. the Branches grid, the Catalog table) where
// a spinner alone leaves too much empty space — shimmer placeholders read
// as "content is coming" rather than "something is frozen."

export function SkeletonRows({
  rows = 5,
  className = "",
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-11 w-full animate-pulse rounded-md bg-white/[0.04]"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}
