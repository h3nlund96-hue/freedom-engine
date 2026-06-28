import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";

export const metadata: Metadata = {
  title: "Quest Board — Freedom Engine",
  description: "The active path through Freedom Engine.",
};

/* ── DATA ─────────────────────────────────────────────────────────────────── */

const questlines = [
  {
    title: "AI Mastery HQ",
    status: "active" as const,
    description: "The current Questline focused on building the first real version of Freedom Engine.",
  },
  {
    title: "Freedom Engine Core",
    status: "dormant" as const,
    description: "The deeper operating system that will grow after the first HQ is useful.",
  },
];

const sideQuests = [
  {
    title: "Environment Art Pass",
    status: "later" as const,
    description: "Add real background art and world atmosphere to each location.",
  },
  {
    title: "Set up GitHub Repository",
    status: "soon" as const,
    description: "Back up Freedom Engine safely in the cloud.",
  },
  {
    title: "Product Vision Docs",
    status: "soon" as const,
    description: "Create source-of-truth documents for product vision, design system, and lexicon.",
  },
];

const completedBuilds = [
  { id: "007", title: "Constitution Hall" },
  { id: "006", title: "Make the World Navigable" },
  { id: "005", title: "First Transformation" },
  { id: "004", title: "Create Freedom Engine" },
];

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default function QuestBoardPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground />

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

        {/* Page header */}
        <header className="animate-fade-up space-y-6" style={{ animationDelay: "0.08s" }}>
          <div className="space-y-1">
            <p className="font-display text-[0.65rem] tracking-[0.28em] uppercase text-accent/65">Quest Chamber</p>
            <h1 className="font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">Quest Board</h1>
            <p className="pt-1 text-base text-muted sm:text-lg">The active path through Freedom Engine.</p>
          </div>
          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-linear-to-r from-accent/30 to-accent/10" />
            <span className="size-[3px] rounded-full bg-accent/40 shadow-[0_0_8px_rgba(212,165,116,0.4)]" />
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" />
          </div>
          <p className="max-w-lg text-base leading-relaxed text-foreground/70">
            This is where The Founder sees the current Quest, the active Build, and the next step forward.
          </p>
        </header>

        {/* ── 1. MAIN QUEST ── */}
        <section className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <SectionLabel>Main Quest</SectionLabel>
          <MainQuestTile />
        </section>

        {/* ── 2. QUESTLINES ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.24s" }}>
          <SectionLabel>Questlines</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {questlines.map((q) => (
              <QuestlineCard key={q.title} title={q.title} status={q.status} description={q.description} />
            ))}
          </div>
        </section>

        {/* ── 3. ACTIVE QUEST + CURRENT BUILD (linked) ── */}
        <section className="animate-fade-up space-y-0" style={{ animationDelay: "0.32s" }}>
          <SectionLabel>Active Quest</SectionLabel>
          <ActiveQuestPanel />

          {/* Connector */}
          <div className="flex items-center justify-start py-1 pl-7" aria-hidden>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-5 w-px bg-linear-to-b from-accent-glow/50 to-accent/20" />
              <div className="size-1 rounded-full bg-accent/40 shadow-[0_0_6px_rgba(212,165,116,0.4)]" />
              <div className="h-3 w-px bg-linear-to-b from-accent/20 to-transparent" />
            </div>
          </div>

          <div>
            <SectionLabel>Current Build</SectionLabel>
            <CurrentBuildPanel />
          </div>
        </section>

        {/* ── 4. SIDE QUESTS ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.42s" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <SectionLabel>Side Quests</SectionLabel>
              <p className="mt-1 text-xs leading-relaxed text-muted/60">
                Smaller useful quests that can support the main path without becoming the main path.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {sideQuests.map((q) => (
              <SideQuestRow key={q.title} title={q.title} status={q.status} description={q.description} />
            ))}
          </ul>
        </section>

        {/* ── 5. COMPLETED BUILDS ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.50s" }}>
          <SectionLabel>Completed Builds</SectionLabel>
          <ul className="space-y-1.5">
            {completedBuilds.map((b, i) => (
              <CompletedBuildRow key={b.id} id={b.id} title={b.title} index={i} />
            ))}
          </ul>
        </section>

        {/* ── GUIDING PRINCIPLE ── */}
        <blockquote
          className="animate-fade-up relative py-1 pl-7"
          style={{ animationDelay: "0.58s" }}
        >
          <span className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/40 via-accent/15 to-transparent" aria-hidden />
          <span className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/50 shadow-[0_0_10px_rgba(232,132,42,0.35)]" aria-hidden />
          <p className="font-display text-sm italic leading-relaxed text-muted/90 sm:text-base">
            Every Quest is completed through Builds.
          </p>
        </blockquote>

        {/* Footer */}
        <footer
          className="animate-fade-up mt-auto flex items-center gap-4 pt-2"
          style={{ animationDelay: "0.64s" }}
        >
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
    <div className="mb-3 flex items-center gap-3">
      <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">{children}</p>
      <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
    </div>
  );
}

/* ── MAIN QUEST TILE ─────────────────────────────────────────────────────── */
function MainQuestTile() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-linear-to-r from-[rgba(26,19,11,0.92)] to-[rgba(14,11,7,0.88)]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent/50 via-accent/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(212,165,116,0.07)]" aria-hidden />

      <div className="relative flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-7">
        <div className="shrink-0">
          <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/50">North Star</p>
          <p className="mt-1 font-display text-lg tracking-wide text-foreground/95">
            Build the Freedom Engine.
          </p>
        </div>
        <p className="border-t border-accent/[0.06] pt-3 text-xs leading-relaxed text-muted/65 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          The long-term path. Everything inside AI Mastery HQ serves this larger mission.
        </p>
      </div>
    </div>
  );
}

/* ── QUESTLINE CARD ──────────────────────────────────────────────────────── */
function QuestlineCard({
  title,
  status,
  description,
}: {
  title: string;
  status: "active" | "dormant";
  description: string;
}) {
  const isActive = status === "active";

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
        isActive
          ? "shadow-[inset_0_1px_0_rgba(212,165,116,0.08)]"
          : "opacity-60 shadow-[inset_0_1px_0_rgba(212,165,116,0.04)]"
      }`}
    >
      <div className={`absolute inset-0 ${isActive ? "bg-linear-to-br from-[rgba(24,18,11,0.90)] to-[rgba(12,9,6,0.93)]" : "bg-[rgba(12,10,8,0.80)]"}`} />

      <div className="relative flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2.5">
          {isActive ? (
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(232,132,42,0.6)]" />
            </span>
          ) : (
            <span className="size-1.5 rounded-full bg-muted/25" aria-hidden />
          )}
          <span className={`font-display text-[0.58rem] tracking-[0.22em] uppercase ${isActive ? "text-accent-glow/75" : "text-muted/45"}`}>
            {isActive ? "Active" : "Dormant"}
          </span>
        </div>

        <h3 className={`font-display text-base tracking-wide ${isActive ? "text-foreground/95" : "text-foreground/55"}`}>
          {title}
        </h3>

        <p className="text-xs leading-relaxed text-muted/60">{description}</p>
      </div>
    </div>
  );
}

/* ── ACTIVE QUEST PANEL ──────────────────────────────────────────────────── */
function ActiveQuestPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(26,19,12,0.92)] to-[rgba(12,9,6,0.96)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(232,132,42,0.07)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(212,165,116,0.09)]" aria-hidden />
      <span className="pointer-events-none absolute left-4 top-4 h-3.5 w-3.5 border-l border-t border-accent/18" aria-hidden />
      <span className="pointer-events-none absolute right-4 top-4 h-3.5 w-3.5 border-r border-t border-accent/18" aria-hidden />

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-glow shadow-[0_0_10px_rgba(232,132,42,0.65)]" />
          </span>
          <span className="font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/75">Active</span>
        </div>

        <h2 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">
          Quest 2 — Build Freedom Engine Alpha
        </h2>

        <p className="mt-2 text-xs tracking-wide text-muted/55">
          Part of Questline: <span className="text-accent/70">AI Mastery HQ</span>
        </p>

        <p className="mt-5 max-w-lg text-sm leading-relaxed text-foreground/65 sm:text-base">
          Build the first usable version of the Freedom Engine world.
        </p>
      </div>
    </div>
  );
}

/* ── CURRENT BUILD PANEL ─────────────────────────────────────────────────── */
function CurrentBuildPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-linear-to-b from-[rgba(28,21,13,0.94)] to-[rgba(12,9,6,0.98)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,165,116,0.09)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(212,165,116,0.11),inset_0_-1px_0_rgba(0,0,0,0.4)]" aria-hidden />
      <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-accent/22" aria-hidden />
      <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-accent/22" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-accent/12" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-accent/12" aria-hidden />

      <div className="relative px-6 py-8 sm:px-8 sm:py-9">
        <p className="mb-3 font-display text-[0.6rem] tracking-[0.3em] uppercase text-accent/55">Current Build</p>

        <h2 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">
          Build #008 — Quest Board
        </h2>

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground/65 sm:text-base">
          Refine the Quest Board into a clear strategic room where The Founder understands the active Quest, current Build, and next step.
        </p>

        <div className="mt-7 border-t border-accent/[0.08] pt-6">
          <p className="mb-2.5 font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/65">Next Step</p>
          <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
            Review and approve the Quest Board structure before moving to the next room.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── SIDE QUEST ROW ──────────────────────────────────────────────────────── */
const sideQuestStatusConfig = {
  soon:  { label: "Soon",  classes: "text-accent/80 bg-accent/8 border-accent/15" },
  later: { label: "Later", classes: "text-muted/65 bg-muted/5 border-muted/12" },
};

function SideQuestRow({
  title,
  status,
  description,
}: {
  title: string;
  status: "soon" | "later";
  description: string;
}) {
  const cfg = sideQuestStatusConfig[status];

  return (
    <li className="group relative flex flex-col gap-2 overflow-hidden rounded-xl px-5 py-4 transition-colors duration-300 hover:bg-[rgba(212,165,116,0.03)]">
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(212,165,116,0.04)]" aria-hidden />
      <div className="absolute inset-0 bg-[rgba(14,11,8,0.60)]" />

      <div className="relative flex items-center justify-between gap-4">
        <p className="font-display text-sm tracking-wide text-foreground/80 transition-colors duration-300 group-hover:text-foreground/95">
          {title}
        </p>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-display text-[0.58rem] tracking-[0.15em] uppercase ${cfg.classes}`}>
          {cfg.label}
        </span>
      </div>

      <p className="relative text-xs leading-relaxed text-muted/60">{description}</p>
    </li>
  );
}

/* ── COMPLETED BUILD ROW ─────────────────────────────────────────────────── */
function CompletedBuildRow({ id, title, index }: { id: string; title: string; index: number }) {
  return (
    <li
      className="animate-fade-up group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-[rgba(212,165,116,0.025)]"
      style={{ animationDelay: `${0.53 + index * 0.05}s` }}
    >
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-accent/18 bg-accent/5">
        <svg className="size-2.5 text-accent/55" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M2 5.5L4.2 7.5L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="flex min-w-0 flex-1 items-baseline gap-3">
        <span className="shrink-0 font-display text-[0.65rem] tracking-widest text-muted/40">#{id}</span>
        <span className="truncate text-sm text-foreground/50 transition-colors duration-300 group-hover:text-foreground/65">
          {title}
        </span>
      </div>
    </li>
  );
}
