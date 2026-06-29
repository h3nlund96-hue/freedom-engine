-- ── Idea Vault — Freedom Engine ─────────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project.
-- After running, Idea Vault will persist ideas per authenticated Founder.

-- ── TABLE ────────────────────────────────────────────────────────────────────

create table if not exists public.ideas (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  text        text        not null,
  status      text        not null default 'raw',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint ideas_status_check check (
    status in ('raw', 'future-quest', 'side-quest-candidate', 'experiment')
  )
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────

alter table public.ideas enable row level security;

-- SELECT: Founder can only read their own ideas.
create policy "Founder can select own ideas"
  on public.ideas
  for select
  using (auth.uid() = user_id);

-- INSERT: Founder can only insert ideas owned by themselves.
create policy "Founder can insert own ideas"
  on public.ideas
  for insert
  with check (auth.uid() = user_id);

-- UPDATE: Founder can only update their own ideas.
create policy "Founder can update own ideas"
  on public.ideas
  for update
  using (auth.uid() = user_id);

-- DELETE: Founder can only delete their own ideas.
create policy "Founder can delete own ideas"
  on public.ideas
  for delete
  using (auth.uid() = user_id);

-- ── OPTIONAL INDEX ────────────────────────────────────────────────────────────

-- Speeds up queries that filter by user + sort by created_at.
create index if not exists ideas_user_created_idx
  on public.ideas (user_id, created_at desc);
