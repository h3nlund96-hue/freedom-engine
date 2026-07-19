"use client";

import { useState } from "react";
import type { WeekBucket } from "../lib/observatoryStats";

const CHART_HEIGHT = 140;
const VIEW_SIZE = 100;

/**
 * Cumulative XP through each week — single hue (cyan, the app's
 * "reflection/analysis" color), a different view than the builds-per-week
 * bars rather than the same number twice: a running total, not a per-period
 * count. Hover surfaces the exact week + total via wide invisible hit
 * circles (small visible dots are hard to land a pointer on precisely).
 */
export function XPTrendChart({ buckets }: { buckets: WeekBucket[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = buckets.map((b) => b.cumulativeXP);
  const maxValue = Math.max(1, ...values);
  const minValue = Math.min(0, ...values);
  const range = Math.max(1, maxValue - minValue);

  const points = buckets.map((b, i) => ({
    x: (i / Math.max(1, buckets.length - 1)) * VIEW_SIZE,
    y: VIEW_SIZE - ((b.cumulativeXP - minValue) / range) * VIEW_SIZE,
    bucket: b,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${VIEW_SIZE} ${VIEW_SIZE} L 0 ${VIEW_SIZE} Z`;

  const hovered = hoveredIndex !== null ? points[hoveredIndex] : null;
  const lastBucket = buckets[buckets.length - 1];

  return (
    <div>
      <div className="relative" style={{ height: `${CHART_HEIGHT}px` }}>
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-sm border border-accent-glow/20 bg-surface px-2.5 py-1.5 text-center whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            style={{ left: `${hovered.x}%`, top: `${(hovered.y / VIEW_SIZE) * CHART_HEIGHT}px` }}
          >
            <p className="font-display text-[0.55rem] tracking-[0.1em] uppercase text-muted/50">
              Week of {hovered.bucket.label}
            </p>
            <p className="font-display text-xs text-accent-glow">{hovered.bucket.cumulativeXP.toLocaleString()} XP total</p>
          </div>
        )}

        <svg
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          aria-hidden
        >
          <path d={areaPath} fill="color-mix(in srgb, var(--accent-glow) 10%, transparent)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent-glow)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 3 : 2}
              fill="var(--surface)"
              stroke="var(--accent-glow)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              className="transition-all duration-150"
            />
          ))}
        </svg>

        {/* Wider, invisible hit targets laid over the SVG in plain HTML —
            easier to size generously (24px+) than fiddling with SVG units. */}
        <div className="absolute inset-0 flex">
          {points.map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex((v) => (v === i ? null : v))}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex((v) => (v === i ? null : v))}
              aria-label={`Week of ${buckets[i].label}: ${buckets[i].cumulativeXP.toLocaleString()} XP total`}
              className="h-full flex-1 focus:outline-none"
            />
          ))}
        </div>
      </div>

      <div className="mt-1 flex justify-between">
        <span className="font-display text-[0.55rem] tracking-wide text-muted/40">{buckets[0]?.label}</span>
        <span className="font-display text-[0.55rem] tracking-wide text-accent-glow/80">
          {lastBucket?.cumulativeXP.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
}
