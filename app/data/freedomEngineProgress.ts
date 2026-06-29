// Alpha data layer — replace with database-backed storage when Freedom Engine needs it.

export type QuestStatus = "available" | "active" | "completed";

export interface Build {
  id: string;
  title: string;
  status: QuestStatus;
  description?: string;
  nextStep?: string;
}

export interface Quest {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  builds?: Build[];
}

export interface Questline {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
  quests?: Quest[];
}

export interface SideQuest {
  id: string;
  title: string;
  status: QuestStatus;
  description: string;
}

export interface FreedomEngineProgress {
  mainQuest: string;
  questlines: Questline[];
  sideQuests: SideQuest[];
}

/* ── DATA ─────────────────────────────────────────────────────────────────── */

export const progress: FreedomEngineProgress = {
  mainQuest: "Build the Freedom Engine.",

  questlines: [
    {
      id: "ai-mastery-hq",
      title: "AI Mastery HQ",
      status: "active",
      description:
        "The current Questline focused on building the first live and usable version of Freedom Engine.",
      quests: [
        {
          id: "quest-0",
          title: "Quest 0 — Foundations",
          status: "completed",
          description:
            "Define the Founder Manifesto, Founder Constitution, core principles, and Freedom Engine language.",
        },
        {
          id: "quest-1",
          title: "Quest 1 — AI Mastery HQ Alpha in Notion",
          status: "completed",
          description:
            "Prototype the first HQ structure and discover the product direction before moving into code.",
        },
        {
          id: "quest-2",
          title: "Quest 2 — Build Freedom Engine Alpha",
          status: "active",
          description:
            "Build the first live and usable version of the Freedom Engine world.",
          builds: [
            {
              id: "004",
              title: "Build #004 — Create Freedom Engine",
              status: "completed",
            },
            {
              id: "005",
              title: "Build #005 — First Transformation",
              status: "completed",
            },
            {
              id: "006",
              title: "Build #006 — Make the World Navigable",
              status: "completed",
            },
            {
              id: "007",
              title: "Build #007 — Constitution Hall",
              status: "completed",
            },
            {
              id: "008",
              title: "Build #008 — Quest Board",
              status: "completed",
            },
            {
              id: "009",
              title: "Build #009 — Idea Vault",
              status: "completed",
            },
            {
              id: "010",
              title: "Build #010 — Bring Tend the Fire Home",
              status: "completed",
            },
            {
              id: "011",
              title: "Build #011 — Source of Truth Docs",
              status: "completed",
            },
            {
              id: "012",
              title: "Build #012 — Teach AI Project Rules",
              status: "completed",
            },
            {
              id: "013",
              title: "Build #013 — Functional Idea Vault",
              status: "completed",
            },
            {
              id: "014",
              title: "Build #014 — Quest System Layer",
              status: "completed",
              description:
                "Create structured Quest data and update Quest Board so it reflects the real state of Freedom Engine Alpha.",
            },
            {
              id: "015",
              title: "Build #015 — Companion Hall",
              status: "completed",
              description:
                "Create Companion Hall as the first visible entry point for Freedom Engine Companions.",
            },
            {
              id: "016",
              title: "Build #016 — Update Quest Board After Companion Hall",
              status: "completed",
              description:
                "Update the Quest System Layer so HQ and Quest Board reflect the completed Companion Hall Build and the current state of Freedom Engine Alpha.",
            },
            {
              id: "017",
              title: "Build #017 — Steward Console",
              status: "completed",
              description:
                "Create the first Steward Console inside Companion Hall as a non-functional Alpha entry point toward real Companion intelligence.",
            },
            {
              id: "018",
              title: "Build #018 — Steward Response Prototype",
              status: "completed",
              description:
                "Create a local Alpha response pattern for The Steward before connecting real Companion intelligence.",
            },
            {
              id: "019",
              title: "Build #019 — Activate The Steward",
              status: "completed",
              description:
                "Connect The Steward Console to real AI through a secure server-side API route.",
            },
            {
              id: "020",
              title: "Build #020 — Update Quest System After Steward Activation",
              status: "active",
              description:
                "Update the Quest System Layer so HQ and Quest Board reflect that The Steward is now active and Freedom Engine has its first real AI Companion.",
              nextStep:
                "Review the updated HQ and Quest Board, then choose the next real Build.",
            },
          ],
        },
      ],
    },
    {
      id: "freedom-engine-core",
      title: "Freedom Engine Core",
      status: "available",
      description:
        "The deeper operating system layer that will grow after AI Mastery HQ becomes useful.",
    },
  ],

  sideQuests: [
    {
      id: "sq-001",
      title: "Side Quest #001 — GitHub Repository",
      status: "completed",
      description: "Back up Freedom Engine safely in GitHub.",
    },
    {
      id: "sq-002",
      title: "Side Quest #002 — Deploy Alpha",
      status: "completed",
      description:
        "Deploy Freedom Engine Alpha to the web so it can be opened from mobile.",
    },
    {
      id: "sq-env-art",
      title: "Environment Art Pass",
      status: "available",
      description:
        "Add real background art and world atmosphere to each location.",
    },
    {
      id: "sq-idea-vault-ux",
      title: "Idea Vault UX Build",
      status: "available",
      description:
        "Improve the layout and interaction design of the functional Idea Vault.",
    },
    {
      id: "sq-mobile-polish",
      title: "Mobile Polish Build",
      status: "available",
      description: "Refine the mobile experience if needed later.",
    },
    {
      id: "sq-db-vault",
      title: "Database-backed Idea Vault",
      status: "available",
      description:
        "Replace Alpha localStorage with database-backed storage and cross-device sync.",
    },
    {
      id: "sq-auth",
      title: "Authentication and User Accounts",
      status: "available",
      description:
        "Add private user access when Freedom Engine needs real synced personal data.",
    },
  ],
};

/* ── DERIVED HELPERS ──────────────────────────────────────────────────────── */

export function getActiveQuestline(p: FreedomEngineProgress): Questline | undefined {
  return p.questlines.find((q) => q.status === "active");
}

export function getActiveQuest(questline: Questline): Quest | undefined {
  return questline.quests?.find((q) => q.status === "active");
}

export function getCurrentBuild(quest: Quest): Build | undefined {
  return quest.builds?.find((b) => b.status === "active");
}
