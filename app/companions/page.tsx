import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";

export const metadata: Metadata = {
  title: "Companion Hall — Freedom Engine",
  description: "Allies who walk the path with The Founder.",
};

/* ── DATA ─────────────────────────────────────────────────────────────────── */

type CompanionStatus = "awake" | "emerging" | "dormant";

interface Companion {
  name: string;
  role: string;
  status: CompanionStatus;
  description: string;
}

const companions: Companion[] = [
  {
    name: "The Steward",
    role: "Direction, decisions, prioritization and protection of the Freedom Engine vision.",
    status: "awake",
    description:
      "Helps The Founder think clearly, choose the next Build, and protect the Main Quest, the Founder Constitution, and the long-term vision.",
  },
  {
    name: "The Builder",
    role: "Code, implementation and technical execution.",
    status: "emerging",
    description:
      "Helps turn Builds into working software and keeps the technical foundation strong.",
  },
  {
    name: "The Scribe",
    role: "Ideas, memory, documentation and source of truth.",
    status: "dormant",
    description:
      "Keeps the world organized without forcing The Founder to organize everything manually.",
  },
  {
    name: "The Scholar",
    role: "Learning, research, explanation and skill development.",
    status: "dormant",
    description:
      "Helps The Founder understand what he is building and grow through the process.",
  },
];

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default function CompanionHallPage() {
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
            <p className="font-display text-[0.65rem] tracking-[0.28em] uppercase text-accent/65">
              Council Chamber
            </p>
            <h1 className="font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">
              Companion Hall
            </h1>
            <p className="pt-1 text-base text-muted sm:text-lg">
              Allies who walk the path with The Founder.
            </p>
          </div>

          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-linear-to-r from-accent/30 to-accent/10" />
            <span className="size-[3px] rounded-full bg-accent/40 shadow-[0_0_8px_rgba(212,165,116,0.4)]" />
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" />
          </div>

          <p className="max-w-lg text-base leading-relaxed text-foreground/70">
            Companions are not bots. They are focused AI allies designed to help The Founder build, decide, learn, remember, and keep momentum inside Freedom Engine.
          </p>
        </header>

        {/* Core principle */}
        <div className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-linear-to-r from-[rgba(22,16,10,0.90)] to-[rgba(12,9,6,0.85)]" />
            <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent/50 via-accent/25 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(212,165,116,0.07)]" aria-hidden />
            <div className="relative flex flex-col gap-1.5 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-7">
              <div className="shrink-0">
                <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/50">Core Principle</p>
                <p className="mt-1 font-display text-base tracking-wide text-foreground/90">
                  Companions serve The Founder.
                </p>
              </div>
              <p className="border-t border-accent/[0.06] pt-3 text-xs leading-relaxed text-muted/60 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                They do not command The Founder. They exist to support the active Quest, protect the Constitution, and amplify The Founder's own judgment.
              </p>
            </div>
          </div>
        </div>

        {/* Companion cards */}
        <section className="animate-fade-up space-y-8" style={{ animationDelay: "0.24s" }}>
          <div className="flex items-center gap-3">
            <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">
              The Council
            </p>
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {companions.map((companion, i) => (
              <CompanionCard
                key={companion.name}
                companion={companion}
                delay={0.28 + i * 0.08}
              />
            ))}
          </div>
        </section>

        {/* Alpha notice */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.62s" }}
        >
          <div className="flex items-start gap-4 rounded-xl border border-dashed border-accent/[0.08] px-5 py-4">
            <span className="mt-0.5 font-display text-xs text-accent/40">Alpha</span>
            <p className="text-xs leading-relaxed text-muted/45">
              Companions are visible in Alpha, but real AI interaction will be added in a future Questline. For now, The Steward already works through the current Cursor workflow.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="animate-fade-up mt-auto flex items-center gap-4 pt-2"
          style={{ animationDelay: "0.70s" }}
        >
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">
            Companion Hall · Freedom Engine
          </p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}

/* ── COMPANION CARD ──────────────────────────────────────────────────────── */

const statusConfig: Record<
  CompanionStatus,
  { label: string; panelClass: string; glowStyle: string; dotClass: string; nameClass: string }
> = {
  awake: {
    label: "Awake",
    panelClass: "from-[rgba(26,19,11,0.94)] to-[rgba(12,9,6,0.97)]",
    glowStyle: "radial-gradient(ellipse at top left, rgba(232,132,42,0.10) 0%, transparent 60%)",
    dotClass: "bg-accent-glow shadow-[0_0_10px_rgba(232,132,42,0.65)]",
    nameClass: "text-foreground",
  },
  emerging: {
    label: "Emerging",
    panelClass: "from-[rgba(20,16,10,0.90)] to-[rgba(10,8,6,0.94)]",
    glowStyle: "radial-gradient(ellipse at top left, rgba(212,165,116,0.06) 0%, transparent 60%)",
    dotClass: "bg-accent/60 shadow-[0_0_6px_rgba(212,165,116,0.35)]",
    nameClass: "text-foreground/90",
  },
  dormant: {
    label: "Dormant",
    panelClass: "from-[rgba(14,11,8,0.85)] to-[rgba(8,6,4,0.90)]",
    glowStyle: "none",
    dotClass: "bg-muted/30",
    nameClass: "text-foreground/55",
  },
};

function CompanionCard({
  companion,
  delay,
}: {
  companion: Companion;
  delay: number;
}) {
  const cfg = statusConfig[companion.status];
  const isAwake = companion.status === "awake";
  const isEmerging = companion.status === "emerging";

  return (
    <article
      className={`animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-700 ${
        isAwake || isEmerging
          ? "hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5)]"
          : "opacity-75 hover:opacity-90"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Base */}
      <div className={`absolute inset-0 bg-linear-to-br ${cfg.panelClass}`} />

      {/* Status glow */}
      {cfg.glowStyle !== "none" && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-125"
          style={{ background: cfg.glowStyle }}
          aria-hidden
        />
      )}

      {/* Inset ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: isAwake
            ? "inset 0 1px 0 rgba(212,165,116,0.11), inset 0 0 0 1px rgba(212,165,116,0.04)"
            : isEmerging
            ? "inset 0 1px 0 rgba(212,165,116,0.07), inset 0 0 0 1px rgba(212,165,116,0.03)"
            : "inset 0 1px 0 rgba(212,165,116,0.04)",
        }}
        aria-hidden
      />

      {/* Awake — subtle hover bottom glow line */}
      {isAwake && (
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent-glow/0 to-transparent transition-all duration-700 group-hover:via-accent-glow/20"
          aria-hidden
        />
      )}

      <div className="relative flex flex-1 flex-col gap-5 p-6 sm:p-7">
        {/* Status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isAwake ? (
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
                <span className={`relative inline-flex size-2 rounded-full ${cfg.dotClass}`} />
              </span>
            ) : (
              <span className={`size-1.5 rounded-full ${cfg.dotClass}`} aria-hidden />
            )}
            <span
              className={`font-display text-[0.58rem] tracking-[0.22em] uppercase ${
                isAwake ? "text-accent-glow/75" : isEmerging ? "text-accent/55" : "text-muted/35"
              }`}
            >
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <h2 className={`font-display text-2xl tracking-wide transition-colors duration-500 ${cfg.nameClass}`}>
            {companion.name}
          </h2>
          <p className={`text-xs leading-relaxed ${isAwake || isEmerging ? "text-muted/60" : "text-muted/35"}`}>
            {companion.role}
          </p>
        </div>

        {/* Divider */}
        <div
          className={`h-px bg-linear-to-r from-accent/12 to-transparent ${isAwake ? "" : "opacity-50"}`}
          aria-hidden
        />

        {/* Description */}
        <p className={`text-sm leading-relaxed ${isAwake ? "text-foreground/65" : isEmerging ? "text-foreground/50" : "text-foreground/35"}`}>
          {companion.description}
        </p>
      </div>
    </article>
  );
}
