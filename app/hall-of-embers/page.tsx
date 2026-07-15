import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";
import { EmberRoom } from "./EmberRoom";

export const metadata: Metadata = {
  title: "Hall of Embers — Freedom Engine",
  description: "Allies who walk the path with The Founder.",
};

/* ── PAGE ─────────────────────────────────────────────────────────────────── */

export default function HallOfEmbersPage() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground variant="companions" />
      <EmberRoom />
    </main>
  );
}
