"use client";

import { useEffect, useState } from "react";
import {
  useEmberConversation,
  type EmberMessage,
  type EmberProposal,
} from "../lib/emberConversation";
import { createIdea } from "../lib/ideaService";
import { createQuest, getQuestlineOptions, type QuestlineSummary } from "../lib/questMutationService";

const SUGGESTED_QUESTIONS = [
  "What should the next Build be?",
  "Does this serve the Main Quest?",
  "Is this a Side Quest or part of the active Questline?",
  "What is the smallest useful next step?",
];

/** The shared Ember ask console — reused inline on Companion Hall and inside
 * the floating widget on HQ, Quest Board and Idea Vault. Same conversation
 * either way, since both read from the same EmberProvider context. */
export function EmberPanel() {
  const { messages, loading, error, ask, resolveProposal } = useEmberConversation();
  const [question, setQuestion] = useState("");

  async function handleAsk() {
    if (!question.trim() || loading) return;
    const q = question;
    setQuestion("");
    await ask(q);
  }

  function handleSuggestion(q: string) {
    setQuestion(q);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h3 className="font-display text-lg tracking-wide text-foreground/90">Ask Ember</h3>
        <p className="text-xs text-muted/50">
          A quiet place to ask for direction before choosing the next Build.
        </p>
      </div>

      {messages.length > 0 && (
        <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} index={i} onResolveProposal={resolveProposal} />
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <div className="space-y-2.5">
          <p className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-muted/35">
            Suggested Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSuggestion(q)}
                className={`rounded-sm border px-3 py-1.5 text-xs leading-snug transition-all duration-300 ${
                  question === q
                    ? "border-accent/30 bg-accent/8 text-accent/90"
                    : "border-accent/[0.07] bg-black/20 text-muted/45 hover:border-accent/18 hover:text-muted/70"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
          <div className="absolute inset-0 bg-black/35" />
          <div
            className="pointer-events-none absolute inset-0 rounded-md"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.05), inset 0 0 0 1px rgba(255,171,74,0.07)" }}
            aria-hidden
          />
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleAsk();
              }
            }}
            rows={3}
            disabled={loading}
            placeholder="Ask about the next Build, a product decision, or where to focus..."
            className="relative w-full resize-none bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground/80 placeholder:text-muted/30 focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.6rem] tracking-wide text-muted/30">
            {loading ? "Ember is listening..." : "Shift+Enter for new line · Enter to ask"}
          </p>
          <button
            type="button"
            onClick={() => void handleAsk()}
            disabled={!question.trim() || loading}
            className="group/ask relative overflow-hidden rounded-sm px-4 py-2 font-display text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background:
                question.trim() && !loading
                  ? "linear-gradient(135deg, rgba(255,171,74,0.18) 0%, rgba(77,216,255,0.12) 100%)"
                  : "rgba(255,255,255,0.02)",
              boxShadow:
                question.trim() && !loading
                  ? "inset 0 1px 0 rgba(255,171,74,0.15), 0 4px 16px rgba(0,0,0,0.3)"
                  : "inset 0 1px 0 rgba(255,171,74,0.04)",
              color: question.trim() && !loading ? "rgba(255,171,74,0.90)" : "rgba(255,171,74,0.35)",
              border:
                question.trim() && !loading
                  ? "1px solid rgba(255,171,74,0.14)"
                  : "1px solid rgba(255,171,74,0.06)",
            }}
          >
            <span className="relative z-10">{loading ? "Listening..." : "Ask Ember"}</span>
          </button>
        </div>
      </div>

      {error && !loading && (
        <div className="rounded-sm border border-accent/[0.07] bg-black/20 px-4 py-3">
          <p className="text-xs leading-relaxed text-muted/50">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ── MESSAGE BUBBLE ───────────────────────────────────────────────────────── */

function MessageBubble({
  message,
  index,
  onResolveProposal,
}: {
  message: EmberMessage;
  index: number;
  onResolveProposal: (index: number, status: "created" | "dismissed") => void;
}) {
  if (message.role === "user") {
    return (
      <p className="self-end max-w-[85%] rounded-md bg-white/[0.04] px-4 py-2.5 text-sm leading-relaxed text-foreground/80">
        {message.content}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-foreground/72">{message.content}</p>
      {message.proposal && message.proposalStatus === "pending" && (
        <ProposalCard proposal={message.proposal} onResolve={(status) => onResolveProposal(index, status)} />
      )}
      {message.proposal && message.proposalStatus === "created" && (
        <p className="text-xs text-accent-glow/70">
          ✓ Created {message.proposal.type === "quest" ? "Quest" : "Idea"} — &ldquo;{message.proposal.title}&rdquo;
        </p>
      )}
    </div>
  );
}

/* ── PROPOSAL CARD ────────────────────────────────────────────────────────── */

function ProposalCard({
  proposal,
  onResolve,
}: {
  proposal: EmberProposal;
  onResolve: (status: "created" | "dismissed") => void;
}) {
  const [questlineOptions, setQuestlineOptions] = useState<QuestlineSummary[]>([]);
  const [questlineId, setQuestlineId] = useState(proposal.questlineId ?? "");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (proposal.type !== "quest") return;
    getQuestlineOptions()
      .then((options) => {
        setQuestlineOptions(options);
        setQuestlineId((current) => current || options[0]?.id || "");
      })
      .catch(() => {
        // Leave the picker empty — the "no Questlines" message below covers it.
      });
  }, [proposal.type]);

  async function handleApprove() {
    setCreating(true);
    setCreateError(null);
    try {
      if (proposal.type === "idea") {
        await createIdea(proposal.title, proposal.description, "raw");
      } else {
        if (!questlineId) throw new Error("Choose a Questline first.");
        await createQuest(questlineId, proposal.title, proposal.description);
      }
      onResolve("created");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create this. Try again.");
      setCreating(false);
    }
  }

  return (
    <div className="space-y-3 rounded-md border border-accent-glow/20 bg-accent-glow/[0.04] p-4">
      <p className="font-display text-[0.55rem] tracking-[0.2em] uppercase text-accent-glow/70">
        Proposed {proposal.type === "quest" ? "Quest" : "Idea"}
      </p>
      <div>
        <p className="text-sm font-medium text-foreground/90">{proposal.title}</p>
        {proposal.description && <p className="mt-1 text-xs leading-relaxed text-muted/60">{proposal.description}</p>}
      </div>

      {proposal.type === "quest" &&
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

      {createError && <p className="text-xs text-[rgba(255,120,120,0.9)]">{createError}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleApprove()}
          disabled={creating || (proposal.type === "quest" && !questlineId)}
          className="rounded-sm px-3.5 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase text-accent-glow/85 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "rgba(77,216,255,0.12)", border: "1px solid rgba(77,216,255,0.25)" }}
        >
          {creating ? "Creating..." : "Approve & Create"}
        </button>
        <button
          type="button"
          onClick={() => onResolve("dismissed")}
          disabled={creating}
          className="rounded-sm px-3.5 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase text-muted/60 transition-colors duration-300 hover:text-foreground/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
