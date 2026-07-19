-- ── The Observatory: completed_at tracking ───────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- Adds a completed_at column to Questlines, Quests, Builds and Side Quests,
-- backfilled from updated_at for anything already completed (the closest
-- honest approximation available, since completion timing was never tracked
-- before now). Going forward, questMutationService.ts sets this exactly when
-- status transitions to "completed" and clears it if reopened — The
-- Observatory (momentum/XP-over-time, Questline staleness) reads from this
-- instead of updated_at, which shifts on any edit, not just completion.

alter table public.questlines
  add column if not exists completed_at timestamptz;

alter table public.quests
  add column if not exists completed_at timestamptz;

alter table public.builds
  add column if not exists completed_at timestamptz;

alter table public.side_quests
  add column if not exists completed_at timestamptz;

update public.questlines
  set completed_at = updated_at
  where status = 'completed' and completed_at is null;

update public.quests
  set completed_at = updated_at
  where status = 'completed' and completed_at is null;

update public.builds
  set completed_at = updated_at
  where status = 'completed' and completed_at is null;

update public.side_quests
  set completed_at = updated_at
  where status = 'completed' and completed_at is null;
