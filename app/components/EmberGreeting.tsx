import { EmberGlyph } from "./EmberGlyph";

/**
 * Ember's front-page greeting. Pure pre-written copy — no API call, no LLM,
 * no loading state. A random variant is picked fresh on every render, which
 * on this server-rendered page means every load. State-aware (no active
 * Quest/Build, or a Build with no next step get their own variant pools) but
 * never time-based — deliberately never mentions time away, streaks, or
 * counts. See the rules this Build shipped under (no guilt, no nagging).
 */

const ACTIVE_QUEST_TEMPLATES: ((quest: string) => string)[] = [
  (quest) => `Welcome back, Founder. You were last working on ${quest}.`,
  (quest) => `The fire's still lit. ${quest} is waiting for you.`,
  (quest) => `Good to see you. The thread's right where you left it: ${quest}.`,
  (quest) => `Founder. ${quest} is still on the table.`,
  (quest) => `Let's pick it up from here. ${quest} is still active.`,
  (quest) => `Back at the forge. ${quest} stands unfinished.`,
];

const NO_QUEST_VARIANTS = [
  "Welcome back, Founder. Nothing's active right now — what do you want to build?",
  "The table's clear. What's the next Build?",
  "The fire's lit, but no Quest is chosen. What sounds good?",
  "Blank slate, Founder. Where do we point it?",
];

const NO_BUILD_TEMPLATES: ((quest: string) => string)[] = [
  (quest) => `${quest} is active. What's the Build?`,
  (quest) => `The Quest is chosen — ${quest}. No Build in motion yet.`,
  (quest) => `${quest} is waiting on its next Build.`,
  (quest) => `Founder. ${quest} is set. Time to pick a Build.`,
];

const NO_NEXT_STEP_TEMPLATES: ((build: string) => string)[] = [
  (build) => `${build} is moving, but there's no next step pinned down.`,
  (build) => `${build} is active. What's the next concrete step?`,
  (build) => `Founder. ${build} could use a next step.`,
  (build) => `${build} is in motion — worth naming what comes next.`,
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface EmberGreetingProps {
  activeQuestTitle?: string;
  activeBuildTitle?: string;
  activeBuildNextStep?: string;
}

export function EmberGreeting({ activeQuestTitle, activeBuildTitle, activeBuildNextStep }: EmberGreetingProps) {
  let message: string;
  if (!activeQuestTitle) {
    message = pickRandom(NO_QUEST_VARIANTS);
  } else if (!activeBuildTitle) {
    message = pickRandom(NO_BUILD_TEMPLATES)(activeQuestTitle);
  } else if (!activeBuildNextStep) {
    message = pickRandom(NO_NEXT_STEP_TEMPLATES)(activeBuildTitle);
  } else {
    message = pickRandom(ACTIVE_QUEST_TEMPLATES)(activeQuestTitle);
  }

  return (
    <section className="animate-fade-up" style={{ animationDelay: "0.14s" }} aria-label="Ember">
      <div className="flex items-start gap-3">
        <EmberGlyph className="h-5 w-5" />
        <p className="pt-1 text-base leading-relaxed text-foreground/80 sm:text-lg">{message}</p>
      </div>
    </section>
  );
}
