/**
 * Idea Vault service layer.
 *
 * All Supabase calls for ideas go through here.
 * UI components import from this module — not from Supabase directly.
 *
 * Keeps Idea Vault decoupled from the underlying storage, making it easy to:
 * - add quick-capture from HQ or Companion Hall
 * - extend the Idea schema (tags, notes, linked Quest)
 * - swap storage later if needed
 */

import { createClient } from "../../lib/supabase/client";

/* ── TYPES ────────────────────────────────────────────────────────────────── */

export type IdeaStatus =
  | "raw"
  | "future-quest"
  | "side-quest-candidate"
  | "experiment";

export type ConvertedToType = "quest" | "side_quest";

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  createdAt: string;
  convertedAt: string | null;
  convertedToType: ConvertedToType | null;
  convertedToId: string | null;
}

interface DbRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  converted_at: string | null;
  converted_to_type: string | null;
  converted_to_id: string | null;
}

/** Default target type for converting an idea, based on its status. */
export function defaultConvertTarget(status: IdeaStatus): ConvertedToType {
  return status === "future-quest" ? "quest" : "side_quest";
}

/* ── MAPPING ──────────────────────────────────────────────────────────────── */

function rowToIdea(row: DbRow): Idea {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: row.status as IdeaStatus,
    createdAt: row.created_at,
    convertedAt: row.converted_at,
    convertedToType: row.converted_to_type as ConvertedToType | null,
    convertedToId: row.converted_to_id,
  };
}

/* ── SERVICE FUNCTIONS ────────────────────────────────────────────────────── */

/** Fetch all ideas for the authenticated Founder, newest first. */
export async function getIdeas(): Promise<Idea[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbRow[]).map(rowToIdea);
}

/** Insert a new idea. Status defaults to Raw unless overridden. */
export async function createIdea(
  title: string,
  description: string,
  status: IdeaStatus = "raw"
): Promise<Idea> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated.");

  const { data, error } = await supabase
    .from("ideas")
    .insert({
      title: title.trim(),
      description: description.trim() || null,
      status,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToIdea(data as DbRow);
}

/** Update an idea's title, description and/or status. */
export async function updateIdea(
  id: string,
  fields: { title?: string; description?: string; status?: IdeaStatus }
): Promise<Idea> {
  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (fields.title !== undefined) patch.title = fields.title.trim();
  if (fields.description !== undefined) patch.description = fields.description.trim() || null;
  if (fields.status !== undefined) patch.status = fields.status;

  const { data, error } = await supabase
    .from("ideas")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToIdea(data as DbRow);
}

/** Move an idea to a different vault compartment. */
export async function updateIdeaStatus(
  id: string,
  status: IdeaStatus
): Promise<void> {
  await updateIdea(id, { status });
}

/** Permanently remove an idea from the Vault. */
export async function deleteIdea(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("ideas").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

/** Convert an idea into a new Quest inside the given Questline. */
export async function convertIdeaToQuest(
  idea: Idea,
  questlineId: string,
  title: string,
  description: string
): Promise<{ id: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { count } = await supabase
    .from("quests")
    .select("id", { count: "exact", head: true })
    .eq("questline_id", questlineId);

  const { data: quest, error: questError } = await supabase
    .from("quests")
    .insert({
      user_id: user.id,
      questline_id: questlineId,
      title: title.trim(),
      description: description.trim() || null,
      status: "available",
      sort_order: (count ?? 0) + 1,
    })
    .select()
    .single();

  if (questError) throw new Error(questError.message);

  const { error: ideaError } = await supabase
    .from("ideas")
    .update({
      converted_at: new Date().toISOString(),
      converted_to_type: "quest",
      converted_to_id: quest.id,
    })
    .eq("id", idea.id);

  if (ideaError) throw new Error(ideaError.message);

  return { id: quest.id };
}

/** Convert an idea into a new standalone Side Quest. */
export async function convertIdeaToSideQuest(
  idea: Idea,
  title: string,
  description: string
): Promise<{ id: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { count } = await supabase
    .from("side_quests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: sideQuest, error: sideQuestError } = await supabase
    .from("side_quests")
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      status: "available",
      sort_order: (count ?? 0) + 1,
    })
    .select()
    .single();

  if (sideQuestError) throw new Error(sideQuestError.message);

  const { error: ideaError } = await supabase
    .from("ideas")
    .update({
      converted_at: new Date().toISOString(),
      converted_to_type: "side_quest",
      converted_to_id: sideQuest.id,
    })
    .eq("id", idea.id);

  if (ideaError) throw new Error(ideaError.message);

  return { id: sideQuest.id };
}
