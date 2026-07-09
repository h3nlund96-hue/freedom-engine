import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { Collapsible } from "./Collapsible";
import {
  progress,
  getActiveQuestline,
  getActiveQuest,
  getCurrentBuild,
  type Build,
  type Quest,
  type Questline,
  type SideQuest,
} from "../data/freedomEngineProgress";

export const metadata: Metadata = {
  title: "Quest Board — Freedom Engine",
  description: "The active path through Freedom Engine.",
};

/* ── DERIVED STATE ────────────────────────────────────────────────────────── */

const activeQuestline = getActiveQuestline(progress)!;
const activeQuest = getActiveQuest(activeQuestline)!;
const currentBuild = getCurrentBuild(activeQuest)!;

const completedBuilds = activeQuest.builds?.filter((b) => b.status === "completed") ?? [];
const completedQuests = activeQuestline.quests?.filter((q) => q.status === "completed") ?? [];
const availableQuestlines = progress.questlines.filter((q) => q.status === "available");
const availableSideQuests = progress.sideQuests.filter((s) => s.status === "available");
const completedSideQuests = progress.sideQuests.filter((s) => s.status === "completed");

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default function QuestBoardPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground variant="quest-board" />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">

        {/* Back link */}
        <nav className="animate-fade-up" aria-label="Back to headquarters">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded text-muted/70 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>←</span>
            <span className="font-display text-xs tracking-[0.22em] uppercase">AI Mastery HQ</span>
          </Link>
        </nav>

        {/* Header */}
        <header className="animate-fade-up space-y-6" style={{ animationDelay: "0.08s" }}>
          <div className="space-y-1">
            <p className="font-display text-[0.65rem] tracking-[0.28em] uppercase text-accent/65">Quest Chamber</p>
            <h1 className="font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">Quest Board</h1>
            <p className="pt-1 text-base text-muted sm:text-lg">The active path through Freedom Engine.</p>
          </div>
          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-linear-to-r from-accent/30 to-accent/10" />
            <span className="size-[3px] rounded-full bg-accent/40 shadow-[0_0_8px_rgba(255,171,74,0.4)]" />
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" />
          </div>
          <p className="max-w-lg text-base leading-relaxed text-foreground/70">
            This is where The Founder sees the current Quest, the active Build, and the next step forward.
          </p>
        </header>

        {/* ── 1. CURRENT FOCUS — command table ── */}
        <section className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <SectionLabel>Current Focus</SectionLabel>
          <CurrentFocusPanel
            questline={activeQuestline}
            quest={activeQuest}
            build={currentBuild}
          />
        </section>

        {/* ── 2. MAIN QUEST ── */}
        <section className="animate-fade-up" style={{ animationDelay: "0.24s" }}>
          <SectionLabel>Main Quest</SectionLabel>
          <MainQuestTile quest={progress.mainQuest} />
        </section>

        {/* ── 3. QUESTLINES ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.30s" }}>
          <SectionLabel>
            Questlines
            <StatBadge label="Active" value={1} color="active" />
            <StatBadge label="Available" value={availableQuestlines.length} color="dim" />
          </SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {progress.questlines.map((q) => (
              <QuestlineCard key={q.id} questline={q} />
            ))}
          </div>
        </section>

        {/* ── 4. QUESTS in active questline ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.36s" }}>
          <SectionLabel>
            Quests — {activeQuestline.title}
            <StatBadge label="Completed" value={completedQuests.length} color="dim" />
          </SectionLabel>

          {/* Active quest */}
          <ActiveQuestCard quest={activeQuest} />

          {/* Completed quests — collapsible */}
          {completedQuests.length > 0 && (
            <div className="mt-2">
              <Collapsible label="Completed Quests" count={completedQuests.length}>
                <ul className="space-y-2">
                  {completedQuests.map((q) => (
                    <CompletedQuestRow key={q.id} quest={q} />
                  ))}
                </ul>
              </Collapsible>
            </div>
          )}
        </section>

        {/* ── 5. SIDE QUESTS ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.42s" }}>
          <SectionLabel>
            Side Quests
            <StatBadge label="Available" value={availableSideQuests.length} color="dim" />
            <StatBadge label="Completed" value={completedSideQuests.length} color="dim" />
          </SectionLabel>
          <p className="text-xs leading-relaxed text-muted/50">
            Smaller useful quests that support the main path without becoming the main path.
          </p>

          {/* Available */}
          <Collapsible label="Available" count={availableSideQuests.length} defaultOpen>
            <ul className="space-y-2">
              {availableSideQuests.map((sq) => (
                <SideQuestRow key={sq.id} sideQuest={sq} />
              ))}
            </ul>
          </Collapsible>

          {/* Completed */}
          {completedSideQuests.length > 0 && (
            <Collapsible label="Completed" count={completedSideQuests.length}>
              <ul className="space-y-2">
                {completedSideQuests.map((sq) => (
                  <SideQuestRow key={sq.id} sideQuest={sq} />
                ))}
              </ul>
            </Collapsible>
          )}
        </section>

        {/* ── 6. COMPLETED BUILDS — collapsible ── */}
        <section className="animate-fade-up" style={{ animationDelay: "0.48s" }}>
          <Collapsible label="Completed Builds" count={completedBuilds.length}>
            <ul className="space-y-1.5">
              {[...completedBuilds].reverse().map((b) => (
                <CompletedBuildRow key={b.id} build={b} />
              ))}
            </ul>
          </Collapsible>
        </section>

        {/* Guiding principle */}
        <blockquote
          className="animate-fade-up relative py-1 pl-7"
          style={{ animationDelay: "0.54s" }}
        >
          <span className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/40 via-accent/15 to-transparent" aria-hidden />
          <span className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/50 shadow-[0_0_10px_rgba(77,216,255,0.35)]" aria-hidden />
          <p className="font-display text-sm italic leading-relaxed text-muted/90 sm:text-base">
            Every Quest is completed through Builds.
          </p>
        </blockquote>

        {/* Footer */}
        <footer className="animate-fade-up mt-auto flex items-center gap-4 pt-2" style={{ animationDelay: "0.60s" }}>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">Quest Chamber · Freedom Engine</p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}

/* ── SECTION LABEL ───────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2.5">
      {children}
      <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
    </div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "active" | "dim";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-display text-[0.57rem] tracking-wide ${
        color === "active"
          ? "bg-accent-glow/10 text-accent-glow/70"
          : "bg-muted/6 text-muted/40"
      }`}
    >
      <span>{value}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
}

/* ── CURRENT FOCUS PANEL ─────────────────────────────────────────────────── */
function CurrentFocusPanel({
  questline,
  quest,
  build,
}: {
  questline: Questline;
  quest: Quest;
  build: Build;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
      <div className="absolute inset-0 bg-linear-to-b from-[rgba(13,22,38,0.95)] to-[rgba(6,9,16,0.98)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(77,216,255,0.08)_0%,transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.11), inset 0 -1px 0 rgba(0,0,0,0.4)" }}
        aria-hidden
      />
      <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-accent/22" aria-hidden />
      <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-accent/22" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-accent/12" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-accent/12" aria-hidden />

      <div className="relative px-6 py-8 sm:px-8 sm:py-9">
        {/* Active label */}
        <div className="mb-6 flex items-center gap-2.5">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-glow shadow-[0_0_10px_rgba(77,216,255,0.65)]" />
          </span>
          <span className="font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/75">Active Path</span>
        </div>

        {/* Chain: Questline → Quest */}
        <dl className="space-y-0 border-b border-accent/[0.07] pb-6">
          <FocusRow label="Questline" value={questline.title} />
          <FocusRow label="Quest" value={quest.title} isLast />
        </dl>

        {/* Current Build — most prominent */}
        <div className="mt-6">
          <p className="mb-2 font-display text-[0.6rem] tracking-[0.3em] uppercase text-accent/55">Current Build</p>
          <h2 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">{build.title}</h2>
          {build.description && (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/65 sm:text-base">
              {build.description}
            </p>
          )}
          {build.nextStep && (
            <div className="mt-6 border-t border-accent/[0.08] pt-5">
              <p className="mb-2 font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/65">Next Step</p>
              <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">{build.nextStep}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FocusRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-baseline sm:gap-6 ${!isLast ? "border-b border-accent/[0.05]" : ""}`}>
      <dt className="min-w-28 shrink-0 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted/55">{label}</dt>
      <dd className="text-sm leading-relaxed text-foreground/80">{value}</dd>
    </div>
  );
}

/* ── MAIN QUEST TILE ─────────────────────────────────────────────────────── */
function MainQuestTile({ quest }: { quest: string }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
      <div className="absolute inset-0 bg-linear-to-r from-[rgba(11,20,35,0.92)] to-[rgba(7,12,19,0.88)]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent/50 via-accent/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.07)]" aria-hidden />
      <div className="relative flex flex-col gap-1.5 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-7">
        <div className="shrink-0">
          <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/50">North Star</p>
          <p className="mt-1 font-display text-lg tracking-wide text-foreground/95">{quest}</p>
        </div>
        <p className="border-t border-accent/[0.06] pt-3 text-xs leading-relaxed text-muted/55 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          The long-term path. Everything inside AI Mastery HQ serves this larger mission.
        </p>
      </div>
    </div>
  );
}

/* ── QUESTLINE CARD ──────────────────────────────────────────────────────── */
function QuestlineCard({ questline }: { questline: Questline }) {
  const isActive = questline.status === "active";
  return (
    <div className={`relative overflow-hidden rounded-md border border-white/[0.07] ${!isActive ? "opacity-60" : ""}`}>
      <div className={`absolute inset-0 ${isActive ? "bg-linear-to-br from-[rgba(11,19,32,0.90)] to-[rgba(6,9,16,0.93)]" : "bg-[rgba(8,10,16,0.80)]"}`} />
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.06)]" aria-hidden />
      <div className="relative flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2.5">
          {isActive ? (
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(77,216,255,0.6)]" />
            </span>
          ) : (
            <span className="size-1.5 rounded-full bg-muted/25" aria-hidden />
          )}
          <span className={`font-display text-[0.58rem] tracking-[0.22em] uppercase ${isActive ? "text-accent-glow/75" : "text-muted/40"}`}>
            {isActive ? "Active" : "Available"}
          </span>
        </div>
        <h3 className={`font-display text-base tracking-wide ${isActive ? "text-foreground/95" : "text-foreground/55"}`}>
          {questline.title}
        </h3>
        <p className="text-xs leading-relaxed text-muted/55">{questline.description}</p>
      </div>
    </div>
  );
}

/* ── ACTIVE QUEST CARD ───────────────────────────────────────────────────── */
function ActiveQuestCard({ quest }: { quest: Quest }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(10,17,30,0.90)] to-[rgba(6,8,14,0.94)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,171,74,0.05)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.08)]" aria-hidden />
      <div className="relative px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(77,216,255,0.55)]" />
          </span>
          <span className="font-display text-[0.58rem] tracking-[0.22em] uppercase text-accent-glow/70">Active</span>
        </div>
        <h3 className="font-display text-lg tracking-wide text-foreground/95 sm:text-xl">{quest.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted/60 sm:text-sm">{quest.description}</p>
      </div>
    </div>
  );
}

/* ── COMPLETED QUEST ROW ─────────────────────────────────────────────────── */
function CompletedQuestRow({ quest }: { quest: Quest }) {
  return (
    <li className="group flex items-start gap-3.5 rounded-md px-4 py-3 transition-colors duration-300 hover:bg-[rgba(255,171,74,0.025)]">
      <CheckMark />
      <div className="min-w-0">
        <p className="text-sm text-foreground/55 transition-colors duration-300 group-hover:text-foreground/70">{quest.title}</p>
        {quest.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted/40">{quest.description}</p>
        )}
      </div>
    </li>
  );
}

/* ── SIDE QUEST ROW ──────────────────────────────────────────────────────── */
function SideQuestRow({ sideQuest }: { sideQuest: SideQuest }) {
  const isCompleted = sideQuest.status === "completed";
  return (
    <li className="group flex items-start gap-3.5 overflow-hidden rounded-md px-4 py-3.5 transition-colors duration-300 hover:bg-[rgba(255,171,74,0.025)]">
      {isCompleted ? (
        <CheckMark />
      ) : (
        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent/20 shadow-[0_0_4px_rgba(255,171,74,0.15)]" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm leading-relaxed transition-colors duration-300 ${isCompleted ? "text-foreground/50 group-hover:text-foreground/65" : "text-foreground/70 group-hover:text-foreground/85"}`}>
            {sideQuest.title}
          </p>
          {!isCompleted && (
            <span className="shrink-0 rounded-sm bg-muted/5 px-2 py-0.5 font-display text-[0.57rem] tracking-wide text-muted/35">
              Available
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted/40">{sideQuest.description}</p>
      </div>
    </li>
  );
}

/* ── COMPLETED BUILD ROW ─────────────────────────────────────────────────── */
function CompletedBuildRow({ build }: { build: Build }) {
  return (
    <li className="group flex items-center gap-4 rounded-md px-4 py-2.5 transition-colors duration-300 hover:bg-[rgba(255,171,74,0.025)]">
      <CheckMark />
      <span className="text-sm text-foreground/50 transition-colors duration-300 group-hover:text-foreground/65">
        {build.title}
      </span>
    </li>
  );
}

/* ── CHECK MARK ──────────────────────────────────────────────────────────── */
function CheckMark() {
  return (
    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border border-accent/18 bg-accent/5">
      <svg className="size-2.5 text-accent/55" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M2 5.5L4.2 7.5L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
