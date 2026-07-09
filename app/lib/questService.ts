/**
 * Quest System service layer.
 *
 * All Supabase calls for Questlines, Quests, Builds and Side Quests go
 * through here. Server Components and the Steward API import from this
 * module — not from Supabase directly.
 */

import { createClient } from "../../lib/supabase/server";
import type {
  FreedomEngineProgress,
  QuestStatus,
} from "../data/freedomEngineProgress";

/* ── DB ROW TYPES ─────────────────────────────────────────────────────────── */

interface FounderStateRow {
  main_quest: string;
}

interface QuestlineRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
}

interface QuestRow {
  id: string;
  questline_id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
}

interface BuildRow {
  id: string;
  quest_id: string;
  title: string;
  description: string | null;
  next_step: string | null;
  status: string;
  sort_order: number;
}

interface SideQuestRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
}

/* ── SERVICE FUNCTIONS ────────────────────────────────────────────────────── */

/** Fetch the full Quest System for the authenticated Founder. */
export async function getProgress(): Promise<FreedomEngineProgress> {
  const supabase = await createClient();

  const [
    { data: founderState },
    { data: questlineRows },
    { data: questRows },
    { data: buildRows },
    { data: sideQuestRows },
  ] = await Promise.all([
    supabase.from("founder_state").select("main_quest").maybeSingle(),
    supabase.from("questlines").select("*").order("sort_order"),
    supabase.from("quests").select("*").order("sort_order"),
    supabase.from("builds").select("*").order("sort_order"),
    supabase.from("side_quests").select("*").order("sort_order"),
  ]);

  const builds = (buildRows ?? []) as BuildRow[];
  const quests = (questRows ?? []) as QuestRow[];
  const questlines = (questlineRows ?? []) as QuestlineRow[];
  const sideQuests = (sideQuestRows ?? []) as SideQuestRow[];

  return {
    mainQuest: (founderState as FounderStateRow | null)?.main_quest ?? "Build the Freedom Engine.",
    questlines: questlines.map((ql) => ({
      id: ql.id,
      title: ql.title,
      status: ql.status as QuestStatus,
      description: ql.description ?? "",
      quests: quests
        .filter((q) => q.questline_id === ql.id)
        .map((q) => ({
          id: q.id,
          title: q.title,
          status: q.status as QuestStatus,
          description: q.description ?? "",
          builds: builds
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
    sideQuests: sideQuests.map((sq) => ({
      id: sq.id,
      title: sq.title,
      status: sq.status as QuestStatus,
      description: sq.description ?? "",
    })),
  };
}
