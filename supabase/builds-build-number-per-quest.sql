-- ── Builds: build numbers count up per Quest ─────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- build_number used to be one running count per Founder, so a Quest's
-- Builds could read #14, #15, #22... instead of starting from #1. Renumbers
-- every existing Build in creation order within its own Quest. The app's
-- nextBuildNumber() (app/lib/questMutationService.ts) already scopes new
-- Builds to their Quest — this just backfills history to match.

with numbered as (
  select
    id,
    row_number() over (partition by quest_id order by created_at) as rn
  from public.builds
)
update public.builds
set build_number = numbered.rn
from numbered
where public.builds.id = numbered.id
  and public.builds.build_number is distinct from numbered.rn;
