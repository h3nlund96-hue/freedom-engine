// Quest System types. Data lives in Supabase — see app/lib/questService.ts.

export type QuestStatus = "available" | "active" | "completed";

export interface Build {
  id: string;
  title: string;
  status: QuestStatus;
  description?: string;
  nextStep?: string;
}

export interface Quest {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  builds?: Build[];
}

export interface Questline {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  quests?: Quest[];
}

export interface SideQuest {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
}

export interface FreedomEngineProgress {
  mainQuest: string;
  questlines: Questline[];
  sideQuests: SideQuest[];
}

/* ── DERIVED HELPERS ──────────────────────────────────────────────────────── */

export function getActiveQuestline(p: FreedomEngineProgress): Questline | undefined {
  return p.questlines.find((q) => q.status === "active");
}

export function getActiveQuest(questline: Questline): Quest | undefined {
  return questline.quests?.find((q) => q.status === "active");
}

export function getCurrentBuild(quest: Quest): Build | undefined {
  return quest.builds?.find((b) => b.status === "active");
}
