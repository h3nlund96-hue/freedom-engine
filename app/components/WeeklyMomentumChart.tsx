"use client";

import { useState } from "react";
import type { WeekBucket } from "../lib/observatoryStats";

/**
 * Builds shipped per (rolling) week — a simple bar chart, single hue (amber,
 * the app's "building" color), values direct-labeled since there are only a
 * handful of bars. Hover/focus lifts the bar and surfaces the exact week.
 */
export function WeeklyMomentumChart({ buckets }: { buckets: WeekBucket[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxCount = Math.max(1, ...buckets.map((b) => b.buildsCompleted));
  const hovered = hoveredIndex !== null ? buckets[hoveredIndex] : null;

  return (
    <div className="relative">
      {hovered && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 -translate-y-full rounded-sm border border-accent/20 bg-surface px-2.5 py-1.5 text-center whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          style={{ left: `${((hoveredIndex! + 0.5) / buckets.length) * 100}%` }}
        >
          <p className="font-display text-[0.55rem] tracking-[0.1em] uppercase text-muted/50">Week of {hovered.label}</p>
          <p className="font-display text-xs text-accent">
            {hovered.buildsCompleted} Build{hovered.buildsCompleted === 1 ? "" : "s"} shipped
          </p>
        </div>
      )}

      <div className="flex items-end gap-2" style={{ height: "140px" }}>
        {buckets.map((bucket, i) => {
          const heightPct = (bucket.buildsCompleted / maxCount) * 100;
          const isHovered = hoveredIndex === i;
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end justify-center">
                {bucket.buildsCompleted > 0 && (
                  <span
                    className={`absolute -top-5 font-display text-[0.65rem] tabular-nums transition-colors duration-200 ${
                      isHovered ? "text-accent" : "text-accent/70"
                    }`}
                  >
                    {bucket.buildsCompleted}
                  </span>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex((v) => (v === i ? null : v))}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex((v) => (v === i ? null : v))}
                  aria-label={`Week of ${bucket.label}: ${bucket.buildsCompleted} Build${
                    bucket.buildsCompleted === 1 ? "" : "s"
                  } shipped`}
                  className="w-full max-w-6 rounded-t-[4px] transition-all duration-200 focus:outline-none"
                  style={{
                    height: `max(2px, ${heightPct}%)`,
                    background: isHovered
                      ? "color-mix(in srgb, var(--accent) 85%, transparent)"
                      : "color-mix(in srgb, var(--accent) 55%, transparent)",
                  }}
                />
              </div>
              <span className="font-display text-[0.55rem] tracking-wide text-muted/40">{bucket.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
