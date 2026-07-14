"use client";

import { EmberPanel } from "../components/EmberPanel";
import { EmberGlyph } from "../components/EmberGlyph";

/* ── COMPANION HALL CLIENT ────────────────────────────────────────────────── */

export function CompanionHallClient() {
  return (
    <section className="animate-fade-up space-y-8" style={{ animationDelay: "0.24s" }}>
      <div className="flex items-center gap-3">
        <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">
          Companion
        </p>
        <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
      </div>

      <EmberCard />
    </section>
  );
}

/* ── EMBER CARD ───────────────────────────────────────────────────────────── */

function EmberCard() {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-md border border-white/[0.07]">
      {/* Base */}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(11,20,35,0.94)] to-[rgba(6,9,16,0.97)]" />

      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top left, rgba(77,216,255,0.10) 0%, transparent 60%)" }}
        aria-hidden
      />

      {/* Inset ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.11), inset 0 0 0 1px rgba(255,171,74,0.05)" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-7">

        {/* Status row */}
        <div className="flex items-center gap-2">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-glow shadow-[0_0_10px_rgba(77,216,255,0.65)]" />
          </span>
          <span className="font-display text-[0.58rem] tracking-[0.22em] uppercase text-accent-glow/75">
            Awake
          </span>
        </div>

        {/* Name + role */}
        <div className="flex items-start gap-4">
          <EmberGlyph size="text-4xl" />
          <div className="space-y-2 pt-0.5">
            <h2 className="font-display text-2xl tracking-wide text-foreground">Ember</h2>
            <p className="text-xs leading-relaxed text-muted/60">
              Direction, decisions, prioritization and protection of the Freedom Engine vision.
            </p>
          </div>
        </div>

        {/* Console — same shared conversation as the widget on HQ, Quest Board and Idea Vault */}
        <div className="border-t border-accent/[0.07] pt-5">
          <EmberPanel />
        </div>

      </div>
    </article>
  );
}
