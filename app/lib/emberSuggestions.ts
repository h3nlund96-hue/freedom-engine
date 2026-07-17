/**
 * Dynamic suggested questions for Ember's chat — pure logic, no LLM call.
 * Mirrors what Ember can already see (the active Quest/Build) and calls out
 * what she can do (activate a Quest, complete a Build, capture an idea) so
 * those tools stay discoverable. Shared between the floating widget and the
 * Hall of Embers room so both surface the same suggestions.
 */

export interface ActiveInfo {
  questTitle?: string;
  buildTitle?: string;
}

export function buildSuggestedQuestions(info: ActiveInfo | null): string[] {
  if (info?.questTitle && info?.buildTitle) {
    return [
      `What's blocking "${info.buildTitle}"?`,
      `Mark "${info.buildTitle}" as complete`,
      `Generate the next Build for "${info.questTitle}"`,
      "Capture this as an idea",
    ];
  }

  if (info?.questTitle) {
    return [
      `Generate the next Build for "${info.questTitle}"`,
      "Activate a different Quest",
      "What is the smallest useful next step?",
      "Capture this as an idea",
    ];
  }

  return [
    "Activate a Quest for me",
    "What should the next Quest be?",
    "Help me create a new Quest",
    "Capture this as an idea",
  ];
}
