/**
 * Shared row types and mapping logic for the Quest System.
 *
 * Used by both questService.ts (server client, initial page load) and
 * questMutationService.ts (browser client, refetch after a mutation) so
 * the raw-row → FreedomEngineProgress shaping only lives in one place.
 */

import type { FreedomEngineProgress, QuestStatus } from "../data/freedomEngineProgress";

export interface FounderStateRow {
  main_quest: string;
}

export interface QuestlineRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
}

export interface QuestRow {
  id: string;
  questline_id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
}

export interface BuildRow {
  id: string;
  quest_id: string;
  title: string;
  description: string | null;
  next_step: string | null;
  status: string;
  sort_order: number;
}

export interface SideQuestRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
}

export function mapProgressRows(
  founderState: FounderStateRow | null,
  questlineRows: QuestlineRow[],
  questRows: QuestRow[],
  buildRows: BuildRow[],
  sideQuestRows: SideQuestRow[]
): FreedomEngineProgress {
  return {
    mainQuest: founderState?.main_quest ?? "Build the Freedom Engine.",
    questlines: questlineRows.map((ql) => ({
      id: ql.id,
      title: ql.title,
      status: ql.status as QuestStatus,
      description: ql.description ?? "",
      quests: questRows
        .filter((q) => q.questline_id === ql.id)
        .map((q) => ({
          id: q.id,
          title: q.title,
          status: q.status as QuestStatus,
          description: q.description ?? "",
          builds: buildRows
            .filter((b) => b.quest_id === q.id)
            .map((b) => ({
              id: b.id,
              title: b.title,
              status: b.status as QuestStatus,
              description: b.description ?? undefined,
              nextStep: b.next_step ?? undefined,
            })),
        })),
    })),
    sideQuests: sideQuestRows.map((sq) => ({
      id: sq.id,
      title: sq.title,
      status: sq.status as QuestStatus,
      description: sq.description ?? "",
    })),
  };
}
