-- ── Builds: drop next_step ────────────────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- "Next step" is no longer part of a Build anywhere in the app (HQ, Quest
-- Board, or Ember's create/edit Build flows) — a Build is just a title and
-- a description now. Drops the now-unused column.

alter table public.builds
  drop column if exists next_step;
