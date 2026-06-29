import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { CompanionHallClient } from "./CompanionHallClient";

export const metadata: Metadata = {
  title: "Companion Hall — Freedom Engine",
  description: "Allies who walk the path with The Founder.",
};

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
                They do not command The Founder. They exist to support the active Quest, protect the Constitution, and amplify The Founder&apos;s own judgment.
              </p>
            </div>
          </div>
        </div>

        {/* Companion cards + expandable Steward Console */}
        <CompanionHallClient />

        {/* Alpha notice */}
        <div className="animate-fade-up" style={{ animationDelay: "0.62s" }}>
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
