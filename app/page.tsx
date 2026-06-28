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
    description:
      "A sacred hall containing the principles that guide every decision.",
    href: "/constitution",
    glow: "gold" as const,
  },
  {
    icon: "⚔️",
    title: "Quest Board",
    description:
      "The place where The Founder sees the active Quest and current Build.",
    href: "/quest-board",
    glow: "amber" as const,
  },
  {
    icon: "💡",
    title: "Idea Vault",
    description:
      "A safe place to capture ideas without letting them distract from the active Quest.",
    href: "/idea-vault",
    glow: "gold" as const,
  },
  {
    icon: "🔥",
    title: "Tend the Fire",
    description:
      "A place to return when motivation is low. The fire is always waiting.",
    href: "/tend-the-fire",
    glow: "warm" as const,
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
            className="relative grid gap-5 sm:grid-cols-2"
            aria-label="World navigation"
          >
            {/* Subtle path connector on desktop */}
            <div
              className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-linear-to-b from-transparent via-accent/[0.06] to-transparent sm:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-px -translate-y-1/2 bg-linear-to-r from-transparent via-accent/[0.05] to-transparent sm:block"
              aria-hidden
            />

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

        <BuildPrompt />
      </main>
    </div>
  );
}
