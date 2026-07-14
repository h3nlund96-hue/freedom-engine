-- ── Build Log — #031 through #037 ───────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- Backfills the Build history for everything shipped this session, nested
-- under "Build Freedom Engine Alpha" (same Quest as #004–#030), continuing
-- on from whatever sort_order already exists there.

with target_quest as (
  select id as quest_id, user_id
  from public.quests
  where title = 'Build Freedom Engine Alpha'
  limit 1
),
next_sort as (
  select coalesce(max(b.sort_order), 0) as base
  from public.builds b
  join target_quest tq on b.quest_id = tq.quest_id
),
new_builds (title, description, offset_n) as (
  values
    ('Build #031 — Idea Vault: Title, Description & Status',
     'Capture form now takes a title and description, with a status picker (Raw Ideas / Future Quests / Side Quest Candidates / Experiments) defaulting to Raw.',
     1),
    ('Build #032 — Idea Vault: Detail Modal & Convert to Quest',
     'Ideas open in a detail modal to edit title, description and status, convert into a Quest or Side Quest, and require confirmation before deleting.',
     2),
    ('Build #033 — Quest Board: Full CRUD & Active Focus Panel',
     'Quest Board rebuilt around an editable Active Focus panel plus Quests / Side Quests / Completed tabs, with full create, edit, activate and complete support on every level.',
     3),
    ('Build #034 — Visual Consistency for Side Quests & Completed',
     'Side Quest cards now match the Quest cards'' opaque card style, fixing a "glassy" look where cards blended into the background.',
     4),
    ('Build #035 — Active Path Exclusivity Fix',
     'Activating a Quest now always shows on the Active Path regardless of its Questline; Side Quests and Quests are mutually exclusive on the Active Path.',
     5),
    ('Build #036 — Quest Board Retab: Active Path, Quest Lines, Quests, Side Quests',
     'Quest Board unified into one tabbed block with Active Path as the default tab, Quest Lines and Quests split into their own flat tabs, and Active/Completed sub-tabs everywhere.',
     6),
    ('Build #037 — Remove Questline Active Status & Quest Reassignment',
     'Questlines no longer track their own active state, derived from the active Quest instead. Quests can now be reassigned to a different Questline via a picker when editing.',
     7)
)
insert into public.builds (user_id, quest_id, title, description, status, sort_order)
select tq.user_id, tq.quest_id, nb.title, nb.description, 'completed', ns.base + nb.offset_n
from new_builds nb
cross join target_quest tq
cross join next_sort ns;
