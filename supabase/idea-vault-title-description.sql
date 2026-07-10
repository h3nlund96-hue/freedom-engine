-- ── Idea Vault — Title + Description + Conversion Tracking ────────────────────
-- Run this in the Supabase SQL Editor for your project, after idea-vault.sql.
-- Splits the single `text` field into a required `title` and an optional
-- `description`, and adds columns to track when an idea has been converted
-- into a real Quest or Side Quest.

-- ── TITLE / DESCRIPTION ──────────────────────────────────────────────────────

alter table public.ideas add column if not exists title text;
alter table public.ideas add column if not exists description text;

-- Backfill: existing captures become the title, description stays empty.
update public.ideas set title = text where title is null;

alter table public.ideas alter column title set not null;
alter table public.ideas drop column if exists text;

-- ── CONVERSION TRACKING ──────────────────────────────────────────────────────

alter table public.ideas add column if not exists converted_at timestamptz;
alter table public.ideas add column if not exists converted_to_type text;
alter table public.ideas add column if not exists converted_to_id uuid;

alter table public.ideas drop constraint if exists ideas_converted_to_type_check;
alter table public.ideas add constraint ideas_converted_to_type_check check (
  converted_to_type is null or converted_to_type in ('quest', 'side_quest')
);
