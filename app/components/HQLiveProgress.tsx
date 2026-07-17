"use client";

import { useEffect, useState } from "react";
import { FounderStatusBar } from "./FounderStatusBar";
import { EmberGreeting } from "./EmberGreeting";
import { ActiveQuest } from "./ActiveQuest";
import { HQHeader } from "./HQHeader";
import { getActiveQuest, getCurrentBuild, type FreedomEngineProgress } from "../data/freedomEngineProgress";
import { getProgressClient } from "../lib/questMutationService";
import { onEmberEvent } from "../lib/emberEvents";

/**
 * HQ's progress-dependent shell — status bar, greeting, and the Active Quest
 * card. Holds live state instead of just the server-fetched snapshot,
 * because Ember can activate a Quest or complete a Build from the floating
 * widget right here on HQ, and without this, none of these three would
 * reflect it until a full page reload.
 */
export function HQLiveProgress({
  initialProgress,
  children,
}: {
  initialProgress: FreedomEngineProgress;
  children?: React.ReactNode;
}) {
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    return onEmberEvent((detail) => {
      if (detail.kind !== "quest_system_changed") return;
      getProgressClient()
        .then(setProgress)
        .catch(() => {
          // Keep showing the last known state — the next successful event will catch up.
        });
    });
  }, []);

  const activeQuest = getActiveQuest(progress);
  const currentBuild = activeQuest ? getCurrentBuild(activeQuest) : undefined;

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <FounderStatusBar progress={progress} />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-14 sm:px-8 sm:py-20 lg:max-w-3xl xl:max-w-4xl">
        <HQHeader title="AI Mastery HQ" />

        <EmberGreeting activeQuestTitle={activeQuest?.title} activeBuildTitle={currentBuild?.title} />

        <ActiveQuest progress={progress} />

        {children}
      </main>
    </div>
  );
}
