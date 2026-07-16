/**
 * Quest System mutation layer (browser client).
 *
 * app/lib/questService.ts handles the read side (server client, used for
 * the initial page load). This file handles every write — creating and
 * editing Questlines, Quests, Builds and Side Quests from the client —
 * so Quest Board can be a real interactive tool instead of a read-only
 * display of data seeded by hand.
 *
 * Questlines don't have their own "active" status — a Questline only ever
 * appears on the Active Path because it's the parent of the active Quest
 * (see getActiveQuestline / getActiveQuest in freedomEngineProgress.ts).
 * Only one Quest (globally, not just within a Questline) or Build (within
 * its Quest) can be "active" at a time — activating one demotes any
 * previously-active sibling back to "available". And only one Quest or
 * Side Quest can hold the Active Path at a time — activating either one
 * demotes whatever is active on the other side.
 */

import { createClient } from "../../lib/supabase/client";
import type { FreedomEngineProgress, QuestStatus } from "../data/freedomEngineProgress";
import {
  mapProgressRows,
  type FounderStateRow,
  type QuestlineRow,
  type QuestRow,
  type BuildRow,
  type SideQuestRow,
} from "./questRows";
import { emitEmberEvent } from "./emberEvents";

/* ── TYPES ────────────────────────────────────────────────────────────────── */

export interface QuestlineSummary {
  id: string;
  title: string;
  status: QuestStatus;
}

/** Refetch the full Quest System from the client — used after any mutation
 * below so the UI reflects the real, authoritative state. */
export async function getProgressClient(): Promise<FreedomEngineProgress> {
  const supabase = createClient();

  const [
    { data: founderState, error: founderStateError },
    { data: questlineRows, error: questlineRowsError },
    { data: questRows, error: questRowsError },
    { data: buildRows, error: buildRowsError },
    { data: sideQuestRows, error: sideQuestRowsError },
  ] = await Promise.all([
    supabase.from("founder_state").select("main_quest").maybeSingle(),
    supabase.from("questlines").select("*").order("sort_order"),
    supabase.from("quests").select("*").order("sort_order"),
    supabase.from("builds").select("*").order("sort_order"),
    supabase.from("side_quests").select("*").order("sort_order"),
  ]);

  const firstError =
    founderStateError ?? questlineRowsError ?? questRowsError ?? buildRowsError ?? sideQuestRowsError;
  if (firstError) throw new Error(firstError.message);

  return mapProgressRows(
    founderState as FounderStateRow | null,
    (questlineRows ?? []) as QuestlineRow[],
    (questRows ?? []) as QuestRow[],
    (buildRows ?? []) as BuildRow[],
    (sideQuestRows ?? []) as SideQuestRow[]
  );
}

interface EditableFields {
  title?: string;
  description?: string;
  status?: QuestStatus;
}

/* ── HELPERS ──────────────────────────────────────────────────────────────── */

async function currentUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");
  return user.id;
}

function toPatch(fields: EditableFields): Record<string, unknown> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (fields.title !== undefined) patch.title = fields.title.trim();
  if (fields.description !== undefined) patch.description = fields.description.trim() || null;
  if (fields.status !== undefined) patch.status = fields.status;
  return patch;
}

/** Demote every currently-active row in a table back to Available. Used to
 * enforce that only one Quest or Side Quest can hold the Active Path at a
 * time — activating one clears any active row on the other side. */
async function demoteAllActive(table: "quests" | "side_quests"): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(table).update({ status: "available" }).eq("status", "active");
  if (error) throw new Error(error.message);
}

async function nextSortOrder(
  table: "questlines" | "quests" | "builds" | "side_quests",
  scopeColumn: "questline_id" | "quest_id" | null,
  scopeId: string | null
): Promise<number> {
  const supabase = createClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (scopeColumn && scopeId) query = query.eq(scopeColumn, scopeId);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return (count ?? 0) + 1;
}

/** The running Build log number — counts up from one per Quest. Uses the
 * highest existing number within the Quest rather than a row count so it
 * keeps climbing even after a Build in that Quest has been deleted. */
async function nextBuildNumber(questId: string): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("builds")
    .select("build_number")
    .eq("quest_id", questId)
    .order("build_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.build_number ?? 0) + 1;
}

/** Enforces "the next Build on the list is always the active one" — if a
 * Quest has no active Build, whichever remaining open Build is first in
 * line (by sort order) gets promoted automatically. Called after creating,
 * completing or deleting a Build. */
async function promoteNextBuild(questId: string): Promise<void> {
  const supabase = createClient();
  const { data: existingActive, error: existingActiveError } = await supabase
    .from("builds")
    .select("id")
    .eq("quest_id", questId)
    .eq("status", "active")
    .maybeSingle();
  if (existingActiveError) throw new Error(existingActiveError.message);
  if (existingActive) return;

  const { data: next, error: nextError } = await supabase
    .from("builds")
    .select("id")
    .eq("quest_id", questId)
    .eq("status", "available")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (nextError) throw new Error(nextError.message);
  if (!next) return;

  const { error } = await supabase.from("builds").update({ status: "active" }).eq("id", next.id);
  if (error) throw new Error(error.message);
}

/* ── QUESTLINES ───────────────────────────────────────────────────────────── */

/** Lightweight list for pickers (e.g. choosing where a converted idea's Quest lives). */
export async function getQuestlineOptions(): Promise<QuestlineSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("questlines")
    .select("id, title, status")
    .order("sort_order");

  if (error) throw new Error(error.message);
  return (data ?? []) as QuestlineSummary[];
}

export async function createQuestline(title: string, description: string): Promise<{ id: string }> {
  const supabase = createClient();
  const [userId, sortOrder] = await Promise.all([
    currentUserId(),
    nextSortOrder("questlines", null, null),
  ]);

  const { data, error } = await supabase
    .from("questlines")
    .insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      status: "available",
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateQuestline(id: string, fields: EditableFields): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("questlines").update(toPatch(fields)).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Permanently remove a Questline — its Quests (and their Builds) cascade-delete
 * with it (see the questline_id foreign key in quest-board.sql). */
export async function deleteQuestline(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("questlines").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── QUESTS ───────────────────────────────────────────────────────────────── */

export async function createQuest(
  questlineId: string,
  title: string,
  description: string
): Promise<{ id: string }> {
  const supabase = createClient();
  const [userId, sortOrder] = await Promise.all([
    currentUserId(),
    nextSortOrder("quests", "questline_id", questlineId),
  ]);

  const { data, error } = await supabase
    .from("quests")
    .insert({
      user_id: userId,
      questline_id: questlineId,
      title: title.trim(),
      description: description.trim() || null,
      status: "available",
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateQuest(
  id: string,
  questlineId: string,
  fields: EditableFields & { newQuestlineId?: string }
): Promise<void> {
  const supabase = createClient();

  if (fields.status === "active") {
    // Only one Quest can be active at a time, across all Questlines — this
    // is what puts a Questline on the Active Path (see getActiveQuestline).
    const { error: demoteError } = await supabase
      .from("quests")
      .update({ status: "available" })
      .eq("status", "active")
      .neq("id", id);
    if (demoteError) throw new Error(demoteError.message);

    await demoteAllActive("side_quests");
  }

  const patch = toPatch(fields);
  if (fields.newQuestlineId !== undefined) patch.questline_id = fields.newQuestlineId;

  const { data, error } = await supabase.from("quests").update(patch).eq("id", id).select("title").single();
  if (error) throw new Error(error.message);

  if (fields.status === "completed" && data) {
    emitEmberEvent({ kind: "quest_completed", title: data.title });
  }
}

/** Permanently remove a Quest — its Builds cascade-delete with it (see the
 * quest_id foreign key in quest-board.sql). */
export async function deleteQuest(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("quests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── BUILDS ───────────────────────────────────────────────────────────────── */

export async function createBuild(
  questId: string,
  title: string,
  description: string
): Promise<{ id: string }> {
  const supabase = createClient();
  const [userId, sortOrder, buildNumber] = await Promise.all([
    currentUserId(),
    nextSortOrder("builds", "quest_id", questId),
    nextBuildNumber(questId),
  ]);

  const { data, error } = await supabase
    .from("builds")
    .insert({
      user_id: userId,
      quest_id: questId,
      title: title.trim(),
      description: description.trim() || null,
      status: "available",
      sort_order: sortOrder,
      build_number: buildNumber,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // "Next Build on the list" invariant — a Quest with no active Build yet
  // means this new one, being next in line, becomes it.
  await promoteNextBuild(questId);

  return data;
}

export async function updateBuild(id: string, questId: string, fields: EditableFields): Promise<void> {
  const supabase = createClient();

  if (fields.status === "active") {
    const { error: demoteError } = await supabase
      .from("builds")
      .update({ status: "available" })
      .eq("quest_id", questId)
      .eq("status", "active")
      .neq("id", id);
    if (demoteError) throw new Error(demoteError.message);
  }

  const patch = toPatch(fields);

  const { data, error } = await supabase.from("builds").update(patch).eq("id", id).select("title").single();
  if (error) throw new Error(error.message);

  if (fields.status === "completed") {
    if (data) emitEmberEvent({ kind: "build_completed", title: data.title });
    await promoteNextBuild(questId);
  }
}

/** Permanently remove a Build. */
export async function deleteBuild(id: string, questId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("builds").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await promoteNextBuild(questId);
}

/* ── SIDE QUESTS ──────────────────────────────────────────────────────────── */

export async function createSideQuest(title: string, description: string): Promise<{ id: string }> {
  const supabase = createClient();
  const [userId, sortOrder] = await Promise.all([
    currentUserId(),
    nextSortOrder("side_quests", null, null),
  ]);

  const { data, error } = await supabase
    .from("side_quests")
    .insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      status: "available",
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSideQuest(id: string, fields: EditableFields): Promise<void> {
  const supabase = createClient();

  if (fields.status === "active") {
    const { error: demoteError } = await supabase
      .from("side_quests")
      .update({ status: "available" })
      .eq("status", "active")
      .neq("id", id);
    if (demoteError) throw new Error(demoteError.message);

    // Only one Quest or Side Quest can hold the Active Path at a time.
    await demoteAllActive("quests");
  }

  const { error } = await supabase.from("side_quests").update(toPatch(fields)).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Permanently remove a Side Quest. */
export async function deleteSideQuest(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("side_quests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
