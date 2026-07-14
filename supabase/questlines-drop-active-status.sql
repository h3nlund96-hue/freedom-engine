-- ── Questlines — Drop "Active" Status ───────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- Questlines no longer carry their own "active" status — a Questline is
-- only ever on the Active Path because it's the parent of the active Quest.
-- Any Quest can now belong to any Questline (reassignable when editing),
-- so a separate "active Questline" concept no longer makes sense.

update public.questlines set status = 'available' where status = 'active';

alter table public.questlines drop constraint if exists questlines_status_check;
alter table public.questlines add constraint questlines_status_check check (
  status in ('available', 'completed')
);
