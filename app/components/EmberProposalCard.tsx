"use client";

import { useEffect, useState } from "react";
import type { EmberProposal } from "../lib/emberConversation";
import { createIdea } from "../lib/ideaService";
import {
  createQuest,
  getQuestlineOptions,
  updateQuest,
  updateBuild,
  type QuestlineSummary,
} from "../lib/questMutationService";
import { CornerMarks } from "./CornerMarks";

/** The proposal card Ember attaches to a message — reused in both the
 * floating widget and the Hall of Embers room. Nothing is ever written to
 * Supabase until The Founder approves here. */

function proposalHeading(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
      return "Proposed Quest";
    case "create_idea":
      return "Proposed Idea";
    case "activate_quest":
      return "Proposed: Activate Quest";
    case "complete_build":
      return "Proposed: Complete Build";
  }
}

function proposalTitle(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
    case "create_idea":
      return proposal.title;
    case "activate_quest":
      return proposal.questTitle;
    case "complete_build":
      return proposal.buildTitle;
  }
}

function approveLabel(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
    case "create_idea":
      return "Approve & Create";
    case "activate_quest":
      return "Approve & Activate";
    case "complete_build":
      return "Approve & Complete";
  }
}

export function successLabel(proposal: EmberProposal): string {
  switch (proposal.action) {
    case "create_quest":
      return `✓ Created Quest — "${proposal.title}"`;
    case "create_idea":
      return `✓ Created Idea — "${proposal.title}"`;
    case "activate_quest":
      return `✓ Activated Quest — "${proposal.questTitle}"`;
    case "complete_build":
      return `✓ Completed Build — "${proposal.buildTitle}"`;
  }
}

export function ProposalCard({
  proposal,
  onResolve,
}: {
  proposal: EmberProposal;
  onResolve: (status: "created" | "dismissed") => void;
}) {
  const [questlineOptions, setQuestlineOptions] = useState<QuestlineSummary[]>([]);
  const [questlineId, setQuestlineId] = useState(
    proposal.action === "create_quest" ? proposal.questlineId ?? "" : ""
  );
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (proposal.action !== "create_quest") return;
    getQuestlineOptions()
      .then((options) => {
        setQuestlineOptions(options);
        setQuestlineId((current) => current || options[0]?.id || "");
      })
      .catch(() => {
        // Leave the picker empty — the "no Questlines" message below covers it.
      });
  }, [proposal.action]);

  async function handleApprove() {
    setWorking(true);
    setActionError(null);
    try {
      if (proposal.action === "create_idea") {
        await createIdea(proposal.title, proposal.description, "raw");
      } else if (proposal.action === "create_quest") {
        if (!questlineId) throw new Error("Choose a Questline first.");
        await createQuest(questlineId, proposal.title, proposal.description);
      } else if (proposal.action === "activate_quest") {
        await updateQuest(proposal.questId, proposal.questlineId, { status: "active" });
      } else if (proposal.action === "complete_build") {
        await updateBuild(proposal.buildId, proposal.questId, { status: "completed" });
      }
      onResolve("created");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not do this. Try again.");
      setWorking(false);
    }
  }

  const description = proposal.action === "create_quest" || proposal.action === "create_idea" ? proposal.description : "";

  return (
    <div className="relative space-y-3 overflow-hidden rounded-md border border-accent-glow/20 bg-accent-glow/[0.04] p-4">
      <CornerMarks size={8} inset="6px" color="rgba(77,216,255,0.3)" />
      <p className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-accent-glow/70">
        {proposalHeading(proposal)}
      </p>
      <div>
        <p className="text-sm font-medium text-foreground/90">{proposalTitle(proposal)}</p>
        {description && <p className="mt-1 text-xs leading-relaxed text-muted/60">{description}</p>}
      </div>

      {proposal.action === "create_quest" &&
        (questlineOptions.length > 0 ? (
          <select
            value={questlineId}
            onChange={(e) => setQuestlineId(e.target.value)}
            className="w-full cursor-pointer rounded-sm border border-white/[0.07] bg-black/25 px-3 py-2 font-display text-xs uppercase tracking-wide text-accent-glow/80 focus:outline-none focus:ring-1 focus:ring-accent-glow/30"
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

      {actionError && <p className="text-xs text-[rgba(255,120,120,0.9)]">{actionError}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleApprove()}
          disabled={working || (proposal.action === "create_quest" && !questlineId)}
          className="rounded-sm px-3.5 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase text-accent-glow/85 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "rgba(77,216,255,0.12)", border: "1px solid rgba(77,216,255,0.25)" }}
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
