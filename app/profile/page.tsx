import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { LocationHeader } from "../components/LocationHeader";
import { getProgress } from "../lib/questService";
import {
  calculateFounderXP,
  getXPProgress,
  getFounderTitle,
  countCompletedBuilds,
  countCompletedSideQuests,
} from "../lib/founderProgress";

export const metadata: Metadata = {
  title: "Founder Profile — Freedom Engine",
  description: "Founder progression inside Freedom Engine.",
};

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default async function ProfilePage() {
  const progress = await getProgress();

  const totalXP = calculateFounderXP(progress);
  const xpData = getXPProgress(totalXP);
  const title = getFounderTitle(xpData.level);
  const completedBuilds = countCompletedBuilds(progress);
  const completedSideQuests = countCompletedSideQuests(progress);
  const barPercent = Math.round(xpData.fraction * 100);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">

        <LocationHeader
          icon="🪪"
          eyebrow="Identity"
          title="Founder Profile"
          description="Progression inside Freedom Engine."
        />

        {/* Identity panel */}
        <section
          className="animate-fade-up"
          style={{ animationDelay: "0.16s" }}
          aria-label="Founder identity"
        >
          <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
            <div className="absolute inset-0 bg-linear-to-br from-[rgba(10,17,30,0.95)] to-[rgba(5,8,14,0.98)]" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top left, rgba(77,216,255,0.07) 0%, transparent 55%)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.10), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
              aria-hidden
            />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/22 to-transparent" aria-hidden />

            <div className="relative flex flex-col gap-7 px-6 py-7 sm:px-8">

              {/* Avatar + level + title */}
              <div className="flex items-center gap-5">
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-md">
                  <div className="absolute inset-0 rounded-md bg-linear-to-br from-[rgba(255,171,74,0.16)] to-[rgba(77,216,255,0.08)]" />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-md"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.20), inset 0 0 0 1px rgba(255,171,74,0.10), 0 0 20px rgba(255,171,74,0.08)" }}
                    aria-hidden
                  />
                  <span className="relative font-display text-xl font-medium tracking-wider text-accent/85">F</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="rounded px-2 py-0.5 font-display text-[0.6rem] tracking-[0.18em] uppercase"
                      style={{ background: "rgba(255,171,74,0.12)", color: "rgba(255,171,74,0.85)", border: "1px solid rgba(255,171,74,0.12)" }}
                    >
                      Level {xpData.level}
                    </span>
                  </div>
                  <h2 className="font-display text-xl tracking-wide text-foreground">{title}</h2>
                  <p className="font-display text-[0.6rem] tracking-[0.18em] uppercase text-muted/35">The Founder</p>
                </div>
              </div>

              {/* XP section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted/40">Experience</p>
                  <p className="font-display text-[0.6rem] tracking-[0.15em] uppercase text-accent/55">
                    {totalXP.toLocaleString()} XP total
                  </p>
                </div>

                <div
                  className="relative h-2 w-full overflow-hidden rounded-sm"
                  style={{ background: "rgba(255,171,74,0.08)" }}
                  role="progressbar"
                  aria-valuenow={xpData.xpInLevel}
                  aria-valuemax={xpData.xpNeeded}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{
                      width: `${barPercent}%`,
                      background: "linear-gradient(to right, rgba(255,171,74,0.65), rgba(77,216,255,0.85))",
                      boxShadow: "0 0 10px rgba(77,216,255,0.30)",
                    }}
                  />
                </div>

                <p className="text-xs text-muted/40">
                  {xpData.isMaxLevel
                    ? "Maximum level reached."
                    : `${xpData.xpInLevel.toLocaleString()} / ${xpData.xpNeeded.toLocaleString()} XP toward Level ${xpData.level + 1}`}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-accent/10 to-transparent" aria-hidden />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatBlock label="Completed Builds" value={completedBuilds} />
                <StatBlock label="Completed Side Quests" value={completedSideQuests} />
                <StatBlock
                  label="XP per Build"
                  value={100}
                  suffix="XP"
                  className="col-span-2 sm:col-span-1"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Status line */}
        <div className="animate-fade-up" style={{ animationDelay: "0.24s" }}>
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
            <p className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-accent/40">
              The fire is growing. One Build at a time.
            </p>
            <span className="h-px flex-1 bg-linear-to-l from-accent/10 to-transparent" aria-hidden />
          </div>
        </div>

        {/* Footer */}
        <footer className="animate-fade-up mt-auto flex items-center gap-4 pt-2" style={{ animationDelay: "0.36s" }}>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/28">
            Founder Profile · Freedom Engine
          </p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}

/* ── STAT BLOCK ───────────────────────────────────────────────────────────── */

function StatBlock({
  label,
  value,
  suffix,
  className = "",
}: {
  label: string;
  value: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md px-4 py-3 ${className}`}
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,171,74,0.05)" }}
    >
      <p className="font-display text-[0.52rem] tracking-[0.18em] uppercase text-muted/35">{label}</p>
      <p className="mt-1.5 font-display text-2xl tracking-wide text-foreground/80">
        {value}
        {suffix && <span className="ml-1 text-base text-muted/40">{suffix}</span>}
      </p>
    </div>
  );
}
