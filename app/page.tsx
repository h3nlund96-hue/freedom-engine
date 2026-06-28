import { AtmosphericBackground } from "./components/AtmosphericBackground";
import { BuildPrompt } from "./components/BuildPrompt";
import { HQHeader } from "./components/HQHeader";
import { PrincipleBlock } from "./components/PrincipleBlock";
import { QuestStatus } from "./components/QuestStatus";
import { WorldCard } from "./components/WorldCard";

const worldPlaces = [
  {
    icon: "📜",
    title: "Constitution Hall",
    description: "A sacred hall containing the principles that guide every decision.",
    href: "/constitution",
    glow: "gold" as const,
  },
  {
    icon: "⚔️",
    title: "Quest Board",
    description: "The place where The Founder sees the active Quest and current Build.",
    href: "/quest-board",
    glow: "amber" as const,
  },
  {
    icon: "💡",
    title: "Idea Vault",
    description: "A safe place to capture ideas without letting them distract from the active Quest.",
    href: "/idea-vault",
    glow: "gold" as const,
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">
        <HQHeader
          title="🏛️ AI Mastery HQ"
          welcome="Welcome back, Founder."
        />

        <PrincipleBlock principle="The system exists to serve The Founder. The Founder does not exist to serve the system." />

        <QuestStatus
          sectionTitle="🧭 Freedom Engine"
          mainQuest="Build the Freedom Engine."
          currentQuestline="AI Mastery HQ"
          currentBuild="Build the first version of AI Mastery HQ."
        />

        {/* World navigation — three locations */}
        <section className="space-y-8">
          <div
            className="animate-fade-up space-y-2"
            style={{ animationDelay: "0.35s" }}
          >
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-muted/60">
              Within these walls
            </p>
            <h2 className="font-display text-2xl tracking-wide text-foreground/90">
              Explore the World
            </h2>
          </div>

          <nav
            className="grid gap-5 sm:grid-cols-3"
            aria-label="World navigation"
          >
            {worldPlaces.map((place, index) => (
              <WorldCard
                key={place.title}
                icon={place.icon}
                title={place.title}
                description={place.description}
                href={place.href}
                glow={place.glow}
                delay={0.42 + index * 0.1}
              />
            ))}
          </nav>
        </section>

        {/* Tend the Fire — embedded in HQ */}
        <TendTheFire />

        <BuildPrompt />
      </main>
    </div>
  );
}

/* ── TEND THE FIRE ───────────────────────────────────────────────────────── */
const smallBuilds = [
  "Review the current Build",
  "Capture one idea",
  "Take the next tiny step",
];

function TendTheFire() {
  return (
    <section
      className="animate-fade-up"
      style={{ animationDelay: "0.62s" }}
      aria-label="Tend the Fire"
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Base */}
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(22,14,7,0.95)] to-[rgba(10,7,4,0.97)]" />

        {/* Warm ember glow — the fire */}
        <div
          className="animate-ember-drift absolute -left-12 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,100,18,0.18) 0%, rgba(200,80,10,0.08) 45%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="animate-glow-pulse absolute inset-x-0 bottom-0 h-20"
          style={{
            background:
              "radial-gradient(ellipse at 35% 100%, rgba(220,90,15,0.10) 0%, transparent 65%)",
          }}
          aria-hidden
        />

        {/* Top edge warmth */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(232,132,42,0.14), inset 1px 0 0 rgba(232,132,42,0.06)",
          }}
          aria-hidden
        />

        {/* Corner marks — warmer tone */}
        <span className="pointer-events-none absolute left-4 top-4 h-3.5 w-3.5 border-l border-t border-accent-glow/20" aria-hidden />
        <span className="pointer-events-none absolute right-4 top-4 h-3.5 w-3.5 border-r border-t border-accent-glow/20" aria-hidden />
        <span className="pointer-events-none absolute bottom-4 left-4 h-3.5 w-3.5 border-b border-l border-accent-glow/10" aria-hidden />
        <span className="pointer-events-none absolute bottom-4 right-4 h-3.5 w-3.5 border-b border-r border-accent-glow/10" aria-hidden />

        <div className="relative space-y-7 px-7 py-8 sm:px-9 sm:py-9">
          {/* Title and message */}
          <div className="space-y-2">
            <h2 className="font-display text-xl tracking-wide text-foreground/95 sm:text-2xl">
              🔥 Tend the Fire
            </h2>
            <p className="text-base leading-relaxed text-foreground/70">
              You are not behind. The fire is still burning.
            </p>
          </div>

          {/* Question */}
          <p className="font-display text-sm italic tracking-wide text-accent/80 sm:text-base">
            What is one small Build you can do today?
          </p>

          {/* Small action options */}
          <ul className="space-y-2" role="list">
            {smallBuilds.map((action) => (
              <li key={action}>
                <div className="group flex cursor-default items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-400 hover:bg-[rgba(232,100,18,0.06)]">
                  {/* Ember dot */}
                  <span className="relative flex size-1.5 shrink-0" aria-hidden>
                    <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/50" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow/70 shadow-[0_0_6px_rgba(232,132,42,0.5)]" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/60 transition-colors duration-400 group-hover:text-foreground/80">
                    {action}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Reminder */}
          <div className="flex items-center gap-4 pt-1">
            <span className="h-px flex-1 bg-linear-to-r from-accent-glow/15 to-transparent" aria-hidden />
            <p className="font-display text-[0.65rem] tracking-[0.22em] uppercase text-accent-glow/45">
              One ember is enough.
            </p>
            <span className="h-px flex-1 bg-linear-to-l from-accent-glow/15 to-transparent" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
