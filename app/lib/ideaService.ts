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

export interface Idea {
  id: string;
  text: string;
  status: IdeaStatus;
  createdAt: string;
}

interface DbRow {
  id: string;
  user_id: string;
  text: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/* ── MAPPING ──────────────────────────────────────────────────────────────── */

function rowToIdea(row: DbRow): Idea {
  return {
    id: row.id,
    text: row.text,
    status: row.status as IdeaStatus,
    createdAt: row.created_at,
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

/** Insert a new idea as Raw. Returns the created idea (with server-generated id). */
export async function createIdea(text: string): Promise<Idea> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated.");

  const { data, error } = await supabase
    .from("ideas")
    .insert({ text: text.trim(), status: "raw", user_id: user.id })
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
  const supabase = createClient();
  const { error } = await supabase
    .from("ideas")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Permanently remove an idea from the Vault. */
export async function deleteIdea(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("ideas").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
