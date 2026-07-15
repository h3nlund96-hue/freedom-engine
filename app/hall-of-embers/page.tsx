import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { LocationHeader } from "../components/LocationHeader";
import { HallOfEmbersClient } from "./HallOfEmbersClient";

export const metadata: Metadata = {
  title: "Hall of Embers — Freedom Engine",
  description: "Allies who walk the path with The Founder.",
};

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default function HallOfEmbersPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground variant="companions" />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">

        <LocationHeader
          icon="⋈"
          eyebrow="Council Chamber"
          title="Hall of Embers"
          description="Companions serve The Founder — they exist to support the active Quest and amplify The Founder's own judgment."
        />

        {/* Ember card + ask console */}
        <HallOfEmbersClient />

        {/* Footer */}
        <footer
          className="animate-fade-up mt-auto flex items-center gap-4 pt-2"
          style={{ animationDelay: "0.55s" }}
        >
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">
            Hall of Embers · Freedom Engine
          </p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}
