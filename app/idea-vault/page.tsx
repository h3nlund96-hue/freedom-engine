import type { Metadata } from "next";
import { LocationShell } from "../components/LocationShell";

export const metadata: Metadata = {
  title: "Idea Vault — Freedom Engine",
};

const ideas = [
  "Build a daily reflection ritual into the HQ.",
  "Weekly review as a world event — The Founder's Council.",
  "A visual map of the Freedom Engine world.",
  "Voice notes that transcribe into the Vault.",
];

export default function IdeaVaultPage() {
  return (
    <LocationShell
      icon="💡"
      subtitle="Hidden Archive"
      title="Idea Vault"
      description="Ideas that arrive uninvited are captured here, where they sleep safely until their time comes. Nothing is lost. Nothing distracts. The active Quest remains the only thing that moves."
      lore="An idea captured is no longer a burden. It is a promise."
    >
      <div className="space-y-4">
        <p className="font-display text-[0.65rem] tracking-[0.22em] uppercase text-muted/50">
          Sleeping Ideas
        </p>
        <ul className="space-y-3">
          {ideas.map((idea, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl bg-[rgba(18,15,12,0.55)] px-5 py-4 shadow-[inset_0_1px_0_rgba(212,165,116,0.03)]"
            >
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent/30 shadow-[0_0_6px_rgba(212,165,116,0.3)]" aria-hidden />
              <p className="text-sm leading-relaxed text-foreground/65">{idea}</p>
            </li>
          ))}
        </ul>
        <p className="pt-2 text-xs text-muted/40">
          More ideas will sleep here as the world grows.
        </p>
      </div>
    </LocationShell>
  );
}
