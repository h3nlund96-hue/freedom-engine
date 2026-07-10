/**
 * Quest System service layer.
 *
 * All Supabase calls for Questlines, Quests, Builds and Side Quests go
 * through here. Server Components and the Steward API import from this
 * module — not from Supabase directly.
 */

import { createClient } from "../../lib/supabase/server";
import type { FreedomEngineProgress } from "../data/freedomEngineProgress";
import {
  mapProgressRows,
  type FounderStateRow,
  type QuestlineRow,
  type QuestRow,
  type BuildRow,
  type SideQuestRow,
} from "./questRows";

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

  return mapProgressRows(
    founderState as FounderStateRow | null,
    (questlineRows ?? []) as QuestlineRow[],
    (questRows ?? []) as QuestRow[],
    (buildRows ?? []) as BuildRow[],
    (sideQuestRows ?? []) as SideQuestRow[]
  );
}
