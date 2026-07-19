import type { Metadata } from "next";
import { LocationHeader } from "../components/LocationHeader";
import { PanelAtmosphere } from "../components/PanelAtmosphere";
import { CornerMarks } from "../components/CornerMarks";
import { WeeklyMomentumChart } from "../components/WeeklyMomentumChart";
import { XPTrendChart } from "../components/XPTrendChart";
import { getProgress } from "../lib/questService";
import { getWeeklyMomentum, getQuestlineActivity, getCurrentTotalXP } from "../lib/observatoryStats";

export const metadata: Metadata = {
  title: "The Observatory — Freedom Engine",
  description: "Patterns in momentum, not just the log of what got done.",
};

const WEEKS = 8;

export default async function ObservatoryPage() {
  const progress = await getProgress();
  const weeklyMomentum = getWeeklyMomentum(progress, WEEKS);
  const questlineActivity = getQuestlineActivity(progress);
  const totalXP = getCurrentTotalXP(progress);
  const buildsThisWindow = weeklyMomentum.reduce((sum, w) => sum + w.buildsCompleted, 0);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
      <PanelAtmosphere bias="cyan" />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl xl:max-w-4xl">

        <LocationHeader
          icon="✦"
          eyebrow="Analysis Deck"
          title="The Observatory"
          description="Patterns in your own momentum — what's moving, what's gone quiet."
        />

        {/* Weekly momentum */}
        <section className="animate-fade-up" style={{ animationDelay: "0.12s" }} aria-label="Builds shipped per week">
          <div className="relative overflow-hidden rounded-md border border-card-border">
            <CornerMarks size={8} inset="6px" />
            <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.1), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-5 px-6 py-6 sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted/40">
                  Builds Shipped — Last {WEEKS} Weeks
                </p>
                <p className="font-display text-[0.6rem] tracking-[0.15em] uppercase text-accent/75">
                  {buildsThisWindow} total
                </p>
              </div>
              <WeeklyMomentumChart buckets={weeklyMomentum} />
            </div>
          </div>
        </section>

        {/* XP trend */}
        <section className="animate-fade-up" style={{ animationDelay: "0.18s" }} aria-label="Experience earned over time">
          <div className="relative overflow-hidden rounded-md border border-card-border">
            <CornerMarks size={8} inset="6px" color="rgba(77,216,255,0.28)" />
            <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(77,216,255,0.08), inset 0 0 0 1px rgba(77,216,255,0.04)" }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-5 px-6 py-6 sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted/40">
                  Experience Earned Over Time
                </p>
                <p className="font-display text-[0.6rem] tracking-[0.15em] uppercase text-accent-glow/75">
                  {totalXP.toLocaleString()} XP total
                </p>
              </div>
              <XPTrendChart buckets={weeklyMomentum} />
            </div>
          </div>
        </section>

        {/* Questline activity */}
        <section className="animate-fade-up" style={{ animationDelay: "0.24s" }} aria-label="Questline momentum">
          <div className="relative overflow-hidden rounded-md border border-card-border">
            <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.1), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-1 px-6 py-6 sm:px-8">
              <p className="mb-3 font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted/40">
                Questline Momentum
              </p>
              {questlineActivity.length === 0 ? (
                <p className="text-sm leading-relaxed text-muted/55">No ongoing Questlines yet.</p>
              ) : (
                questlineActivity.map((ql) => (
                  <div
                    key={ql.id}
                    className="flex items-center justify-between gap-4 border-b border-card-border py-3 last:border-b-0"
                  >
                    <p className="text-sm text-foreground/85">{ql.title}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className="relative flex size-1.5"
                        aria-hidden
                      >
                        {!ql.isStale && (
                          <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
                        )}
                        <span
                          className={`relative inline-flex size-1.5 rounded-full ${
                            ql.isStale ? "bg-muted/40" : "bg-accent-glow shadow-[0_0_8px_rgba(77,216,255,0.65)]"
                          }`}
                        />
                      </span>
                      <p className={`font-display text-[0.6rem] tracking-[0.1em] uppercase ${ql.isStale ? "text-muted/45" : "text-accent-glow/80"}`}>
                        {ql.daysSinceActivity === null
                          ? "No activity yet"
                          : ql.daysSinceActivity === 0
                          ? "Active today"
                          : ql.isStale
                          ? `Quiet for ${ql.daysSinceActivity} days`
                          : `Active ${ql.daysSinceActivity}d ago`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="animate-fade-up mt-auto flex items-center gap-4 pt-2" style={{ animationDelay: "0.32s" }}>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">The Observatory · Freedom Engine</p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}
