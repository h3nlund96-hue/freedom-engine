/**
 * Something worth Ember mentioning unprompted — shared between the HQ
 * greeting and the floating widget's bubble so both surface the exact same
 * observations. Purely state-based, never time-based: no elapsed-time
 * checks, no streaks, no counts. Returns null when a Quest and a Build are
 * both already in motion — nothing to flag, so stay quiet.
 */

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const NO_QUEST_NOTES = [
  "Welcome back, Founder. Nothing's active right now — what do you want to build?",
  "The table's clear. What's the next Build?",
  "The fire's lit, but no Quest is chosen. What sounds good?",
  "Blank slate, Founder. Where do we point it?",
];

const NO_BUILD_NOTES: ((quest: string) => string)[] = [
  (quest) => `${quest} is active. What's the Build?`,
  (quest) => `The Quest is chosen — ${quest}. No Build in motion yet.`,
  (quest) => `${quest} is waiting on its next Build.`,
  (quest) => `Founder. ${quest} is set. Time to pick a Build.`,
];

export function pickProactiveNote(activeQuestTitle?: string, activeBuildTitle?: string): string | null {
  if (!activeQuestTitle) return pickRandom(NO_QUEST_NOTES);
  if (!activeBuildTitle) return pickRandom(NO_BUILD_NOTES)(activeQuestTitle);
  return null;
}
