import type { Metadata } from "next";
import { LocationShell } from "../components/LocationShell";

export const metadata: Metadata = {
  title: "The Founder Constitution — Freedom Engine",
};

export default function ConstitutionPage() {
  return (
    <LocationShell
      icon="📜"
      subtitle="Sacred Hall"
      title="The Founder Constitution"
      description="These are the laws that govern the work. Not rules imposed from outside — laws carved from within. Every decision made in the Freedom Engine traces back to this hall."
      lore="A principle is not a rule. It is a truth that was paid for."
    >
      <div className="space-y-4">
        <p className="font-display text-[0.65rem] tracking-[0.22em] uppercase text-muted/50">
          Principles
        </p>
        <div className="space-y-3">
          {principles.map((p, i) => (
            <div
              key={i}
              className="rounded-xl bg-[rgba(18,15,12,0.6)] px-5 py-4 shadow-[inset_0_1px_0_rgba(212,165,116,0.04)]"
            >
              <p className="text-sm leading-relaxed text-foreground/70">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </LocationShell>
  );
}

const principles = [
  "The system exists to serve The Founder. The Founder does not exist to serve the system.",
  "One Quest at a time. One Build at a time. One day at a time.",
  "Capture everything. Commit to one thing.",
  "Momentum is sacred. Protect it.",
  "The fire is always waiting. Return to it.",
];
