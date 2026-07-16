/**
 * Turns a raw proposal shape (from the text chat's JSON response, or from a
 * Realtime API tool call) into a validated EmberProposal — shared so both
 * channels use the exact same rules for what counts as a real proposal.
 * Pure logic, no server-only imports, so it works from a Next.js API route
 * and from client-side code (the Realtime session's data channel is a
 * direct browser↔OpenAI connection, not routed through our server).
 */

import type { EmberProposal } from "./emberConversation";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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
        nextStep: typeof r.nextStep === "string" ? r.nextStep : "",
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
        nextStep: { type: "string", description: "One concrete next action, or an empty string." },
      },
      required: ["questId", "questTitle", "title", "description", "nextStep"],
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
