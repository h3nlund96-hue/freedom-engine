/**
 * Turns a raw proposal shape (from the text chat's JSON response, or from a
 * Realtime API tool call) into a validated EmberProposal — shared so both
 * channels use the exact same rules for what counts as a real proposal.
 * Pure logic, no server-only imports, so it works from a Next.js API route
 * and from client-side code (the Realtime session's data channel is a
 * direct browser↔OpenAI connection, not routed through our server).
 */

import type { EmberDeletableEntityType, EmberEntityType, EmberProposal } from "./emberConversation";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEntityType(value: unknown): value is EmberEntityType {
  return value === "questline" || value === "quest" || value === "build" || value === "side_quest";
}

function isDeletableEntityType(value: unknown): value is EmberDeletableEntityType {
  return isEntityType(value) || value === "idea";
}

function isStatusValue(value: unknown): value is "available" | "active" | "completed" {
  return value === "available" || value === "active" || value === "completed";
}

function nonEmptyOrNull(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function parseProposal(raw: unknown): EmberProposal | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  switch (r.action) {
    case "create_quest":
      if (!isNonEmptyString(r.title)) return null;
      return {
        action: "create_quest",
        title: r.title,
        description: typeof r.description === "string" ? r.description : "",
        questlineId: typeof r.questlineId === "string" && r.questlineId.length > 0 ? r.questlineId : null,
      };
    case "create_idea":
      if (!isNonEmptyString(r.title)) return null;
      return {
        action: "create_idea",
        title: r.title,
        description: typeof r.description === "string" ? r.description : "",
      };
    case "create_side_quest":
      if (!isNonEmptyString(r.title)) return null;
      return {
        action: "create_side_quest",
        title: r.title,
        description: typeof r.description === "string" ? r.description : "",
      };
    case "create_questline":
      if (!isNonEmptyString(r.title)) return null;
      return {
        action: "create_questline",
        title: r.title,
        description: typeof r.description === "string" ? r.description : "",
      };
    case "activate_quest":
      if (!isNonEmptyString(r.questId) || !isNonEmptyString(r.questlineId) || !isNonEmptyString(r.questTitle)) {
        return null;
      }
      return {
        action: "activate_quest",
        questId: r.questId,
        questlineId: r.questlineId,
        questTitle: r.questTitle,
      };
    case "complete_build":
      if (!isNonEmptyString(r.buildId) || !isNonEmptyString(r.questId) || !isNonEmptyString(r.buildTitle)) {
        return null;
      }
      return {
        action: "complete_build",
        buildId: r.buildId,
        questId: r.questId,
        buildTitle: r.buildTitle,
      };
    case "create_build":
      if (!isNonEmptyString(r.questId) || !isNonEmptyString(r.questTitle) || !isNonEmptyString(r.title)) {
        return null;
      }
      return {
        action: "create_build",
        questId: r.questId,
        questTitle: r.questTitle,
        title: r.title,
        description: typeof r.description === "string" ? r.description : "",
      };
    case "create_builds_batch": {
      if (!isNonEmptyString(r.questId) || !isNonEmptyString(r.questTitle) || !Array.isArray(r.builds)) return null;
      const builds = r.builds
        .filter((b): b is Record<string, unknown> => !!b && typeof b === "object" && isNonEmptyString((b as Record<string, unknown>).title))
        .map((b) => ({
          title: b.title as string,
          description: typeof b.description === "string" ? b.description : "",
        }));
      if (builds.length === 0) return null;
      return {
        action: "create_builds_batch",
        questId: r.questId,
        questTitle: r.questTitle,
        builds,
      };
    }
    case "convert_idea": {
      if (
        !isNonEmptyString(r.ideaId) ||
        !isNonEmptyString(r.ideaTitle) ||
        (r.targetType !== "quest" && r.targetType !== "side_quest") ||
        !isNonEmptyString(r.title)
      ) {
        return null;
      }
      return {
        action: "convert_idea",
        ideaId: r.ideaId,
        ideaTitle: r.ideaTitle,
        targetType: r.targetType,
        title: r.title,
        description: typeof r.description === "string" ? r.description : "",
        questlineId: nonEmptyOrNull(r.questlineId),
      };
    }
    case "update_status":
      if (!isEntityType(r.entityType) || !isStatusValue(r.status) || !isNonEmptyString(r.entityId) || !isNonEmptyString(r.entityTitle)) {
        return null;
      }
      return {
        action: "update_status",
        entityType: r.entityType,
        entityId: r.entityId,
        entityTitle: r.entityTitle,
        questlineId: nonEmptyOrNull(r.questlineId),
        questId: nonEmptyOrNull(r.questId),
        status: r.status,
      };
    case "delete_item":
      if (!isDeletableEntityType(r.entityType) || !isNonEmptyString(r.entityId) || !isNonEmptyString(r.entityTitle)) {
        return null;
      }
      return {
        action: "delete_item",
        entityType: r.entityType,
        entityId: r.entityId,
        entityTitle: r.entityTitle,
        questId: nonEmptyOrNull(r.questId),
      };
    default:
      return null;
  }
}

/* ── REALTIME TOOL SCHEMAS ────────────────────────────────────────────────── */

const PROPOSAL_NOTE =
  "This only proposes it — nothing happens until The Founder approves an on-screen card. Say out loud that you've put together a proposal for them to look at; never say or imply it's already done.";

export const EMBER_FUNCTION_TOOLS = [
  {
    type: "function",
    name: "propose_create_quest",
    description: `Propose creating a new Quest. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short, concrete Quest title." },
        description: { type: "string", description: "One sentence description." },
        questlineId: {
          type: "string",
          description:
            "The id of the best-fitting Questline from AVAILABLE QUESTLINES, or an empty string if none fit well.",
        },
      },
      required: ["title", "description", "questlineId"],
    },
  },
  {
    type: "function",
    name: "propose_create_idea",
    description: `Propose capturing a new Idea in the Idea Vault. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short, concrete Idea title." },
        description: { type: "string", description: "One sentence description." },
      },
      required: ["title", "description"],
    },
  },
  {
    type: "function",
    name: "propose_create_side_quest",
    description: `Propose creating a new Side Quest — a standalone item, not nested under any Questline or Quest. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short, concrete Side Quest title." },
        description: { type: "string", description: "One sentence description." },
      },
      required: ["title", "description"],
    },
  },
  {
    type: "function",
    name: "propose_create_questline",
    description: `Propose creating a new Questline — a container Quests can later be added to. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short, concrete Questline title." },
        description: { type: "string", description: "One sentence description." },
      },
      required: ["title", "description"],
    },
  },
  {
    type: "function",
    name: "propose_activate_quest",
    description: `Propose activating a Quest that isn't already active or completed. Only use a Quest listed under QUESTS YOU CAN PROPOSE ACTIVATING, with its exact id — never invent one. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        questId: { type: "string", description: "Exact id from QUESTS YOU CAN PROPOSE ACTIVATING." },
        questlineId: { type: "string", description: "That Quest's Questline id." },
        questTitle: { type: "string", description: "That Quest's title." },
      },
      required: ["questId", "questlineId", "questTitle"],
    },
  },
  {
    type: "function",
    name: "propose_complete_build",
    description: `Propose marking an open Build complete. Only use a Build listed under OPEN BUILDS YOU CAN PROPOSE MARKING COMPLETE, with its exact id — never invent one. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        buildId: { type: "string", description: "Exact id from OPEN BUILDS YOU CAN PROPOSE MARKING COMPLETE." },
        questId: { type: "string", description: "That Build's Quest id." },
        buildTitle: { type: "string", description: "That Build's title." },
      },
      required: ["buildId", "questId", "buildTitle"],
    },
  },
  {
    type: "function",
    name: "propose_create_build",
    description: `Propose a new Build for the active Quest. Only use this when there is an active Quest, using its exact id — never invent one. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        questId: { type: "string", description: "The Active Quest's exact id." },
        questTitle: { type: "string", description: "The Active Quest's title." },
        title: { type: "string", description: "Short, concrete Build title." },
        description: { type: "string", description: "One sentence description." },
      },
      required: ["questId", "questTitle", "title", "description"],
    },
  },
  {
    type: "function",
    name: "propose_create_builds_batch",
    description: `Propose several new Builds at once for the active Quest — useful when breaking a freshly created or newly active Quest into its first concrete steps. Only use this when there is an active Quest, using its exact id — never invent one. Typically 2-6 Builds; each one short and concrete. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        questId: { type: "string", description: "The Active Quest's exact id." },
        questTitle: { type: "string", description: "The Active Quest's title." },
        builds: {
          type: "array",
          description: "The proposed Builds, in the order they should be worked.",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Short, concrete Build title." },
              description: { type: "string", description: "One sentence description." },
            },
            required: ["title", "description"],
          },
        },
      },
      required: ["questId", "questTitle", "builds"],
    },
  },
  {
    type: "function",
    name: "propose_convert_idea",
    description: `Propose converting an existing, not-yet-converted Idea into a new Quest or a new Side Quest. Only use an Idea listed under IDEAS YOU CAN PROPOSE CONVERTING, with its exact id — never invent one, and never one already converted. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        ideaId: { type: "string", description: "Exact id from IDEAS YOU CAN PROPOSE CONVERTING." },
        ideaTitle: { type: "string", description: "That Idea's title." },
        targetType: { type: "string", enum: ["quest", "side_quest"] },
        title: { type: "string", description: "Title for the resulting Quest or Side Quest — the Idea's title, refined if useful." },
        description: { type: "string", description: "One sentence description." },
        questlineId: {
          type: "string",
          description: 'Required only when targetType is "quest" — the best-fitting Questline id from AVAILABLE QUESTLINES, or an empty string if none fit well.',
        },
      },
      required: ["ideaId", "ideaTitle", "targetType", "title", "description", "questlineId"],
    },
  },
  {
    type: "function",
    name: "propose_update_status",
    description: `Propose changing the status of a Questline, Quest, Build, or Side Quest — reopening something completed back to "available", marking one "completed", or similar. A Questline only ever uses "available" or "completed", never "active". Only use an id already given to you in context — never invent one. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        entityType: { type: "string", enum: ["questline", "quest", "build", "side_quest"] },
        entityId: { type: "string", description: "The exact id of the Questline, Quest, Build, or Side Quest." },
        entityTitle: { type: "string", description: "Its title." },
        questlineId: {
          type: "string",
          description: 'Required only when entityType is "quest" — that Quest\'s Questline id. Empty string otherwise.',
        },
        questId: {
          type: "string",
          description: 'Required only when entityType is "build" — that Build\'s Quest id. Empty string otherwise.',
        },
        status: { type: "string", enum: ["available", "active", "completed"] },
      },
      required: ["entityType", "entityId", "entityTitle", "questlineId", "questId", "status"],
    },
  },
  {
    type: "function",
    name: "propose_delete_item",
    description: `Propose permanently deleting a Questline, Quest, Build, Side Quest, or Idea. This is destructive and cannot be undone once approved — deleting a Questline or Quest also removes everything nested inside it. Only use an id already given to you in context — never invent one. ${PROPOSAL_NOTE}`,
    parameters: {
      type: "object",
      properties: {
        entityType: { type: "string", enum: ["questline", "quest", "build", "side_quest", "idea"] },
        entityId: { type: "string", description: "The exact id of the item to delete." },
        entityTitle: { type: "string", description: "Its title." },
        questId: {
          type: "string",
          description: 'Required only when entityType is "build" — that Build\'s Quest id. Empty string otherwise.',
        },
      },
      required: ["entityType", "entityId", "entityTitle", "questId"],
    },
  },
] as const;

/** Maps a Realtime function-call (name + JSON-string arguments) into the
 * same validated EmberProposal shape the text chat produces. */
export function parseToolCall(name: string, argsJson: string): EmberProposal | null {
  let args: unknown;
  try {
    args = JSON.parse(argsJson);
  } catch {
    return null;
  }
  if (!args || typeof args !== "object") return null;

  const action = name.replace(/^propose_/, "");
  const merged: Record<string, unknown> = { action, ...(args as Record<string, unknown>) };
  if (merged.questlineId === "") merged.questlineId = null;

  return parseProposal(merged);
}
