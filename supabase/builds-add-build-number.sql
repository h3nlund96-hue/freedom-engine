-- ── Builds: automatic Build numbers ──────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- Adds a build_number column and backfills every existing Build in creation
-- order (per Founder), so the running Build log has a number from day one
-- instead of only new Builds going forward.

alter table public.builds
  add column if not exists build_number int;

with numbered as (
  select
    id,
    row_number() over (partition by user_id order by created_at) as rn
  from public.builds
)
update public.builds
set build_number = numbered.rn
from numbered
where public.builds.id = numbered.id
  and public.builds.build_number is null;

alter table public.builds
  alter column build_number set not null;
