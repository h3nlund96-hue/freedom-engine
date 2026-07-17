"use client";

import { useEffect, useState } from "react";
import type { EmberProposal } from "../lib/emberConversation";
import { createIdea, deleteIdea, convertIdeaToQuest, convertIdeaToSideQuest } from "../lib/ideaService";
import {
  createQuest,
  createQuestline,
  createBuild,
  createSideQuest,
  getQuestlineOptions,
  updateQuestline,
  updateQuest,
  updateBuild,
  updateSideQuest,
  deleteQuestline,
  deleteQuest,
  deleteBuild,
  deleteSideQuest,
  type QuestlineSummary,
} from "../lib/questMutationService";
import { CornerMarks } from "./CornerMarks";
import { emitEmberEvent } from "../lib/emberEvents";

/** The proposal card Ember attaches to a message — reused in both the
 * floating widget and the Hall of Embers room. Nothing is ever written to
 * Supabase until The Founder approves here. */

const ENTITY_LABELS: Record<string, string> = {
  questline: "Questline",
  quest: "Quest",
  build: "Build",
  side_quest: "Side Quest",
  idea: "Idea",
};

function proposalHeading(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
      return "Proposed Quest";
    case "create_idea":
      return "Proposed Idea";
    case "create_side_quest":
      return "Proposed Side Quest";
    case "create_questline":
      return "Proposed Questline";
    case "activate_quest":
      return "Proposed: Activate Quest";
    case "complete_build":
      return "Proposed: Complete Build";
    case "create_build":
      return "Proposed Build";
    case "create_builds_batch":
      return "Proposed Builds";
    case "convert_idea":
      return proposal.targetType === "quest" ? "Proposed: Convert Idea → Quest" : "Proposed: Convert Idea → Side Quest";
    case "update_status":
      return proposal.status === "completed"
        ? "Proposed: Mark Complete"
        : proposal.status === "active"
        ? "Proposed: Activate"
        : "Proposed: Reopen";
    case "delete_item":
      return "Proposed: Delete";
  }
}

function proposalTitle(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
    case "create_idea":
    case "create_side_quest":
    case "create_questline":
    case "create_build":
      return proposal.title;
    case "create_builds_batch":
      return `${proposal.builds.length} Build${proposal.builds.length === 1 ? "" : "s"} for ${proposal.questTitle}`;
    case "convert_idea":
      return proposal.title;
    case "activate_quest":
      return proposal.questTitle;
    case "complete_build":
      return proposal.buildTitle;
    case "update_status":
    case "delete_item":
      return proposal.entityTitle;
  }
}

function approveLabel(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
    case "create_idea":
    case "create_side_quest":
    case "create_questline":
    case "create_build":
    case "create_builds_batch":
      return "Approve & Create";
    case "convert_idea":
      return "Approve & Convert";
    case "activate_quest":
      return "Approve & Activate";
    case "complete_build":
      return "Approve & Complete";
    case "update_status":
      return proposal.status === "completed"
        ? "Approve & Complete"
        : proposal.status === "active"
        ? "Approve & Activate"
        : "Approve & Reopen";
    case "delete_item":
      return "Approve & Delete";
  }
}

export function successLabel(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
      return `✓ Created Quest — "${proposal.title}"`;
    case "create_idea":
      return `✓ Created Idea — "${proposal.title}"`;
    case "create_side_quest":
      return `✓ Created Side Quest — "${proposal.title}"`;
    case "create_questline":
      return `✓ Created Questline — "${proposal.title}"`;
    case "activate_quest":
      return `✓ Activated Quest — "${proposal.questTitle}"`;
    case "complete_build":
      return `✓ Completed Build — "${proposal.buildTitle}"`;
    case "create_build":
      return `✓ Created Build — "${proposal.title}"`;
    case "create_builds_batch":
      return `✓ Created ${proposal.builds.length} Build${proposal.builds.length === 1 ? "" : "s"} for "${proposal.questTitle}"`;
    case "convert_idea":
      return `✓ Converted "${proposal.ideaTitle}" → ${proposal.targetType === "quest" ? "Quest" : "Side Quest"} — "${proposal.title}"`;
    case "update_status":
      return `✓ "${proposal.entityTitle}" is now ${proposal.status}`;
    case "delete_item":
      return `✓ Deleted — "${proposal.entityTitle}"`;
  }
}

export function ProposalCard({
  proposal,
  onResolve,
}: {
  proposal: EmberProposal;
  onResolve: (status: "created" | "dismissed") => void;
}) {
  // Both create_quest and a convert_idea-to-Quest proposal need The Founder
  // to confirm (or change) which Questline the result lands in.
  const needsQuestlinePicker =
    proposal.action === "create_quest" || (proposal.action === "convert_idea" && proposal.targetType === "quest");

  const [questlineOptions, setQuestlineOptions] = useState<QuestlineSummary[]>([]);
  const [questlineId, setQuestlineId] = useState(
    proposal.action === "create_quest"
      ? proposal.questlineId ?? ""
      : proposal.action === "convert_idea"
      ? proposal.questlineId ?? ""
      : ""
  );
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!needsQuestlinePicker) return;
    getQuestlineOptions()
      .then((options) => {
        setQuestlineOptions(options);
        setQuestlineId((current) => current || options[0]?.id || "");
      })
      .catch(() => {
        // Leave the picker empty — the "no Questlines" message below covers it.
      });
  }, [needsQuestlinePicker]);

  async function handleApprove() {
    setWorking(true);
    setActionError(null);
    try {
      if (proposal.action === "create_idea") {
        await createIdea(proposal.title, proposal.description, "raw");
      } else if (proposal.action === "create_quest") {
        if (!questlineId) throw new Error("Choose a Questline first.");
        await createQuest(questlineId, proposal.title, proposal.description);
      } else if (proposal.action === "create_side_quest") {
        await createSideQuest(proposal.title, proposal.description);
      } else if (proposal.action === "create_questline") {
        await createQuestline(proposal.title, proposal.description);
      } else if (proposal.action === "activate_quest") {
        await updateQuest(proposal.questId, proposal.questlineId, { status: "active" });
      } else if (proposal.action === "complete_build") {
        await updateBuild(proposal.buildId, proposal.questId, { status: "completed" });
      } else if (proposal.action === "create_build") {
        await createBuild(proposal.questId, proposal.title, proposal.description);
      } else if (proposal.action === "create_builds_batch") {
        // Sequential, not Promise.all — each createBuild call reads the
        // current max sort_order/build_number before inserting, so
        // concurrent calls would race and could collide on the same values.
        for (const build of proposal.builds) {
          await createBuild(proposal.questId, build.title, build.description);
        }
      } else if (proposal.action === "convert_idea") {
        if (proposal.targetType === "quest") {
          if (!questlineId) throw new Error("Choose a Questline first.");
          await convertIdeaToQuest(proposal.ideaId, questlineId, proposal.title, proposal.description);
        } else {
          await convertIdeaToSideQuest(proposal.ideaId, proposal.title, proposal.description);
        }
      } else if (proposal.action === "update_status") {
        if (proposal.entityType === "questline") {
          await updateQuestline(proposal.entityId, { status: proposal.status });
        } else if (proposal.entityType === "quest") {
          await updateQuest(proposal.entityId, proposal.questlineId ?? "", { status: proposal.status });
        } else if (proposal.entityType === "build") {
          await updateBuild(proposal.entityId, proposal.questId ?? "", { status: proposal.status });
        } else if (proposal.entityType === "side_quest") {
          await updateSideQuest(proposal.entityId, { status: proposal.status });
        }
      } else if (proposal.action === "delete_item") {
        if (proposal.entityType === "questline") {
          await deleteQuestline(proposal.entityId);
        } else if (proposal.entityType === "quest") {
          await deleteQuest(proposal.entityId);
        } else if (proposal.entityType === "build") {
          await deleteBuild(proposal.entityId, proposal.questId ?? "");
        } else if (proposal.entityType === "side_quest") {
          await deleteSideQuest(proposal.entityId);
        } else if (proposal.entityType === "idea") {
          await deleteIdea(proposal.entityId);
        }
      }
      // Ember's approved actions write straight to Supabase from this card —
      // wherever the Quest Board or Ember's own context is already mounted,
      // this is the only signal they get to refetch instead of showing
      // stale state until the next full page load.
      emitEmberEvent({ kind: "quest_system_changed" });
      onResolve("created");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not do this. Try again.");
      setWorking(false);
    }
  }

  const description =
    proposal.action === "create_quest" ||
    proposal.action === "create_idea" ||
    proposal.action === "create_side_quest" ||
    proposal.action === "create_questline" ||
    proposal.action === "create_build" ||
    proposal.action === "convert_idea"
      ? proposal.description
      : "";

  const entityLabel =
    proposal.action === "update_status" || proposal.action === "delete_item"
      ? ENTITY_LABELS[proposal.entityType]
      : proposal.action === "create_build"
      ? `For ${proposal.questTitle}`
      : proposal.action === "convert_idea"
      ? `From Idea: ${proposal.ideaTitle}`
      : null;

  const isDestructive = proposal.action === "delete_item";

  return (
    <div
      className={`relative space-y-3 overflow-hidden rounded-md border p-4 ${
        isDestructive ? "border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.05)]" : "border-accent-glow/20 bg-accent-glow/[0.04]"
      }`}
    >
      <CornerMarks size={8} inset="6px" color={isDestructive ? "rgba(255,92,92,0.35)" : "rgba(77,216,255,0.3)"} />
      <p
        className={`font-display text-[0.55rem] tracking-[0.2em] uppercase ${
          isDestructive ? "text-critical/85" : "text-accent-glow/70"
        }`}
      >
        {proposalHeading(proposal)}
      </p>
      <div>
        {entityLabel && <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-muted/40">{entityLabel}</p>}
        <p className="text-sm font-medium text-foreground/90">{proposalTitle(proposal)}</p>
        {description && <p className="mt-1 text-xs leading-relaxed text-muted/60">{description}</p>}
        {isDestructive && (
          <p className="mt-1 text-xs leading-relaxed text-critical/75">
            This cannot be undone once approved.
          </p>
        )}
      </div>

      {proposal.action === "create_builds_batch" && (
        <ol className="space-y-1.5 border-t border-accent-glow/[0.08] pt-3">
          {proposal.builds.map((build, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 font-display text-[0.65rem] tabular-nums text-muted/40">{i + 1}.</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground/85">{build.title}</p>
                {build.description && <p className="text-[0.7rem] leading-relaxed text-muted/55">{build.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {needsQuestlinePicker &&
        (questlineOptions.length > 0 ? (
          <select
            value={questlineId}
            onChange={(e) => setQuestlineId(e.target.value)}
            className="w-full cursor-pointer rounded-sm border border-card-border bg-surface-sunken px-3 py-2 font-display text-base sm:text-xs uppercase tracking-wide text-accent-glow/80 focus:outline-none focus:ring-1 focus:ring-accent-glow/30"
          >
            {questlineOptions.map((ql) => (
              <option key={ql.id} value={ql.id}>
                {ql.title}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-muted/50">No Questlines exist yet — create one on Quest Board first.</p>
        ))}

      {actionError && <p className="text-xs text-critical/90">{actionError}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleApprove()}
          disabled={working || (needsQuestlinePicker && !questlineId)}
          className="rounded-sm px-3.5 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40"
          style={
            isDestructive
              ? { background: "rgba(255,92,92,0.12)", color: "var(--critical)", border: "1px solid rgba(255,92,92,0.25)" }
              : { background: "rgba(77,216,255,0.12)", color: "var(--accent-glow)", border: "1px solid rgba(77,216,255,0.25)" }
          }
        >
          {working ? "Working..." : approveLabel(proposal)}
        </button>
        <button
          type="button"
          onClick={() => onResolve("dismissed")}
          disabled={working}
          className="rounded-sm px-3.5 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase text-muted/60 transition-colors duration-300 hover:text-foreground/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
