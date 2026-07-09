-- Seed: migrate the existing static Quest System data into the database.
-- Run this once, after quest-board.sql, in the Supabase SQL Editor.
-- Assumes a single Founder account (Alpha) -- seeds all rows to the first user.

do $$
declare
  v_user_id uuid := (select id from auth.users order by created_at asc limit 1);
  v_ql_ai_mastery_hq uuid := '5c990088-ac74-4abc-a7db-94138100cc75';
  v_ql_freedom_engine_core uuid := '3e3d3491-1eb4-4382-b116-36c1e9f81eb2';
  v_q_quest_0 uuid := '3aa03876-af48-49e7-9c2c-edb64f5a95b3';
  v_q_quest_1 uuid := '719555d7-9ba8-4593-9d9b-eae510265fd6';
  v_q_quest_2 uuid := 'e7bfffd6-e515-4b57-a479-00d0dae4dc7c';
begin
  if v_user_id is null then
    raise exception 'No Founder account found -- sign in once before running this seed.';
  end if;

  -- Main Quest
  insert into public.founder_state (user_id, main_quest)
  values (v_user_id, 'Build the Freedom Engine.')
  on conflict (user_id) do update set main_quest = excluded.main_quest;

  -- Questline: AI Mastery HQ
  insert into public.questlines (id, user_id, title, description, status, sort_order)
  values (v_ql_ai_mastery_hq, v_user_id, 'AI Mastery HQ', 'The current Questline focused on building the first live and usable version of Freedom Engine.', 'active', 1);

  -- Quest: Quest 0 — Foundations
  insert into public.quests (id, user_id, questline_id, title, description, status, sort_order)
  values (v_q_quest_0, v_user_id, v_ql_ai_mastery_hq, 'Quest 0 — Foundations', 'Define the Founder Manifesto, Founder Constitution, core principles, and Freedom Engine language.', 'completed', 1);

  -- Quest: Quest 1 — AI Mastery HQ Alpha in Notion
  insert into public.quests (id, user_id, questline_id, title, description, status, sort_order)
  values (v_q_quest_1, v_user_id, v_ql_ai_mastery_hq, 'Quest 1 — AI Mastery HQ Alpha in Notion', 'Prototype the first HQ structure and discover the product direction before moving into code.', 'completed', 2);

  -- Quest: Quest 2 — Build Freedom Engine Alpha
  insert into public.quests (id, user_id, questline_id, title, description, status, sort_order)
  values (v_q_quest_2, v_user_id, v_ql_ai_mastery_hq, 'Quest 2 — Build Freedom Engine Alpha', 'Build the first live and usable version of the Freedom Engine world.', 'active', 3);

  insert into public.builds (user_id, quest_id, title, description, next_step, status, sort_order)
  values
    (v_user_id, v_q_quest_2, 'Build #004 — Create Freedom Engine', null, null, 'completed', 1),
    (v_user_id, v_q_quest_2, 'Build #005 — First Transformation', null, null, 'completed', 2),
    (v_user_id, v_q_quest_2, 'Build #006 — Make the World Navigable', null, null, 'completed', 3),
    (v_user_id, v_q_quest_2, 'Build #007 — Constitution Hall', null, null, 'completed', 4),
    (v_user_id, v_q_quest_2, 'Build #008 — Quest Board', null, null, 'completed', 5),
    (v_user_id, v_q_quest_2, 'Build #009 — Idea Vault', null, null, 'completed', 6),
    (v_user_id, v_q_quest_2, 'Build #010 — Bring Tend the Fire Home', null, null, 'completed', 7),
    (v_user_id, v_q_quest_2, 'Build #011 — Source of Truth Docs', null, null, 'completed', 8),
    (v_user_id, v_q_quest_2, 'Build #012 — Teach AI Project Rules', null, null, 'completed', 9),
    (v_user_id, v_q_quest_2, 'Build #013 — Functional Idea Vault', null, null, 'completed', 10),
    (v_user_id, v_q_quest_2, 'Build #014 — Quest System Layer', 'Create structured Quest data and update Quest Board so it reflects the real state of Freedom Engine Alpha.', null, 'completed', 11),
    (v_user_id, v_q_quest_2, 'Build #015 — Companion Hall', 'Create Companion Hall as the first visible entry point for Freedom Engine Companions.', null, 'completed', 12),
    (v_user_id, v_q_quest_2, 'Build #016 — Update Quest Board After Companion Hall', 'Update the Quest System Layer so HQ and Quest Board reflect the completed Companion Hall Build and the current state of Freedom Engine Alpha.', null, 'completed', 13),
    (v_user_id, v_q_quest_2, 'Build #017 — Steward Console', 'Create the first Steward Console inside Companion Hall as a non-functional Alpha entry point toward real Companion intelligence.', null, 'completed', 14),
    (v_user_id, v_q_quest_2, 'Build #018 — Steward Response Prototype', 'Create a local Alpha response pattern for The Steward before connecting real Companion intelligence.', null, 'completed', 15),
    (v_user_id, v_q_quest_2, 'Build #019 — Activate The Steward', 'Connect The Steward Console to real AI through a secure server-side API route.', null, 'completed', 16),
    (v_user_id, v_q_quest_2, 'Build #020 — Update Quest System After Steward Activation', 'Update the Quest System Layer so HQ and Quest Board reflect that The Steward is now active and Freedom Engine has its first real AI Companion.', null, 'completed', 17),
    (v_user_id, v_q_quest_2, 'Build #021 — Founder Login', 'Add Supabase Auth so Freedom Engine is protected by Founder Login and The Steward API only answers authenticated requests.', null, 'completed', 18),
    (v_user_id, v_q_quest_2, 'Build #022 — Lock Founder Access', 'Remove public sign-up from Founder Login so Freedom Engine Alpha remains private.', null, 'completed', 19),
    (v_user_id, v_q_quest_2, 'Build #023 — Database-backed Idea Vault', 'Move Idea Vault from localStorage Alpha storage to Supabase database-backed storage connected to Founder Login.', null, 'completed', 20),
    (v_user_id, v_q_quest_2, 'Build #024 — Update Quest System After Database Memory', 'Update the Quest System Layer so HQ and Quest Board reflect that Idea Vault now has database-backed memory.', null, 'completed', 21),
    (v_user_id, v_q_quest_2, 'Build #025 — Founder Status Bar', 'Add the first Alpha version of Founder progression, XP and Level as a top status bar and future profile entry point.', null, 'completed', 22),
    (v_user_id, v_q_quest_2, 'Build #026 — Update Quest System After Founder Status', 'Update the Quest System Layer so HQ and Quest Board reflect that Founder Status, XP and Level now exist in Freedom Engine Alpha.', null, 'completed', 23),
    (v_user_id, v_q_quest_2, 'Build #028 — Animated Atmosphere Pass', 'Add subtle animated fog and atmospheric movement to AI Mastery HQ to make Freedom Engine feel more alive.', null, 'completed', 24),
    (v_user_id, v_q_quest_2, 'Build #029 — Deep Space HUD Re-theme', 'Pivot the visual identity from dark fantasy to a dark sci-fi HUD (Deep Space palette): new color tokens, Geist Mono display type, recolored atmosphere and components.', null, 'completed', 25),
    (v_user_id, v_q_quest_2, 'Build #030 — Sharpen Layout and Form', 'Move the shape language to match the HUD direction: smaller panel/button radii, hairline borders on every primary panel, squared icon frames with corner brackets.', null, 'completed', 26),
    (v_user_id, v_q_quest_2, 'Build #031 — Database-backed Quest Board', 'Move Quest Board from the static Alpha data file to Supabase database-backed storage, so Quests and Builds can change without editing code.', 'Review Quest Board and HQ with real data, then choose the next real Build.', 'active', 27);

  -- Questline: Freedom Engine Core
  insert into public.questlines (id, user_id, title, description, status, sort_order)
  values (v_ql_freedom_engine_core, v_user_id, 'Freedom Engine Core', 'The deeper operating system layer that will grow after AI Mastery HQ becomes useful.', 'available', 2);

  -- Side Quests
  insert into public.side_quests (user_id, title, description, status, sort_order)
  values
    (v_user_id, 'Side Quest #001 — GitHub Repository', 'Back up Freedom Engine safely in GitHub.', 'completed', 1),
    (v_user_id, 'Side Quest #002 — Deploy Alpha', 'Deploy Freedom Engine Alpha to the web so it can be opened from mobile.', 'completed', 2),
    (v_user_id, 'Environment Art Pass', 'Add real background art and world atmosphere to each location.', 'available', 3),
    (v_user_id, 'Idea Vault UX Build', 'Improve the layout and interaction design of the functional Idea Vault.', 'available', 4),
    (v_user_id, 'Mobile Polish Build', 'Refine the mobile experience if needed later.', 'available', 5),
    (v_user_id, 'Database-backed Idea Vault', 'Replace Alpha localStorage with database-backed storage and cross-device sync.', 'available', 6),
    (v_user_id, 'Authentication and User Accounts', 'Add private user access when Freedom Engine needs real synced personal data.', 'available', 7);

end $$;
