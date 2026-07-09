import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { VaultClient } from "./VaultClient";

export const metadata: Metadata = {
  title: "Idea Vault — Freedom Engine",
  description: "A hidden archive for ideas that are not ready to become Quests.",
};

export default function IdeaVaultPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground variant="idea-vault" />

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
            <span className="size-[3px] rounded-full bg-accent/40 shadow-[0_0_8px_rgba(255,171,74,0.4)]" />
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" />
          </div>
          <p className="max-w-lg text-base leading-relaxed text-foreground/70">
            This is where The Founder captures ideas safely without letting them distract from the active Quest.
          </p>
        </header>

        {/* Core rule */}
        <div className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
            <div className="absolute inset-0 bg-linear-to-r from-[rgba(10,17,30,0.90)] to-[rgba(6,9,16,0.85)]" />
            <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent/50 via-accent/25 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.07)]" aria-hidden />
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
        </div>

        {/* Interactive vault — capture + compartments */}
        <div className="animate-fade-up" style={{ animationDelay: "0.24s" }}>
          <VaultClient />
        </div>

        {/* Reminder */}
        <blockquote
          className="animate-fade-up relative py-1 pl-7"
          style={{ animationDelay: "0.32s" }}
        >
          <span className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/40 via-accent/15 to-transparent" aria-hidden />
          <span className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/50 shadow-[0_0_10px_rgba(77,216,255,0.35)]" aria-hidden />
          <p className="font-display text-sm italic leading-relaxed text-muted/90 sm:text-base">
            An idea does not need to become a Quest today.
          </p>
        </blockquote>

        {/* Footer */}
        <footer className="animate-fade-up mt-auto flex items-center gap-4 pt-2" style={{ animationDelay: "0.38s" }}>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">Idea Vault · Freedom Engine</p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}
