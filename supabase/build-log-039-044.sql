-- ── Build Log — #039 through #044 ───────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- Backfills the Build history for everything shipped since #038, nested
-- under "Quest 2 — Build Freedom Engine Alpha", continuing on from
-- whatever sort_order already exists there.

with target_quest as (
  select id as quest_id, user_id
  from public.quests
  where id = 'e7bfffd6-e515-4b57-a479-00d0dae4dc7c' -- "Quest 2 — Build Freedom Engine Alpha"
),
next_sort as (
  select coalesce(max(b.sort_order), 0) as base
  from public.builds b
  join target_quest tq on b.quest_id = tq.quest_id
)
insert into public.builds (user_id, quest_id, title, description, status, sort_order)
select tq.user_id, tq.quest_id, v.title, v.description, 'completed', ns.base + v.offset_n
from (
  select
    'Build #039 — Collapse Completed Builds by Default' as title,
    'A Quest card now hides completed Builds behind a "N completed" toggle by default, so a long-running Quest with dozens of finished Builds no longer floods the Active Path snapshot.' as description,
    1 as offset_n
  union all
  select
    'Build #040 — Rename The Steward to Ember',
    'Companion Hall now shows a single Companion, Ember, instead of four (three permanently dormant), with more personality in her voice and the API route moved to /api/ember.',
    2
  union all
  select
    'Build #041 — One Flowing Answer from Ember',
    'Ember''s response collapsed from three labeled sections into a single flowing answer that reads like an ally''s reply instead of a framework output.',
    3
  union all
  select
    'Build #042 — Ember Session Memory, Floating Widget and Proposals',
    'Ember''s conversation now persists across HQ, Quest Board, Idea Vault and Companion Hall, a floating Ask Ember widget appears on three pages, and Ember can propose creating a Quest or Idea for The Founder to approve.',
    4
  union all
  select
    'Build #043 — Ember''s Animated Glyph',
    'Ember gets her own living-core glyph with a breathing amber-to-cyan glow, reused everywhere she appears instead of a generic status dot.',
    5
  union all
  select
    'Build #044 — Remove Pre-Alpha Footers and Notices',
    'Removed the Alpha disclaimer blocks from Profile, Companion Hall and the login footer, and deleted the orphaned tend-the-fire route ahead of closing the Alpha Quest.',
    6
) v
cross join target_quest tq
cross join next_sort ns;
