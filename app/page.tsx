import { HQLiveProgress } from "./components/HQLiveProgress";
import { WorldCard } from "./components/WorldCard";
import { getProgress } from "./lib/questService";

const worldPlaces = [
  {
    icon: "⚖",
    title: "Constitution Hall",
    description: "A sacred hall containing the principles that guide every decision.",
    href: "/constitution",
    glow: "gold" as const,
  },
  {
    icon: "◎",
    title: "Quest Board",
    description: "The place where The Founder sees the active Quest and current Build.",
    href: "/quest-board",
    glow: "amber" as const,
  },
  {
    icon: "⬡",
    title: "Idea Vault",
    description: "A safe place to capture ideas without letting them distract from the active Quest.",
    href: "/idea-vault",
    glow: "gold" as const,
  },
  {
    icon: "⋈",
    title: "Hall of Embers",
    description: "Allies who walk the path with The Founder. Not bots — focused AI specialists.",
    href: "/hall-of-embers",
    glow: "ember" as const,
  },
  {
    icon: "✦",
    title: "The Observatory",
    description: "Patterns in momentum — what's moving, what's gone quiet.",
    href: "/observatory",
    glow: "amber" as const,
  },
];

export default async function Home() {
  const progress = await getProgress();

  return (
    <HQLiveProgress initialProgress={progress}>
      {/* World navigation */}
      <section className="space-y-8">
        <div
          className="animate-fade-up space-y-2"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="font-display text-2xl tracking-wide text-foreground/90">
            Explore the World
          </h2>
        </div>

        <nav
          className="grid gap-5 sm:grid-cols-2"
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
    </HQLiveProgress>
  );
}
