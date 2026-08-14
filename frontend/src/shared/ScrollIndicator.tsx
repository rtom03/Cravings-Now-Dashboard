import React, { useEffect, useState, type RefObject } from "react";

/**
 * Tracks a scrollable element's horizontal scroll position as two ratios:
 * how much of the content is visible (`width`) and how far scrolled
 * (`offset`), both 0–1. Re-measures on scroll and on resize (via
 * ResizeObserver, so it stays correct if columns are added/removed).
 */
export function useHorizontalScrollProgress(
  ref: RefObject<HTMLElement | null>,
) {
  const [ratio, setRatio] = useState({ width: 1, offset: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      if (scrollWidth <= clientWidth) {
        setRatio({ width: 1, offset: 0 });
        return;
      }
      const width = clientWidth / scrollWidth;
      const maxScroll = scrollWidth - clientWidth;
      const offset = maxScroll > 0 ? (scrollLeft / maxScroll) * (1 - width) : 0;
      setRatio({ width, offset });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ref]);

  return ratio;
}

/**
 * The thick rounded bar above the pagination row in the reference design —
 * it's a custom-styled indicator of horizontal scroll progress for the wide
 * table, not a page-progress meter. Renders nothing if there's nothing to
 * scroll (width ratio 1), instead of showing a pointless full bar.
 */
export function ScrollProgressBar({
  width,
  offset,
}: {
  width: number;
  offset: number;
}) {
  if (width >= 1) return null;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full rounded-full bg-sky-500"
        style={{ width: `${width * 100}%`, marginLeft: `${offset * 100}%` }}
      />
    </div>
  );
}
