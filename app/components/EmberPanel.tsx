"use client";

import { useEffect, useRef, useState } from "react";
import { useEmberConversation, type EmberMessage } from "../lib/emberConversation";
import { getProgressClient } from "../lib/questMutationService";
import { getActiveQuest, getCurrentBuild } from "../data/freedomEngineProgress";
import { buildSuggestedQuestions, type ActiveInfo } from "../lib/emberSuggestions";
import { pairHistory } from "../lib/emberHistory";
import { ProposalCard, successLabel } from "./EmberProposalCard";
import { EmberGlyph } from "./EmberGlyph";
import { useTypewriterReveal } from "../lib/useTypewriterReveal";
import { useEmberRealtime } from "../lib/useEmberRealtime";

/**
 * The Ember console inside the floating widget's popup on HQ, Quest Board
 * and Idea Vault — the same experience as Hall of Embers (current exchange,
 * typewriter reveal, Presence mode voice), scaled down to fit a compact
 * panel instead of a full page. Shares the same EmberProvider context, so
 * it's the same ongoing conversation either way.
 */
export function EmberPanel() {
  const { messages, loading, error, ask, resolveProposal, clearConversation, appendExchanges } =
    useEmberConversation();
  const [question, setQuestion] = useState("");
  const [activeInfo, setActiveInfo] = useState<ActiveInfo | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [presenceMode, setPresenceMode] = useState(false);

  const {
    connected,
    connecting,
    error: voiceError,
    talking,
    listening,
    liveCaption,
    pendingToolCall,
    connect,
    disconnect,
    sendText,
    resolveToolCall,
  } = useEmberRealtime();

  const appendExchangesRef = useRef(appendExchanges);
  useEffect(() => {
    appendExchangesRef.current = appendExchanges;
  }, [appendExchanges]);

  useEffect(() => {
    if (!presenceMode) return;
    void connect();
    return () => {
      const transcript = disconnect();
      if (transcript.length > 0) appendExchangesRef.current(transcript);
    };
  }, [presenceMode, connect, disconnect]);

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
  const speaking = presenceMode ? talking : loading || revealing;

  const suggestedQuestions = buildSuggestedQuestions(activeInfo);

  async function handleAsk() {
    if (!question.trim() || loading) return;
    const q = question;
    setQuestion("");
    await ask(q);
  }

  function handleSendPresenceText() {
    if (!question.trim() || !connected) return;
    sendText(question);
    setQuestion("");
  }

  const presenceStatus = connecting
    ? "Connecting…"
    : connected && listening
    ? "Listening…"
    : connected && talking
    ? "Speaking…"
    : connected
    ? "Awake"
    : "";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2.5">
        <EmberGlyph speaking={speaking} className="h-24 w-24" />
        {presenceMode ? (
          <span className="inline-flex items-center gap-1.5 font-display text-[0.55rem] tracking-[0.2em] uppercase text-accent-glow/75">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(77,216,255,0.65)]" />
            </span>
            {presenceStatus}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setPresenceMode(true)}
            title="Talk to Ember live — voice, not typing"
            className="font-display text-[0.55rem] tracking-[0.16em] uppercase text-muted/30 transition-colors duration-300 hover:text-accent-glow/60"
          >
            Presence mode
          </button>
        )}
      </div>

      {presenceMode ? (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            {voiceError ? (
              <p className="text-sm text-muted/50">{voiceError}</p>
            ) : liveCaption ? (
              <p className="text-sm leading-relaxed text-foreground/90">{liveCaption}</p>
            ) : null}

            {pendingToolCall && (
              <div className="w-full text-left">
                <ProposalCard
                  proposal={pendingToolCall.proposal}
                  onResolve={(status) => resolveToolCall(pendingToolCall.callId, status)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 border-b border-accent-glow/15 pb-2.5">
            <span className="font-display text-accent-glow/75" aria-hidden>
              ›
            </span>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendPresenceText();
                }
              }}
              disabled={!connected}
              placeholder={connected ? "Or type instead of talking…" : "Connecting…"}
              className="flex-1 bg-transparent text-sm text-foreground/85 placeholder:text-muted/35 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="button"
            onClick={() => setPresenceMode(false)}
            className="self-center font-display text-[0.6rem] tracking-[0.14em] uppercase text-muted/40 transition-colors duration-300 hover:text-foreground/80"
          >
            ✕ Exit presence mode
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            {currentQuestion && (
              <p className="font-display text-xs italic text-accent/60">&ldquo;{currentQuestion}&rdquo;</p>
            )}

            {currentAnswerMsg ? (
              <p className="text-base leading-relaxed text-foreground/92">
                {revealed}
                {revealing && (
                  <span
                    className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent-glow align-text-bottom"
                    aria-hidden
                  />
                )}
              </p>
            ) : loading ? (
              <p className="text-sm text-muted/50">Ember is listening…</p>
            ) : (
              <p className="text-sm leading-relaxed text-muted/50">
                A quiet place to ask for direction before choosing the next Build.
              </p>
            )}

            {currentAnswerMsg?.proposal && currentAnswerMsg.proposalStatus === "pending" && !revealing && (
              <div className="w-full text-left">
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

          <div className="flex flex-wrap justify-center gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestion(q)}
                className={`rounded-full border px-3 py-1.5 font-display text-[0.6rem] tracking-wide transition-all duration-300 ${
                  question === q
                    ? "border-accent-glow/30 bg-accent-glow/10 text-accent-glow/90"
                    : "border-accent-glow/[0.1] bg-surface-sunken text-foreground/75 hover:border-accent-glow/25 hover:text-foreground"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 font-display text-[0.6rem] tracking-[0.14em] uppercase text-muted/40 transition-colors duration-300 hover:text-accent-glow/70"
              >
                Earlier in this session
                <span
                  className={`inline-block transition-transform duration-300 ${historyOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ⌄
                </span>
              </button>
              {historyOpen && (
                <div className="flex w-full flex-col gap-3">
                  {history.map((h, i) => (
                    <div key={i} className="border-b border-card-border pb-2.5 text-left text-xs leading-relaxed text-muted/55">
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
          )}

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex w-full items-center gap-2.5 border-b border-accent-glow/15 pb-2.5">
              <span className="font-display text-accent-glow/75" aria-hidden>
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
                title="Talk to Ember live"
                className="font-display text-sm text-muted/30 transition-colors duration-300 hover:text-accent-glow/60"
              >
                )))
              </button>
            </div>

            {messages.length > 0 && (
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
        </>
      )}
    </div>
  );
}
