import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { CaptureInput } from "./CaptureInput";

export const metadata: Metadata = {
  title: "Idea Vault — Freedom Engine",
  description: "A hidden archive for ideas that are not ready to become Quests.",
};

/* ── DATA ─────────────────────────────────────────────────────────────────── */

const categories = [
  { title: "Raw Ideas",              description: "Fresh thoughts captured before they are judged.", count: 3 },
  { title: "Future Quests",          description: "Ideas that may become real Quests later.",       count: 0 },
  { title: "Side Quest Candidates",  description: "Smaller ideas that may support the main path.",  count: 0 },
  { title: "Experiments",            description: "Things worth testing before a larger Build.",     count: 0 },
];

const recentlySealed = [
  "Environment Art Pass",
  "Product Vision Docs",
  "GitHub Repository Setup",
];

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default function IdeaVaultPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">

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
        <header className="animate-fade-up space-y-7" style={{ animationDelay: "0.08s" }}>
          <div className="space-y-1">
            <p className="font-display text-[0.65rem] tracking-[0.28em] uppercase text-accent/65">Hidden Archive</p>
            <h1 className="font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">Idea Vault</h1>
            <p className="pt-1 text-base text-muted sm:text-lg">
              A hidden archive for ideas that are not ready to become Quests.
            </p>
          </div>
          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-linear-to-r from-accent/30 to-accent/10" />
            <span className="size-[3px] rounded-full bg-accent/40 shadow-[0_0_8px_rgba(212,165,116,0.4)]" />
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" />
          </div>
          <p className="max-w-lg text-base leading-relaxed text-foreground/70">
            This is where The Founder captures ideas safely without letting them distract from the active Quest.
          </p>
        </header>

        {/* Core rule */}
        <div className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <CoreRule />
        </div>

        {/* ── CAPTURE CONSOLE ── */}
        <section className="animate-fade-up space-y-4" style={{ animationDelay: "0.24s" }}>
          <SectionLabel>Capture an Idea</SectionLabel>
          <CaptureInput />
        </section>

        {/* ── VAULT COMPARTMENTS ── */}
        <section className="animate-fade-up space-y-5" style={{ animationDelay: "0.34s" }}>
          <SectionLabel>The Vault</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat, i) => (
              <VaultCompartment
                key={cat.title}
                title={cat.title}
                description={cat.description}
                count={cat.count}
                delay={0.38 + i * 0.06}
              />
            ))}
          </div>
        </section>

        {/* ── RECENTLY SEALED ── */}
        <section className="animate-fade-up space-y-5" style={{ animationDelay: "0.62s" }}>
          <SectionLabel>Recently Sealed</SectionLabel>
          <ul className="space-y-2">
            {recentlySealed.map((idea, i) => (
              <SealedIdeaRow key={idea} idea={idea} index={i} />
            ))}
          </ul>
        </section>

        {/* Reminder */}
        <blockquote
          className="animate-fade-up relative py-1 pl-7"
          style={{ animationDelay: "0.72s" }}
        >
          <span className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/40 via-accent/15 to-transparent" aria-hidden />
          <span className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/50 shadow-[0_0_10px_rgba(232,132,42,0.35)]" aria-hidden />
          <p className="font-display text-sm italic leading-relaxed text-muted/90 sm:text-base">
            An idea does not need to become a Quest today.
          </p>
        </blockquote>

        {/* Footer */}
        <footer
          className="animate-fade-up mt-auto flex items-center gap-4 pt-2"
          style={{ animationDelay: "0.78s" }}
        >
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">Idea Vault · Freedom Engine</p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}

/* ── SECTION LABEL ───────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">{children}</p>
      <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
    </div>
  );
}

/* ── CORE RULE ───────────────────────────────────────────────────────────── */
function CoreRule() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-linear-to-r from-[rgba(22,16,10,0.90)] to-[rgba(12,9,6,0.85)]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent/50 via-accent/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(212,165,116,0.07)]" aria-hidden />
      <div className="relative flex flex-col gap-1.5 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-7">
        <div className="shrink-0">
          <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/50">Core Rule</p>
          <p className="mt-1 font-display text-base tracking-wide text-foreground/90">
            Capture first. Organize later.
          </p>
        </div>
        <p className="border-t border-accent/[0.06] pt-3 text-xs leading-relaxed text-muted/60 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          The Idea Vault exists so ideas are never lost, but they also do not interrupt the active Build.
        </p>
      </div>
    </div>
  );
}

/* ── VAULT COMPARTMENT ───────────────────────────────────────────────────── */
function VaultCompartment({
  title,
  description,
  count,
  delay,
}: {
  title: string;
  description: string;
  count: number;
  delay: number;
}) {
  const hasItems = count > 0;

  return (
    <div
      className="animate-fade-up group relative overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(18,14,9,0.90)] to-[rgba(10,8,6,0.88)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(212,165,116,0.05) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(212,165,116,0.06),inset_0_0_0_1px_rgba(212,165,116,0.03)]" aria-hidden />

      <div className="relative p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className={`font-display text-sm tracking-wide transition-colors duration-300 ${hasItems ? "text-foreground/85 group-hover:text-foreground" : "text-foreground/40"}`}>
            {title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-display text-[0.58rem] tracking-wider ${
              hasItems
                ? "bg-accent/12 text-accent/70"
                : "bg-muted/5 text-muted/30"
            }`}
          >
            {count}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${hasItems ? "text-muted/55" : "text-muted/30"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── SEALED IDEA ROW ─────────────────────────────────────────────────────── */
function SealedIdeaRow({ idea, index }: { idea: string; index: number }) {
  return (
    <li
      className="animate-fade-up group flex items-center gap-4 overflow-hidden rounded-xl px-4 py-3.5 transition-colors duration-300 hover:bg-[rgba(212,165,116,0.025)]"
      style={{ animationDelay: `${0.65 + index * 0.06}s` }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl" aria-hidden />

      {/* Sealed marker */}
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[rgba(212,165,116,0.07)] shadow-[inset_0_1px_0_rgba(212,165,116,0.08)]">
        <span className="font-display text-[0.5rem] text-accent/50">✦</span>
      </span>

      <span className="text-sm text-foreground/50 transition-colors duration-300 group-hover:text-foreground/65">
        {idea}
      </span>
    </li>
  );
}
