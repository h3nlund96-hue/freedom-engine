"use client";

/**
 * Shared Ember conversation state.
 *
 * Mounted once at the root layout so the same conversation follows The
 * Founder across HQ, Quest Board, Idea Vault and Companion Hall — asking
 * something on one page and continuing it on another just works. Persisted
 * to sessionStorage so it also survives a hard refresh within the tab.
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";

/* ── TYPES ────────────────────────────────────────────────────────────────── */

export interface EmberProposal {
  type: "quest" | "idea";
  title: string;
  description: string;
  questlineId: string | null;
}

export interface EmberMessage {
  role: "user" | "assistant";
  content: string;
  proposal?: EmberProposal | null;
  proposalStatus?: "pending" | "created" | "dismissed";
}

interface EmberConversationValue {
  messages: EmberMessage[];
  loading: boolean;
  error: string | null;
  ask: (question: string) => Promise<void>;
  resolveProposal: (index: number, status: "created" | "dismissed") => void;
}

const EmberConversationContext = createContext<EmberConversationValue | null>(null);

const STORAGE_KEY = "ember-conversation";
// Only this many recent messages get resent to the API each turn — keeps
// token cost from growing unbounded over a long session.
const MAX_HISTORY_MESSAGES = 12;

/* ── PROVIDER ─────────────────────────────────────────────────────────────── */

export function EmberProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<EmberMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Reading sessionStorage must happen after mount (it's unavailable during
  // server rendering) — starting both server and client's first render from
  // an empty array avoids a hydration mismatch, at the cost of a brief flash
  // before the stored conversation appears.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from a client-only store, not syncing derived state
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      // Corrupt or unavailable storage — start with an empty conversation.
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage may be full or unavailable — conversation still works in-memory.
    }
  }, [messages]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const history = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, history }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Ember could not answer right now. The fire is still burning.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          proposal: data.proposal ?? null,
          proposalStatus: data.proposal ? "pending" : undefined,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ember could not answer right now. The fire is still burning."
      );
    } finally {
      setLoading(false);
    }
  }

  function resolveProposal(index: number, status: "created" | "dismissed") {
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, proposalStatus: status } : m)));
  }

  return (
    <EmberConversationContext.Provider value={{ messages, loading, error, ask, resolveProposal }}>
      {children}
    </EmberConversationContext.Provider>
  );
}

/* ── HOOK ─────────────────────────────────────────────────────────────────── */

export function useEmberConversation(): EmberConversationValue {
  const ctx = useContext(EmberConversationContext);
  if (!ctx) throw new Error("useEmberConversation must be used inside an EmberProvider.");
  return ctx;
}
