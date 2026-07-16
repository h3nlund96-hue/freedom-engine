/**
 * Live Freedom Engine world state for Ember — shared between the text chat
 * route and the realtime voice route so both ground her in the same Quest
 * System data instead of duplicating the fetch/shape logic.
 */

import { createClient as createSupabaseClient } from "../../lib/supabase/server";
import { getActiveQuestline, getActiveQuest, getCurrentBuild } from "../data/freedomEngineProgress";
import { getProgress } from "./questService";

export interface EmberContext {
  mainQuest: string;
  activeQuestline: string;
  activeQuestlineDescription: string;
  activeQuest: string;
  activeQuestId: string | null;
  activeQuestDescription: string;
  currentBuild: string;
  currentBuildDescription: string;
  nextStep: string;
  questlines: { id: string; title: string }[];
  recentIdeas: { title: string; status: string }[];
  availableQuests: { id: string; title: string; questlineId: string }[];
  openBuilds: { id: string; title: string; questId: string; questTitle: string }[];
}

export async function getEmberContext(): Promise<EmberContext> {
  const supabase = await createSupabaseClient();
  const progress = await getProgress();
  const activeQuest = getActiveQuest(progress);
  const activeQuestline = activeQuest ? getActiveQuestline(progress, activeQuest) : undefined;
  const currentBuild = activeQuest ? getCurrentBuild(activeQuest) : undefined;

  const { data: ideaRows } = await supabase
    .from("ideas")
    .select("title, status")
    .order("created_at", { ascending: false })
    .limit(15);

  const availableQuests = progress.questlines
    .flatMap((ql) =>
      (ql.quests ?? [])
        .filter((q) => q.status !== "active" && q.status !== "completed")
        .map((q) => ({ id: q.id, title: q.title, questlineId: ql.id }))
    )
    .slice(0, 20);

  const openBuilds = progress.questlines
    .flatMap((ql) =>
      (ql.quests ?? []).flatMap((q) =>
        (q.builds ?? [])
          .filter((b) => b.status !== "completed")
          .map((b) => ({ id: b.id, title: b.title, questId: q.id, questTitle: q.title }))
      )
    )
    .slice(0, 20);

  return {
    mainQuest: progress.mainQuest,
    activeQuestline: activeQuestline?.title ?? "None",
    activeQuestlineDescription: activeQuestline?.description ?? "",
    activeQuest: activeQuest?.title ?? "None",
    activeQuestId: activeQuest?.id ?? null,
    activeQuestDescription: activeQuest?.description ?? "",
    currentBuild: currentBuild?.title ?? "None",
    currentBuildDescription: currentBuild?.description ?? "",
    nextStep: currentBuild?.nextStep ?? "",
    questlines: progress.questlines.map((ql) => ({ id: ql.id, title: ql.title })),
    recentIdeas: (ideaRows ?? []) as { title: string; status: string }[],
    availableQuests,
    openBuilds,
  };
}
