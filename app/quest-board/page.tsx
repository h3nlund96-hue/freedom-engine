import type { Metadata } from "next";
import { LocationShell } from "../components/LocationShell";

export const metadata: Metadata = {
  title: "Quest Board — Freedom Engine",
};

export default function QuestBoardPage() {
  return (
    <LocationShell
      icon="⚔️"
      subtitle="Planning Room"
      title="Quest Board"
      description="This is the room where the active Quest is chosen and the current Build is tracked. There is only one Quest at a time. That is the power of this place."
      lore="Clarity is the weapon. The Quest Board is where you sharpen it."
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl bg-linear-to-b from-[rgba(24,20,14,0.8)] to-[rgba(10,9,8,0.9)] shadow-[0_16px_48px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(212,165,116,0.05)]">
          {/* Corner marks */}
          <div className="relative px-6 py-7 sm:px-8 sm:py-8">
            <span className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-accent/12" aria-hidden />
            <span className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-accent/12" aria-hidden />

            <dl className="space-y-0">
              <ActiveQuestRow label="Main Quest" value="Build the Freedom Engine." />
              <ActiveQuestRow label="Current Questline" value="AI Mastery HQ" active />
              <ActiveQuestRow label="Current Build" value="Build the first version of AI Mastery HQ." isLast />
            </dl>
          </div>
        </div>
      </div>
    </LocationShell>
  );
}

function ActiveQuestRow({
  label,
  value,
  active = false,
  isLast = false,
}: {
  label: string;
  value: string;
  active?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className={`py-5 ${!isLast ? "border-b border-accent/[0.06]" : ""}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <dt className="flex min-w-40 shrink-0 items-center gap-2.5 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted/70">
          {active && (
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/80" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(232,132,42,0.6)]" />
            </span>
          )}
          {label}
        </dt>
        <dd
          className={`text-base leading-relaxed ${
            active ? "font-display text-accent-glow/95" : "text-foreground/75"
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
