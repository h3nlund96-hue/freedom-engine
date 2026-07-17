import Link from "next/link";
import type { FreedomEngineProgress } from "../data/freedomEngineProgress";
import {
  calculateFounderXP,
  getXPProgress,
  getFounderTitle,
} from "../lib/founderProgress";

/* ── COMPONENT ─────────────────────────────────────────────────────────────── */

export function FounderStatusBar({ progress }: { progress: FreedomEngineProgress }) {
  const totalXP = calculateFounderXP(progress);
  const xpData = getXPProgress(totalXP);
  const title = getFounderTitle(xpData.level);
  const barPercent = Math.round(xpData.fraction * 100);

  return (
    <div className="relative z-10 w-full">
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,171,74,0.20) 25%, rgba(255,171,74,0.12) 75%, transparent)",
        }}
        aria-hidden
      />

      {/* Desktop row */}
      <div className="relative hidden items-center gap-6 px-8 py-2.5 sm:flex">

        {/* Avatar + Profile label */}
        <Link
          href="/profile"
          className="group flex flex-col items-center gap-0.5"
          aria-label="Founder Profile"
        >
          <div className="relative flex size-7 items-center justify-center rounded-md transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(255,171,74,0.15)]">
            <div className="absolute inset-0 rounded-md bg-linear-to-br from-[rgba(255,171,74,0.16)] to-[rgba(77,216,255,0.07)]" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.20), inset 0 0 0 1px rgba(255,171,74,0.10)" }}
              aria-hidden
            />
            <span className="relative font-display text-[0.72rem] font-semibold text-accent/85 transition-colors duration-300 group-hover:text-accent">
              F
            </span>
          </div>
          <span className="font-display text-[0.56rem] tracking-[0.18em] uppercase text-muted/45 transition-colors duration-300 group-hover:text-muted/65">
            Profile
          </span>
        </Link>

        {/* Thin divider */}
        <div className="h-6 w-px bg-accent/[0.07] shrink-0" aria-hidden />

        {/* Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <p className="font-display text-[0.58rem] tracking-[0.20em] uppercase text-muted/48">
              Founder Status
            </p>
            <p className="font-display text-[0.72rem] font-medium tracking-wide text-foreground/78">
              {title}
            </p>
          </div>
          <span
            className="rounded px-2 py-0.5 font-display text-[0.6rem] font-semibold tracking-[0.16em] uppercase"
            style={{
              background: "rgba(255,171,74,0.10)",
              color: "var(--accent)",
              border: "1px solid rgba(255,171,74,0.10)",
            }}
          >
            Lv. {xpData.level}
          </span>
        </div>

        {/* Thin divider */}
        <div className="h-6 w-px bg-accent/[0.07] shrink-0" aria-hidden />

        {/* XP section — controlled width, not stretched */}
        <div className="flex w-72 flex-col gap-1.5 xl:w-96">
          <div
            className="relative h-[3px] w-full overflow-hidden rounded-sm"
            style={{ background: "rgba(255,171,74,0.09)" }}
            role="progressbar"
            aria-valuenow={xpData.xpInLevel}
            aria-valuemax={xpData.xpNeeded}
            aria-label={`XP: ${xpData.xpInLevel} of ${xpData.xpNeeded}`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-sm"
              style={{
                width: `${barPercent}%`,
                background: "linear-gradient(to right, rgba(255,171,74,0.65), rgba(77,216,255,0.82))",
                boxShadow: "0 0 6px rgba(77,216,255,0.30)",
              }}
            />
          </div>
          <p className="font-display text-[0.58rem] font-medium tracking-[0.12em] uppercase text-muted/50">
            {xpData.isMaxLevel
              ? "Maximum level"
              : `${xpData.xpInLevel.toLocaleString()} / ${xpData.xpNeeded.toLocaleString()} XP to Lv. ${xpData.level + 1}`}
          </p>
        </div>

        {/* Spacer — reserved for future HUD modules */}
        <div className="flex-1" aria-hidden />

      </div>

      {/* Mobile row (two lines) */}
      <div className="relative flex flex-col gap-1.5 px-5 py-2.5 sm:hidden">
        {/* Line 1: avatar + identity + level */}
        <div className="flex items-center gap-3">
          <Link href="/profile" aria-label="Founder Profile" className="group relative flex size-6 shrink-0 items-center justify-center rounded-md">
            <div className="absolute inset-0 rounded-md bg-linear-to-br from-[rgba(255,171,74,0.14)] to-[rgba(77,216,255,0.06)]" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.18), inset 0 0 0 1px rgba(255,171,74,0.09)" }}
              aria-hidden
            />
            <span className="relative font-display text-[0.62rem] font-semibold text-accent/80">F</span>
          </Link>
          <p className="font-display text-[0.65rem] font-medium tracking-wide text-foreground/72 truncate">
            {title}
          </p>
          <span
            className="ml-auto shrink-0 rounded px-1.5 py-px font-display text-[0.56rem] font-semibold tracking-[0.14em] uppercase"
            style={{
              background: "rgba(255,171,74,0.10)",
              color: "var(--accent)",
              border: "1px solid rgba(255,171,74,0.09)",
            }}
          >
            Lv. {xpData.level}
          </span>
        </div>

        {/* Line 2: XP bar + progress text */}
        <div className="flex items-center gap-3">
          <div
            className="relative h-[2px] flex-1 overflow-hidden rounded-sm"
            style={{ background: "rgba(255,171,74,0.09)" }}
            role="progressbar"
            aria-valuenow={xpData.xpInLevel}
            aria-valuemax={xpData.xpNeeded}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-sm"
              style={{
                width: `${barPercent}%`,
                background: "linear-gradient(to right, rgba(255,171,74,0.60), rgba(77,216,255,0.78))",
                boxShadow: "0 0 5px rgba(77,216,255,0.25)",
              }}
            />
          </div>
          <p className="shrink-0 font-display text-[0.54rem] font-medium tracking-[0.10em] uppercase text-muted/48">
            {xpData.isMaxLevel
              ? "Max level"
              : `${xpData.xpInLevel.toLocaleString()} / ${xpData.xpNeeded.toLocaleString()} XP`}
          </p>
        </div>
      </div>
    </div>
  );
}
