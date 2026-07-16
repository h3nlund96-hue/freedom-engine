import Link from "next/link";
import {
  getActiveQuest,
  getActiveQuestline,
  getCurrentBuild,
  type FreedomEngineProgress,
} from "../data/freedomEngineProgress";

/** The active Quest, front and center on HQ — title, its Questline, and the
 * next step from the active Build. The whole card is a link into Quest
 * Board. Falls back to a "Choose a Quest" prompt when nothing is active. */
export function ActiveQuest({ progress }: { progress: FreedomEngineProgress }) {
  const activeQuest = getActiveQuest(progress);
  const activeQuestline = activeQuest ? getActiveQuestline(progress, activeQuest) : undefined;
  const currentBuild = activeQuest ? getCurrentBuild(activeQuest) : undefined;

  if (!activeQuest || !activeQuestline) {
    return (
      <section className="animate-fade-up" style={{ animationDelay: "0.22s" }} aria-label="Active Quest">
        <Link
          href="/quest-board"
          className="group flex items-center justify-center gap-2 rounded-md border border-dashed border-accent/20 px-6 py-8 transition-colors duration-300 hover:border-accent/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30"
        >
          <span className="font-display text-sm tracking-[0.14em] uppercase text-muted/60 transition-colors duration-300 group-hover:text-accent/80">
            Choose a Quest
          </span>
          <span
            className="text-muted/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent/80"
            aria-hidden
          >
            →
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="animate-fade-up" style={{ animationDelay: "0.22s" }} aria-label="Active Quest">
      <Link
        href="/quest-board"
        className="group relative block overflow-hidden rounded-md border border-card-border transition-colors duration-300 hover:border-accent-glow/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-glow/30"
      >
        {/* Base */}
        <div className="absolute inset-0 bg-linear-to-b from-surface-raised to-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(77,216,255,0.07)_0%,transparent_55%)]" />
        <div
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.10), inset 0 -1px 0 rgba(0,0,0,0.3)" }}
          aria-hidden
        />
        <span className="pointer-events-none absolute left-4 top-4 h-3.5 w-3.5 border-l border-t border-accent/18" aria-hidden />
        <span className="pointer-events-none absolute right-4 top-4 h-3.5 w-3.5 border-r border-t border-accent/18" aria-hidden />
        <span className="pointer-events-none absolute bottom-4 left-4 h-3.5 w-3.5 border-b border-l border-accent/10" aria-hidden />
        <span className="pointer-events-none absolute bottom-4 right-4 h-3.5 w-3.5 border-b border-r border-accent/10" aria-hidden />

        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/65" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(77,216,255,0.6)]" />
              </span>
              <span className="font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/70">
                Active Quest
              </span>
            </div>
            <span
              className="text-muted/40 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </div>

          <p className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted/50">
            {activeQuestline.title}
          </p>
          <h3 className="mt-1.5 font-display text-xl tracking-wide text-foreground sm:text-2xl">
            {activeQuest.title}
          </h3>

          {currentBuild && (
            <div className="mt-6 border-t border-accent/[0.07] pt-5">
              <p className="mb-2 font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/65">
                Current Build
              </p>
              <p className="text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
                {currentBuild.title}
              </p>
              {currentBuild.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">{currentBuild.description}</p>
              )}
            </div>
          )}
        </div>
      </Link>
    </section>
  );
}
