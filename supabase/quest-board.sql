-- ── Quest Board — Freedom Engine ────────────────────────────────────────────
-- Run this in the Supabase SQL Editor for your project, before quest-board-seed.sql.
-- After running, Quest Board will read Questlines, Quests, Builds and Side
-- Quests from the database instead of the static Alpha data file.

-- ── FOUNDER STATE (Main Quest) ───────────────────────────────────────────────

create table if not exists public.founder_state (
  user_id     uuid        primary key references auth.users(id) on delete cascade,
  main_quest  text        not null default 'Build the Freedom Engine.',
  updated_at  timestamptz not null default now()
);

alter table public.founder_state enable row level security;

create policy "Founder can select own state"
  on public.founder_state for select using (auth.uid() = user_id);

create policy "Founder can insert own state"
  on public.founder_state for insert with check (auth.uid() = user_id);

create policy "Founder can update own state"
  on public.founder_state for update using (auth.uid() = user_id);

-- ── QUESTLINES ───────────────────────────────────────────────────────────────

create table if not exists public.questlines (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  description text,
  status      text        not null default 'available',
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint questlines_status_check check (status in ('available', 'active', 'completed'))
);

alter table public.questlines enable row level security;

create policy "Founder can select own questlines"
  on public.questlines for select using (auth.uid() = user_id);
create policy "Founder can insert own questlines"
  on public.questlines for insert with check (auth.uid() = user_id);
create policy "Founder can update own questlines"
  on public.questlines for update using (auth.uid() = user_id);
create policy "Founder can delete own questlines"
  on public.questlines for delete using (auth.uid() = user_id);

-- ── QUESTS ───────────────────────────────────────────────────────────────────

create table if not exists public.quests (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  questline_id  uuid        not null references public.questlines(id) on delete cascade,
  title         text        not null,
  description   text,
  status        text        not null default 'available',
  sort_order    int         not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint quests_status_check check (status in ('available', 'active', 'completed'))
);

alter table public.quests enable row level security;

create policy "Founder can select own quests"
  on public.quests for select using (auth.uid() = user_id);
create policy "Founder can insert own quests"
  on public.quests for insert with check (auth.uid() = user_id);
create policy "Founder can update own quests"
  on public.quests for update using (auth.uid() = user_id);
create policy "Founder can delete own quests"
  on public.quests for delete using (auth.uid() = user_id);

create index if not exists quests_questline_idx
  on public.quests (questline_id, sort_order);

-- ── BUILDS ───────────────────────────────────────────────────────────────────

create table if not exists public.builds (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  quest_id    uuid        not null references public.quests(id) on delete cascade,
  title       text        not null,
  description text,
  next_step   text,
  status      text        not null default 'available',
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint builds_status_check check (status in ('available', 'active', 'completed'))
);

alter table public.builds enable row level security;

create policy "Founder can select own builds"
  on public.builds for select using (auth.uid() = user_id);
create policy "Founder can insert own builds"
  on public.builds for insert with check (auth.uid() = user_id);
create policy "Founder can update own builds"
  on public.builds for update using (auth.uid() = user_id);
create policy "Founder can delete own builds"
  on public.builds for delete using (auth.uid() = user_id);

create index if not exists builds_quest_idx
  on public.builds (quest_id, sort_order);

-- ── SIDE QUESTS ──────────────────────────────────────────────────────────────

create table if not exists public.side_quests (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  description text,
  status      text        not null default 'available',
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint side_quests_status_check check (status in ('available', 'active', 'completed'))
);

alter table public.side_quests enable row level security;

create policy "Founder can select own side quests"
  on public.side_quests for select using (auth.uid() = user_id);
create policy "Founder can insert own side quests"
  on public.side_quests for insert with check (auth.uid() = user_id);
create policy "Founder can update own side quests"
  on public.side_quests for update using (auth.uid() = user_id);
create policy "Founder can delete own side quests"
  on public.side_quests for delete using (auth.uid() = user_id);

create index if not exists side_quests_user_idx
  on public.side_quests (user_id, sort_order);
