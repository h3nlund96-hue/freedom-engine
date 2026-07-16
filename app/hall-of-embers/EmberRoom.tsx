"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEmberConversation, type EmberMessage } from "../lib/emberConversation";
import { EmberGlyph } from "../components/EmberGlyph";
import { ProposalCard, successLabel } from "../components/EmberProposalCard";
import { getProgressClient } from "../lib/questMutationService";
import { getActiveQuest, getCurrentBuild } from "../data/freedomEngineProgress";
import { buildSuggestedQuestions, type ActiveInfo } from "../lib/emberSuggestions";
import { useTypewriterReveal } from "../lib/useTypewriterReveal";
import { useEmberSpeech } from "../lib/useEmberSpeech";

/**
 * Ember's own room — not a console bolted onto a page. Only the most recent
 * exchange is ever on screen; everything before it lives behind the
 * collapsed "Earlier in this session" drawer. Her glyph reacts while she's
 * "speaking" — the typed reveal of her answer, and (voice on) actually
 * hearing her (useEmberSpeech). Presence mode grows that glyph to fill the
 * screen. Talking back to her — the other half of voice chat — isn't built
 * yet, so asking Ember something still means typing while it's open.
 */

interface Exchange {
  question: string;
  answer: string;
}

function pairHistory(messages: EmberMessage[]): Exchange[] {
  const pairs: Exchange[] = [];
  let i = 0;
  while (i < messages.length) {
    const m = messages[i];
    if (m.role === "user" && messages[i + 1]?.role === "assistant") {
      pairs.push({ question: m.content, answer: messages[i + 1].content });
      i += 2;
    } else {
      i += 1;
    }
  }
  return pairs;
}

export function EmberRoom() {
  const { messages, loading, error, ask, resolveProposal, clearConversation } = useEmberConversation();
  const [question, setQuestion] = useState("");
  const [activeInfo, setActiveInfo] = useState<ActiveInfo | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [presenceMode, setPresenceMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

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

  const lastMsg = messages[messages.length - 1];
  const secondLastMsg = messages[messages.length - 2];

  let currentQuestion: string | undefined;
  let currentAnswerMsg: EmberMessage | undefined;
  let currentAnswerIndex = -1;

  if (lastMsg?.role === "assistant") {
    currentAnswerMsg = lastMsg;
    currentAnswerIndex = messages.length - 1;
    currentQuestion = secondLastMsg?.role === "user" ? secondLastMsg.content : undefined;
  } else if (lastMsg?.role === "user") {
    currentQuestion = lastMsg.content;
  }

  const earlierCount = currentAnswerMsg ? messages.length - 2 : lastMsg ? messages.length - 1 : 0;
  const history = pairHistory(messages.slice(0, Math.max(earlierCount, 0)));

  const { revealed, speaking: revealing } = useTypewriterReveal(currentAnswerMsg?.content ?? "");
  const { speaking: talking, blocked: voiceBlocked, retry: retryVoice } = useEmberSpeech(
    currentAnswerMsg?.content ?? "",
    voiceEnabled
  );
  const speaking = loading || revealing || talking;

  const suggestedQuestions = buildSuggestedQuestions(activeInfo);

  async function handleAsk() {
    if (!question.trim() || loading) return;
    const q = question;
    setQuestion("");
    await ask(q);
  }

  return (
    <div
      className={`relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-7 px-6 py-10 sm:px-8 ${
        presenceMode ? "justify-center" : ""
      }`}
    >
      {presenceMode && (
        <button
          type="button"
          onClick={() => setPresenceMode(false)}
          className="fixed right-5 top-5 z-40 rounded-full border border-white/10 bg-black/50 px-3.5 py-2 font-display text-[0.6rem] tracking-[0.14em] uppercase text-muted/70 backdrop-blur-sm transition-colors duration-300 hover:text-foreground/90"
        >
          ✕ Exit presence mode
        </button>
      )}

      {/* chrome: back link + wordmark — recedes in presence mode */}
      <div
        className={`flex w-full flex-col items-start gap-1 transition-opacity duration-300 ${
          presenceMode ? "pointer-events-none h-0 overflow-hidden opacity-0" : "opacity-100"
        }`}
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs text-muted/60 transition-colors duration-300 hover:text-accent-glow"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
            ←
          </span>
          <span className="font-display tracking-[0.18em] uppercase">AI Mastery HQ</span>
        </Link>
        <span className="font-display text-[0.6rem] tracking-[0.24em] uppercase text-muted/35">
          Hall of Embers · Council Chamber
        </span>
      </div>

      {/* presence */}
      <div className={`flex flex-col items-center gap-3 ${presenceMode ? "flex-1 justify-center" : "pt-2"}`}>
        <EmberGlyph
          speaking={speaking}
          className={presenceMode ? "h-[min(58vw,58vh)] w-[min(58vw,58vh)]" : "h-28 w-28 sm:h-32 sm:w-32"}
        />
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-display text-lg tracking-wide text-foreground">Ember</h1>
          <span className="inline-flex items-center gap-1.5 font-display text-[0.55rem] tracking-[0.2em] uppercase text-accent-glow/75">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(77,216,255,0.65)]" />
            </span>
            Awake
          </span>
          {!presenceMode && (
            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPresenceMode(true)}
                title="A calmer, focused view — voice will live here later"
                className="font-display text-[0.55rem] tracking-[0.16em] uppercase text-muted/30 transition-colors duration-300 hover:text-accent-glow/60"
              >
                Presence mode
              </button>
              <button
                type="button"
                onClick={() => setVoiceEnabled((v) => !v)}
                title={voiceEnabled ? "Ember speaks her answers aloud" : "Ember's voice is muted"}
                className="font-display text-[0.55rem] tracking-[0.16em] uppercase text-muted/30 transition-colors duration-300 hover:text-accent-glow/60"
              >
                {voiceEnabled ? "🔊 Voice on" : "🔈 Voice off"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* the current exchange — flowing text, not a chat log */}
      <div className="flex w-full max-w-lg flex-col items-center gap-4 text-center">
        {currentQuestion && !presenceMode && (
          <p className="font-display text-xs italic text-accent/60">&ldquo;{currentQuestion}&rdquo;</p>
        )}

        {currentAnswerMsg ? (
          <p
            className={`leading-relaxed text-foreground/92 ${
              presenceMode ? "text-lg sm:text-xl" : "text-base"
            }`}
          >
            {revealed}
            {revealing && (
              <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent-glow align-text-bottom" aria-hidden />
            )}
          </p>
        ) : loading ? (
          <p className="text-sm text-muted/50">Ember is listening…</p>
        ) : null}

        {voiceEnabled && voiceBlocked && currentAnswerMsg && (
          <button
            type="button"
            onClick={retryVoice}
            className="font-display text-[0.6rem] tracking-[0.1em] uppercase text-muted/40 underline decoration-dotted underline-offset-4 transition-colors duration-300 hover:text-accent-glow/70"
          >
            🔊 Tap to hear this
          </button>
        )}

        {currentAnswerMsg?.proposal && currentAnswerMsg.proposalStatus === "pending" && !revealing && (
          <div className="w-full max-w-sm text-left">
            <ProposalCard
              proposal={currentAnswerMsg.proposal}
              onResolve={(status) => resolveProposal(currentAnswerIndex, status)}
            />
          </div>
        )}
        {currentAnswerMsg?.proposal && currentAnswerMsg.proposalStatus === "created" && (
          <p className="text-xs text-accent-glow/70">{successLabel(currentAnswerMsg.proposal)}</p>
        )}
      </div>

      {/* suggestions + history — recede in presence mode */}
      <div
        className={`flex w-full flex-col items-center gap-4 transition-opacity duration-300 ${
          presenceMode ? "pointer-events-none h-0 overflow-hidden opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex flex-wrap justify-center gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuestion(q)}
              className={`rounded-full border px-3 py-1.5 font-display text-[0.65rem] tracking-wide transition-all duration-300 ${
                question === q
                  ? "border-accent-glow/30 bg-accent-glow/10 text-accent-glow/90"
                  : "border-accent-glow/[0.1] bg-black/20 text-muted/50 hover:border-accent-glow/25 hover:text-muted/75"
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 font-display text-[0.6rem] tracking-[0.14em] uppercase text-muted/40 transition-colors duration-300 hover:text-accent-glow/70"
          >
            Earlier in this session
            <span className={`inline-block transition-transform duration-300 ${historyOpen ? "rotate-180" : ""}`} aria-hidden>
              ⌄
            </span>
          </button>
        )}
        {historyOpen && (
          <div className="flex w-full max-w-lg flex-col gap-3">
            {history.map((h, i) => (
              <div key={i} className="border-b border-white/[0.05] pb-2.5 text-left text-xs leading-relaxed text-muted/55">
                <p>
                  <span className="font-medium text-muted/80">You —</span> {h.question}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-muted/80">Ember —</span> {h.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* command line — always available, even in presence mode */}
      <div className="mt-auto flex w-full max-w-lg flex-col items-center gap-2.5">
        <div className="flex w-full items-center gap-2.5 border-b border-accent-glow/15 pb-2.5">
          <span className="font-display text-accent-glow/50" aria-hidden>
            ›
          </span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleAsk();
              }
            }}
            disabled={loading}
            placeholder="Ask Ember, or just start talking…"
            className="flex-1 bg-transparent text-sm text-foreground/85 placeholder:text-muted/35 focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setPresenceMode(true)}
            title="Voice — coming soon"
            className="font-display text-sm text-muted/30 transition-colors duration-300 hover:text-accent-glow/60"
          >
            )))
          </button>
        </div>

        {!presenceMode && messages.length > 0 && (
          <button
            type="button"
            onClick={clearConversation}
            className="font-display text-[0.6rem] tracking-[0.12em] uppercase text-muted/35 transition-colors duration-300 hover:text-accent-glow/70"
          >
            New conversation
          </button>
        )}

        {error && !loading && <p className="text-xs leading-relaxed text-muted/50">{error}</p>}
      </div>
    </div>
  );
}
