"use client";

import { useState } from "react";

/* ── TYPES ────────────────────────────────────────────────────────────────── */

interface EmberResponse {
  answer: string;
  recommendedDirection: string;
  smallestStep: string;
}

const SUGGESTED_QUESTIONS = [
  "What should the next Build be?",
  "Does this serve the Main Quest?",
  "Is this a Side Quest or part of the active Questline?",
  "What is the smallest useful next step?",
];

/* ── EMBER RESPONSE PROTOTYPE ─────────────────────────────────────────────── */

async function fetchEmberResponse(question: string): Promise<EmberResponse> {
  const res = await fetch("/api/ember", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error ?? "Ember could not answer right now. The fire is still burning.");
  }

  return {
    answer: data.answer,
    recommendedDirection: data.recommendedDirection,
    smallestStep: data.smallestStep,
  };
}

/* ── COMPANION HALL CLIENT ────────────────────────────────────────────────── */

export function CompanionHallClient() {
  return (
    <section className="animate-fade-up space-y-8" style={{ animationDelay: "0.24s" }}>
      <div className="flex items-center gap-3">
        <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">
          Companion
        </p>
        <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
      </div>

      <EmberCard />
    </section>
  );
}

/* ── EMBER CARD ───────────────────────────────────────────────────────────── */

function EmberCard() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<EmberResponse | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setAskedQuestion(trimmed);
    setQuestion("");
    setResponse(null);
    setError(null);
    setLoading(true);
    try {
      const result = await fetchEmberResponse(trimmed);
      setResponse(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ember could not answer right now. The fire is still burning."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(q: string) {
    setQuestion(q);
    setResponse(null);
    setError(null);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuestion(e.target.value);
    if (response) setResponse(null);
    if (error) setError(null);
  }

  return (
    <article className="relative flex flex-col overflow-hidden rounded-md border border-white/[0.07]">
      {/* Base */}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(11,20,35,0.94)] to-[rgba(6,9,16,0.97)]" />

      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top left, rgba(77,216,255,0.10) 0%, transparent 60%)" }}
        aria-hidden
      />

      {/* Inset ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.11), inset 0 0 0 1px rgba(255,171,74,0.05)" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-7">

        {/* Status row */}
        <div className="flex items-center gap-2">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-glow shadow-[0_0_10px_rgba(77,216,255,0.65)]" />
          </span>
          <span className="font-display text-[0.58rem] tracking-[0.22em] uppercase text-accent-glow/75">
            Awake
          </span>
        </div>

        {/* Name + role */}
        <div className="space-y-2">
          <h2 className="font-display text-2xl tracking-wide text-foreground">Ember</h2>
          <p className="text-xs leading-relaxed text-muted/60">
            Direction, decisions, prioritization and protection of the Freedom Engine vision.
          </p>
        </div>

        {/* ── CONSOLE ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 border-t border-accent/[0.07] pt-5">

          <div className="space-y-1">
            <h3 className="font-display text-lg tracking-wide text-foreground/90">Ask Ember</h3>
            <p className="text-xs text-muted/50">
              A quiet place to ask for direction before choosing the next Build.
            </p>
          </div>

          {/* Suggested questions */}
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

          {/* Input */}
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
                onChange={handleInputChange}
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
                  color:
                    question.trim() && !loading ? "rgba(255,171,74,0.90)" : "rgba(255,171,74,0.35)",
                  border:
                    question.trim() && !loading
                      ? "1px solid rgba(255,171,74,0.14)"
                      : "1px solid rgba(255,171,74,0.06)",
                }}
              >
                <span className="relative z-10">{loading ? "Listening..." : "Ask Ember"}</span>
                {question.trim() && !loading && (
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/ask:opacity-100"
                    style={{ background: "radial-gradient(ellipse at center, rgba(77,216,255,0.08) 0%, transparent 70%)" }}
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </div>

          {/* ── LOADING ──────────────────────────────────────────────────── */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              loading ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 px-1 py-2">
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow" />
              </span>
              <p className="text-xs text-muted/45 italic">Ember is listening...</p>
            </div>
          </div>

          {/* ── ERROR ────────────────────────────────────────────────────── */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              error && !loading ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {error && (
              <div className="rounded-sm border border-accent/[0.07] bg-black/20 px-4 py-3">
                <p className="text-xs leading-relaxed text-muted/50">{error}</p>
              </div>
            )}
          </div>

          {/* ── RESPONSE ─────────────────────────────────────────────────── */}
          <div
            className={`overflow-hidden transition-all duration-700 ${
              response && !loading ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {response && <EmberResponsePanel question={askedQuestion} response={response} />}
          </div>

        </div>
      </div>
    </article>
  );
}

/* ── EMBER RESPONSE PANEL ─────────────────────────────────────────────────── */

function EmberResponsePanel({ question, response }: { question: string; response: EmberResponse }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(8,14,24,0.97)] to-[rgba(4,6,11,0.99)]" />
      {/* Left accent bar */}
      <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-accent-glow/50 via-accent/25 to-transparent" />
      {/* Top glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top left, rgba(77,216,255,0.06) 0%, transparent 50%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.08), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 px-6 py-5 sm:px-7 sm:py-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_6px_rgba(77,216,255,0.6)]" />
            </span>
            <p className="font-display text-[0.58rem] tracking-[0.22em] uppercase text-accent-glow/65">
              Ember
            </p>
          </div>
          <p className="text-[0.55rem] italic text-muted/30 max-w-[55%] truncate">
            &ldquo;{question}&rdquo;
          </p>
        </div>

        <div className="h-px bg-linear-to-r from-accent/10 to-transparent" aria-hidden />

        {/* Ember's Answer */}
        <ResponseSection label="Ember's Answer">
          <p className="text-sm leading-relaxed text-foreground/72">{response.answer}</p>
        </ResponseSection>

        <div className="h-px bg-linear-to-r from-accent/7 to-transparent" aria-hidden />

        {/* Recommended Direction */}
        <ResponseSection label="Recommended Direction">
          <p className="text-sm leading-relaxed text-foreground/65">{response.recommendedDirection}</p>
        </ResponseSection>

        <div className="h-px bg-linear-to-r from-accent/7 to-transparent" aria-hidden />

        {/* Smallest Useful Step */}
        <ResponseSection label="Smallest Useful Step">
          <p className="text-sm leading-relaxed text-accent/78">{response.smallestStep}</p>
        </ResponseSection>

        {/* Constitution attribution */}
        <p className="pt-1 text-[0.55rem] tracking-[0.14em] text-muted/28 italic">
          Guided by the Founder Constitution.
        </p>

      </div>
    </div>
  );
}

/* ── RESPONSE SECTION ─────────────────────────────────────────────────────── */

function ResponseSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="font-display text-[0.52rem] tracking-[0.2em] uppercase text-muted/35">{label}</p>
      {children}
    </div>
  );
}
