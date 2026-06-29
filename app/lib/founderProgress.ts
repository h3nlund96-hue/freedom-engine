/**
 * Founder progression helpers.
 *
 * XP is derived from the Quest System data — no database needed yet.
 * These functions make it easy to reuse the same logic across
 * FounderStatusBar, a future profile page, or Companion context.
 */

import { type FreedomEngineProgress } from "../data/freedomEngineProgress";

/* ── XP RULES ─────────────────────────────────────────────────────────────── */

const XP_PER_BUILD = 100;
const XP_PER_SIDE_QUEST = 50;

/* ── LEVELING TABLE ───────────────────────────────────────────────────────── */

const LEVEL_THRESHOLDS = [
  { level: 1,  xp: 0    },
  { level: 2,  xp: 500  },
  { level: 3,  xp: 1000 },
  { level: 4,  xp: 1500 },
  { level: 5,  xp: 2000 },
  { level: 6,  xp: 3000 },
  { level: 7,  xp: 4000 },
  { level: 8,  xp: 5000 },
  { level: 9,  xp: 6500 },
  { level: 10, xp: 8000 },
] as const;

/* ── TITLE TABLE ──────────────────────────────────────────────────────────── */

const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 9,  title: "Founder of the Engine"  },
  { minLevel: 7,  title: "Architect of Freedom"   },
  { minLevel: 5,  title: "Steward of Momentum"    },
  { minLevel: 3,  title: "Builder of the Engine"  },
  { minLevel: 1,  title: "Initiate Founder"        },
];

/* ── HELPERS ──────────────────────────────────────────────────────────────── */

/** Total XP earned from completed Builds and Side Quests. */
export function calculateFounderXP(progress: FreedomEngineProgress): number {
  let xp = 0;

  for (const questline of progress.questlines) {
    for (const quest of questline.quests ?? []) {
      for (const build of quest.builds ?? []) {
        if (build.status === "completed") xp += XP_PER_BUILD;
      }
    }
  }

  for (const sq of progress.sideQuests) {
    if (sq.status === "completed") xp += XP_PER_SIDE_QUEST;
  }

  return xp;
}

/** Current Founder Level (1–10) based on total XP. */
export function calculateFounderLevel(xp: number): number {
  let level = 1;
  for (const { level: l, xp: threshold } of LEVEL_THRESHOLDS) {
    if (xp >= threshold) level = l;
    else break;
  }
  return level;
}

/** Title for the current level. */
export function getFounderTitle(level: number): string {
  for (const { minLevel, title } of LEVEL_TITLES) {
    if (level >= minLevel) return title;
  }
  return "Initiate Founder";
}

export interface XPProgress {
  /** XP at the start of the current level. */
  levelStartXP: number;
  /** XP needed to reach the next level. */
  levelEndXP: number;
  /** XP earned within the current level bracket. */
  xpInLevel: number;
  /** XP needed within the bracket to level up. */
  xpNeeded: number;
  /** 0–1 fraction of progress through this level. */
  fraction: number;
  /** Total XP earned. */
  totalXP: number;
  /** Current level. */
  level: number;
  /** Is The Founder at max level? */
  isMaxLevel: boolean;
}

/** Full XP progress breakdown for a given level and total XP. */
export function getXPProgress(totalXP: number): XPProgress {
  const level = calculateFounderLevel(totalXP);
  const isMaxLevel = level >= LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level;

  const currentEntry = LEVEL_THRESHOLDS.find((t) => t.level === level)!;
  const nextEntry = LEVEL_THRESHOLDS.find((t) => t.level === level + 1);

  if (!nextEntry || isMaxLevel) {
    return {
      levelStartXP: currentEntry.xp,
      levelEndXP: currentEntry.xp,
      xpInLevel: 0,
      xpNeeded: 0,
      fraction: 1,
      totalXP,
      level,
      isMaxLevel: true,
    };
  }

  const xpInLevel = totalXP - currentEntry.xp;
  const xpNeeded = nextEntry.xp - currentEntry.xp;

  return {
    levelStartXP: currentEntry.xp,
    levelEndXP: nextEntry.xp,
    xpInLevel,
    xpNeeded,
    fraction: Math.min(xpInLevel / xpNeeded, 1),
    totalXP,
    level,
    isMaxLevel: false,
  };
}

/** Count of completed Builds across all Questlines. */
export function countCompletedBuilds(progress: FreedomEngineProgress): number {
  let count = 0;
  for (const questline of progress.questlines) {
    for (const quest of questline.quests ?? []) {
      for (const build of quest.builds ?? []) {
        if (build.status === "completed") count++;
      }
    }
  }
  return count;
}

/** Count of completed Side Quests. */
export function countCompletedSideQuests(progress: FreedomEngineProgress): number {
  return progress.sideQuests.filter((sq) => sq.status === "completed").length;
}
