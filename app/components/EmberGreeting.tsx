import { EmberGlyph } from "./EmberGlyph";
import { pickRandom, pickProactiveNote } from "../lib/emberProactiveMessage";

/**
 * Ember's front-page greeting. Pure pre-written copy — no API call, no LLM,
 * no loading state. A random variant is picked fresh on every render, which
 * on this server-rendered page means every load. The "something's worth
 * flagging" cases (no active Quest, or an active Quest with no active
 * Build) come from emberProactiveMessage — shared with the floating
 * widget's bubble so both say the same things.
 */

const ACTIVE_QUEST_TEMPLATES: ((quest: string) => string)[] = [
  (quest) => `Welcome back, Founder. You were last working on ${quest}.`,
  (quest) => `The fire's still lit. ${quest} is waiting for you.`,
  (quest) => `Good to see you. The thread's right where you left it: ${quest}.`,
  (quest) => `Founder. ${quest} is still on the table.`,
  (quest) => `Let's pick it up from here. ${quest} is still active.`,
  (quest) => `Back at the forge. ${quest} stands unfinished.`,
];

interface EmberGreetingProps {
  activeQuestTitle?: string;
  activeBuildTitle?: string;
}

export function EmberGreeting({ activeQuestTitle, activeBuildTitle }: EmberGreetingProps) {
  const proactiveNote = pickProactiveNote(activeQuestTitle, activeBuildTitle);
  const message = proactiveNote ?? pickRandom(ACTIVE_QUEST_TEMPLATES)(activeQuestTitle ?? "");

  return (
    <section className="animate-fade-up" style={{ animationDelay: "0.14s" }} aria-label="Ember">
      <div className="flex items-start gap-3">
        <EmberGlyph className="h-5 w-5" />
        <p className="pt-1 text-base leading-relaxed text-foreground/80 sm:text-lg">{message}</p>
      </div>
    </section>
  );
}
