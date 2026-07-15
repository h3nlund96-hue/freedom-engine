"use client";

import { useEffect, useRef, useState } from "react";
import { useEmberConversation, type EmberMessage } from "../lib/emberConversation";
import { getProgressClient } from "../lib/questMutationService";
import { getActiveQuest, getCurrentBuild } from "../data/freedomEngineProgress";
import { buildSuggestedQuestions, type ActiveInfo } from "../lib/emberSuggestions";
import { ProposalCard, successLabel } from "./EmberProposalCard";

/** The compact Ember ask console used inside the floating widget on HQ,
 * Quest Board and Idea Vault. Hall of Embers has its own full-room
 * experience (see EmberRoom) but shares the same EmberProvider context,
 * so it's the same conversation either way. */
export function EmberPanel() {
  const { messages, loading, error, ask, resolveProposal, clearConversation } = useEmberConversation();
  const [question, setQuestion] = useState("");
  const [activeInfo, setActiveInfo] = useState<ActiveInfo | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProgressClient()
      .then((progress) => {
        const quest = getActiveQuest(progress);
        const build = quest ? getCurrentBuild(quest) : undefined;
        setActiveInfo({ questTitle: quest?.title, buildTitle: build?.title });
      })
      .catch(() => {
        // Leave null — the generic suggestions below still work fine.
      });
  }, []);

  useEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const suggestedQuestions = buildSuggestedQuestions(activeInfo);

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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg tracking-wide text-foreground/90">Ask Ember</h3>
          <p className="text-xs text-muted/50">
            A quiet place to ask for direction before choosing the next Build.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearConversation}
            className="shrink-0 rounded-sm px-2.5 py-1 font-display text-[0.6rem] tracking-[0.12em] uppercase text-muted/40 transition-colors duration-300 hover:text-accent-glow/70"
          >
            New conversation
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div ref={historyRef} className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-1">
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
            {suggestedQuestions.map((q) => (
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
        <p className="text-xs text-accent-glow/70">{successLabel(message.proposal)}</p>
      )}
    </div>
  );
}
