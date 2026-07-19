// Quest System types. Data lives in Supabase — see app/lib/questService.ts.

export type QuestStatus = "available" | "active" | "completed";

export interface Build {
  id: string;
  buildNumber: number;
  title: string;
  status: QuestStatus;
  description?: string;
  /** Set the moment status becomes "completed"; cleared if reopened. Null for
   * anything never completed. See questMutationService.ts's toPatch(). */
  completedAt: string | null;
}

export interface Quest {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  builds?: Build[];
  completedAt: string | null;
}

export interface Questline {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  quests?: Quest[];
  completedAt: string | null;
}

export interface SideQuest {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  completedAt: string | null;
}

export interface FreedomEngineProgress {
  mainQuest: string;
  questlines: Questline[];
  sideQuests: SideQuest[];
}

/* ── DERIVED HELPERS ──────────────────────────────────────────────────────── */

/** Questlines don't carry their own "active" status — a Questline is only
 * ever on the Active Path because it's the parent of the active Quest. */
export function getActiveQuest(p: FreedomEngineProgress): Quest | undefined {
  for (const questline of p.questlines) {
    const quest = questline.quests?.find((q) => q.status === "active");
    if (quest) return quest;
  }
  return undefined;
}

export function getActiveQuestline(p: FreedomEngineProgress, quest: Quest): Questline | undefined {
  return p.questlines.find((questline) => questline.quests?.some((q) => q.id === quest.id));
}

export function getCurrentBuild(quest: Quest): Build | undefined {
  return quest.builds?.find((b) => b.status === "active");
}
