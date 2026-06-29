"use client";

import { useState } from "react";
import {
  progress,
  getActiveQuestline,
  getActiveQuest,
  getCurrentBuild,
} from "../data/freedomEngineProgress";

/* ── TYPES ────────────────────────────────────────────────────────────────── */

type CompanionStatus = "awake" | "emerging" | "dormant";

interface Companion {
  name: string;
  role: string;
  status: CompanionStatus;
  description: string;
}

/* ── DATA ─────────────────────────────────────────────────────────────────── */

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

const SUGGESTED_QUESTIONS = [
  "What should the next Build be?",
  "Does this serve the Main Quest?",
  "Is this a Side Quest or part of the active Questline?",
  "What is the smallest useful next step?",
];

/* ── STATUS CONFIG ────────────────────────────────────────────────────────── */

const statusConfig: Record<
  CompanionStatus,
  {
    label: string;
    panelClass: string;
    glowStyle: string;
    dotClass: string;
    nameClass: string;
  }
> = {
  awake: {
    label: "Awake",
    panelClass: "from-[rgba(26,19,11,0.94)] to-[rgba(12,9,6,0.97)]",
    glowStyle:
      "radial-gradient(ellipse at top left, rgba(232,132,42,0.10) 0%, transparent 60%)",
    dotClass: "bg-accent-glow shadow-[0_0_10px_rgba(232,132,42,0.65)]",
    nameClass: "text-foreground",
  },
  emerging: {
    label: "Emerging",
    panelClass: "from-[rgba(20,16,10,0.90)] to-[rgba(10,8,6,0.94)]",
    glowStyle:
      "radial-gradient(ellipse at top left, rgba(212,165,116,0.06) 0%, transparent 60%)",
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

/* ── COMPANION HALL CLIENT ────────────────────────────────────────────────── */

export function CompanionHallClient() {
  const [stewardOpen, setStewardOpen] = useState(false);

  const [steward, ...others] = companions;

  return (
    <section className="animate-fade-up space-y-8" style={{ animationDelay: "0.24s" }}>
      <div className="flex items-center gap-3">
        <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">
          The Council
        </p>
        <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Steward — spans full width when open */}
        <div className={`transition-all duration-500 ${stewardOpen ? "sm:col-span-2" : ""}`}>
          <StewardCard
            companion={steward}
            open={stewardOpen}
            onToggle={() => setStewardOpen((v) => !v)}
          />
        </div>

        {/* Remaining companions */}
        {others.map((companion, i) => (
          <CompanionCard
            key={companion.name}
            companion={companion}
            delay={0.28 + (i + 1) * 0.08}
          />
        ))}
      </div>
    </section>
  );
}

/* ── STEWARD CARD ─────────────────────────────────────────────────────────── */

function StewardCard({
  companion,
  open,
  onToggle,
}: {
  companion: Companion;
  open: boolean;
  onToggle: () => void;
}) {
  const cfg = statusConfig[companion.status];

  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState(false);

  function handleAsk() {
    if (!question.trim()) return;
    setAsked(true);
  }

  function handleSuggestion(q: string) {
    setQuestion(q);
    setAsked(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuestion(e.target.value);
    if (asked) setAsked(false);
  }

  const activeQuestline = getActiveQuestline(progress);
  const activeQuest = activeQuestline ? getActiveQuest(activeQuestline) : undefined;
  const currentBuild = activeQuest ? getCurrentBuild(activeQuest) : undefined;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
      {/* Base */}
      <div className={`absolute inset-0 bg-linear-to-br ${cfg.panelClass}`} />

      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-125"
        style={{ background: cfg.glowStyle }}
        aria-hidden
      />

      {/* Inset ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(212,165,116,0.11), inset 0 0 0 1px rgba(212,165,116,0.05)",
        }}
        aria-hidden
      />

      {/* Top accent line — brightens when open */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent-glow/0 to-transparent transition-all duration-500 ${
          open ? "via-accent-glow/35" : "group-hover:via-accent-glow/15"
        }`}
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col gap-5 p-6 sm:p-7">

        {/* Status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
              <span className={`relative inline-flex size-2 rounded-full ${cfg.dotClass}`} />
            </span>
            <span className="font-display text-[0.58rem] tracking-[0.22em] uppercase text-accent-glow/75">
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Name + role */}
        <div className="space-y-2">
          <h2 className={`font-display text-2xl tracking-wide transition-colors duration-500 ${cfg.nameClass}`}>
            {companion.name}
          </h2>
          <p className="text-xs leading-relaxed text-muted/60">{companion.role}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-accent/12 to-transparent" aria-hidden />

        {/* Description */}
        <p className="text-sm leading-relaxed text-foreground/65">{companion.description}</p>

        {/* Consult / Close toggle */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onToggle}
            className="group/btn inline-flex items-center gap-2 rounded text-xs transition-colors duration-300"
            style={{ color: open ? "rgba(212,165,116,0.50)" : "rgba(212,165,116,0.70)" }}
          >
            <span
              className={`inline-block transition-transform duration-300 ${
                open ? "rotate-90" : "group-hover/btn:translate-x-0.5"
              }`}
              aria-hidden
            >
              {open ? "↑" : "→"}
            </span>
            <span className="font-display tracking-[0.12em] uppercase">
              {open ? "Close" : "Consult The Steward"}
            </span>
          </button>
        </div>

        {/* ── INLINE CONSOLE ──────────────────────────────────────────────── */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-6 pt-2">

            {/* Console separator */}
            <div className="flex items-center gap-4" aria-hidden>
              <div className="h-px flex-1 bg-linear-to-r from-accent/15 to-transparent" />
              <span className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-accent-glow/40">
                Active
              </span>
              <div className="h-px flex-1 bg-linear-to-l from-accent/15 to-transparent" />
            </div>

            {/* Console header */}
            <div className="space-y-1">
              <h3 className="font-display text-lg tracking-wide text-foreground/90">
                Ask The Steward
              </h3>
              <p className="text-xs text-muted/50">
                A quiet place to ask for direction before choosing the next Build.
              </p>
            </div>

            {/* Context panel */}
            <div className="space-y-2">
              <p className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-muted/35">
                Current Context
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <ContextItem label="Active Questline" value={activeQuestline?.title ?? "—"} />
                <ContextItem label="Active Quest" value={activeQuest?.title ?? "—"} />
                <ContextItem label="Current Build" value={currentBuild?.title ?? "—"} highlight />
              </div>
            </div>

            {/* Suggested questions */}
            <div className="space-y-2.5">
              <p className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-muted/35">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSuggestion(q)}
                    className={`rounded-lg border px-3 py-1.5 text-xs leading-snug transition-all duration-300 ${
                      question === q
                        ? "border-accent/30 bg-accent/8 text-accent/90"
                        : "border-accent/[0.07] bg-black/20 text-muted/45 hover:border-accent/18 hover:text-muted/70"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2.5">
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-black/35" />
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(212,165,116,0.05), inset 0 0 0 1px rgba(212,165,116,0.07)",
                  }}
                  aria-hidden
                />
                <textarea
                  value={question}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  rows={3}
                  placeholder="Ask about the next Build, a product decision, or where to focus..."
                  className="relative w-full resize-none bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground/80 placeholder:text-muted/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.6rem] tracking-wide text-muted/30">
                  Shift+Enter for new line · Enter to ask
                </p>
                <button
                  type="button"
                  onClick={handleAsk}
                  disabled={!question.trim()}
                  className="group/ask relative overflow-hidden rounded-lg px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: question.trim()
                      ? "linear-gradient(135deg, rgba(212,165,116,0.18) 0%, rgba(232,132,42,0.12) 100%)"
                      : "rgba(255,255,255,0.02)",
                    boxShadow: question.trim()
                      ? "inset 0 1px 0 rgba(212,165,116,0.15), 0 4px 16px rgba(0,0,0,0.3)"
                      : "inset 0 1px 0 rgba(212,165,116,0.04)",
                    color: question.trim()
                      ? "rgba(212,165,116,0.90)"
                      : "rgba(212,165,116,0.35)",
                    border: question.trim()
                      ? "1px solid rgba(212,165,116,0.14)"
                      : "1px solid rgba(212,165,116,0.06)",
                  }}
                >
                  <span className="relative z-10">Ask The Steward</span>
                  {question.trim() && (
                    <span
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/ask:opacity-100"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(232,132,42,0.08) 0%, transparent 70%)",
                      }}
                      aria-hidden
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Alpha response */}
            <div
              className={`overflow-hidden rounded-xl transition-all duration-500 ${
                asked ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-black/40" />
                <div className="absolute inset-y-0 left-0 w-px rounded-full bg-linear-to-b from-accent-glow/45 via-accent/20 to-transparent" />
                <div className="relative flex flex-col gap-1 px-5 py-4">
                  <p className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-accent-glow/55">
                    The Steward
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/65">
                    The Steward is listening.
                  </p>
                  <p className="text-xs leading-relaxed text-muted/40">
                    Real Companion intelligence will be activated in a later Build.
                  </p>
                </div>
              </div>
            </div>

            {/* Alpha note */}
            <p className="text-[0.6rem] tracking-wide text-muted/28">
              Alpha — no AI is connected yet. Real Companion intelligence will be activated in a later Build.
            </p>

          </div>
        </div>

      </div>
    </article>
  );
}

/* ── STANDARD COMPANION CARD ─────────────────────────────────────────────── */

function CompanionCard({
  companion,
  delay,
}: {
  companion: Companion;
  delay: number;
}) {
  const cfg = statusConfig[companion.status];
  const isEmerging = companion.status === "emerging";

  return (
    <article
      className={`animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-700 ${
        isEmerging
          ? "hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5)]"
          : "opacity-75 hover:opacity-90"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Base */}
      <div className={`absolute inset-0 bg-linear-to-br ${cfg.panelClass}`} />

      {/* Glow */}
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
          boxShadow: isEmerging
            ? "inset 0 1px 0 rgba(212,165,116,0.07), inset 0 0 0 1px rgba(212,165,116,0.03)"
            : "inset 0 1px 0 rgba(212,165,116,0.04)",
        }}
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col gap-5 p-6 sm:p-7">
        {/* Status row */}
        <div className="flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${cfg.dotClass}`}
            aria-hidden
          />
          <span
            className={`font-display text-[0.58rem] tracking-[0.22em] uppercase ${
              isEmerging ? "text-accent/55" : "text-muted/35"
            }`}
          >
            {cfg.label}
          </span>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <h2
            className={`font-display text-2xl tracking-wide transition-colors duration-500 ${cfg.nameClass}`}
          >
            {companion.name}
          </h2>
          <p
            className={`text-xs leading-relaxed ${
              isEmerging ? "text-muted/60" : "text-muted/35"
            }`}
          >
            {companion.role}
          </p>
        </div>

        {/* Divider */}
        <div
          className={`h-px bg-linear-to-r from-accent/12 to-transparent ${isEmerging ? "" : "opacity-50"}`}
          aria-hidden
        />

        {/* Description */}
        <p
          className={`text-sm leading-relaxed ${
            isEmerging ? "text-foreground/50" : "text-foreground/35"
          }`}
        >
          {companion.description}
        </p>
      </div>
    </article>
  );
}

/* ── CONTEXT ITEM ─────────────────────────────────────────────────────────── */

function ContextItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{
        background: highlight ? "rgba(212,165,116,0.05)" : "rgba(0,0,0,0.25)",
        border: highlight
          ? "1px solid rgba(212,165,116,0.10)"
          : "1px solid rgba(212,165,116,0.05)",
      }}
    >
      <p className="font-display text-[0.52rem] tracking-[0.18em] uppercase text-muted/35">
        {label}
      </p>
      <p
        className={`mt-1 text-xs leading-snug ${
          highlight ? "text-accent/80" : "text-foreground/55"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
