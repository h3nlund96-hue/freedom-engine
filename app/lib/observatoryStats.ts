/**
 * The Observatory's number-crunching — pure functions, no fetching. Reads
 * completedAt (set by questMutationService.ts's toPatch() the moment
 * something becomes "completed", cleared if reopened) rather than
 * updated_at, which shifts on any edit and would misrepresent when things
 * actually finished.
 */

import { calculateFounderXP } from "./founderProgress";
import { type FreedomEngineProgress, type Questline } from "../data/freedomEngineProgress";

const XP_PER_BUILD = 100;
const XP_PER_SIDE_QUEST = 50;

/** Past this many days since the last completion, a Questline reads as quiet
 * rather than active — a deliberately generous window for a personal,
 * one-Founder pace rather than a team's. */
const STALE_THRESHOLD_DAYS = 14;

/* ── WEEKLY MOMENTUM ──────────────────────────────────────────────────────── */

export interface WeekBucket {
  /** Short label for the bucket's start, e.g. "Jul 7". */
  label: string;
  /** Builds completed within this 7-day window. */
  buildsCompleted: number;
  /** XP earned within this 7-day window (Builds + Side Quests). */
  xpEarned: number;
  /** Running total XP through the end of this window — a different view
   * than xpEarned (per-period), not the same number twice. */
  cumulativeXP: number;
}

interface CompletionEvent {
  completedAt: string;
  xp: number;
}

function collectCompletionEvents(progress: FreedomEngineProgress): CompletionEvent[] {
  const events: CompletionEvent[] = [];

  for (const questline of progress.questlines) {
    for (const quest of questline.quests ?? []) {
      for (const build of quest.builds ?? []) {
        if (build.status === "completed" && build.completedAt) {
          events.push({ completedAt: build.completedAt, xp: XP_PER_BUILD });
        }
      }
    }
  }

  for (const sideQuest of progress.sideQuests) {
    if (sideQuest.status === "completed" && sideQuest.completedAt) {
      events.push({ completedAt: sideQuest.completedAt, xp: XP_PER_SIDE_QUEST });
    }
  }

  return events;
}

/** Rolling 7-day buckets ending today, oldest first — a simple trailing
 * window rather than calendar weeks, so it never misrepresents a partial
 * first/last week. */
export function getWeeklyMomentum(progress: FreedomEngineProgress, weeks = 8): WeekBucket[] {
  const events = collectCompletionEvents(progress);
  const now = new Date();
  const buckets: WeekBucket[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const bucketEnd = new Date(now);
    bucketEnd.setDate(bucketEnd.getDate() - i * 7);
    const bucketStart = new Date(bucketEnd);
    bucketStart.setDate(bucketStart.getDate() - 7);

    let buildsCompleted = 0;
    let xpEarned = 0;
    let cumulativeXP = 0;
    for (const event of events) {
      const at = new Date(event.completedAt);
      // Cumulative total includes everything up through this window's end —
      // including completions from before the visible range — so the last
      // bucket always matches calculateFounderXP()'s true current total.
      if (at <= bucketEnd) cumulativeXP += event.xp;
      if (at > bucketStart && at <= bucketEnd) {
        xpEarned += event.xp;
        if (event.xp === XP_PER_BUILD) buildsCompleted++;
      }
    }

    buckets.push({
      label: bucketStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      buildsCompleted,
      xpEarned,
      cumulativeXP,
    });
  }

  return buckets;
}

/* ── QUESTLINE MOMENTUM ───────────────────────────────────────────────────── */

export interface QuestlineActivity {
  id: string;
  title: string;
  /** Most recent completedAt across the Questline itself, its Quests, and
   * their Builds — null if nothing under it has ever been completed. */
  lastActivityAt: string | null;
  daysSinceActivity: number | null;
  isStale: boolean;
}

function latestCompletedAt(questline: Questline): string | null {
  let latest: string | null = questline.completedAt;

  for (const quest of questline.quests ?? []) {
    if (quest.completedAt && (!latest || quest.completedAt > latest)) latest = quest.completedAt;
    for (const build of quest.builds ?? []) {
      if (build.completedAt && (!latest || build.completedAt > latest)) latest = build.completedAt;
    }
  }

  return latest;
}

/** Only ongoing Questlines — a completed one is finished, not "going stale". */
export function getQuestlineActivity(progress: FreedomEngineProgress): QuestlineActivity[] {
  const now = Date.now();

  return progress.questlines
    .filter((ql) => ql.status !== "completed")
    .map((ql) => {
      const lastActivityAt = latestCompletedAt(ql);
      const daysSinceActivity = lastActivityAt
        ? Math.floor((now - new Date(lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;
      return {
        id: ql.id,
        title: ql.title,
        lastActivityAt,
        daysSinceActivity,
        isStale: daysSinceActivity !== null && daysSinceActivity > STALE_THRESHOLD_DAYS,
      };
    })
    .sort((a, b) => (a.daysSinceActivity ?? Infinity) - (b.daysSinceActivity ?? Infinity));
}

/* ── CUMULATIVE XP ────────────────────────────────────────────────────────── */

/** Total XP right now, reusing the same rule FounderStatusBar's level
 * derives from — The Observatory's XP chart should never disagree with it. */
export function getCurrentTotalXP(progress: FreedomEngineProgress): number {
  return calculateFounderXP(progress);
}
