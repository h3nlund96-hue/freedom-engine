"use client";

import { useEffect, useState } from "react";
import {
  type Idea,
  type IdeaStatus,
  getIdeas,
  createIdea,
  updateIdeaStatus,
  deleteIdea,
} from "../lib/ideaService";

/* ── STATUS CONFIG ───────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<IdeaStatus, { label: string; description: string }> = {
  raw: {
    label: "Raw Ideas",
    description: "Fresh thoughts captured before they are judged.",
  },
  "future-quest": {
    label: "Future Quests",
    description: "Ideas that may become real Quests later.",
  },
  "side-quest-candidate": {
    label: "Side Quest Candidates",
    description: "Smaller ideas that may support the main path.",
  },
  experiment: {
    label: "Experiments",
    description: "Things worth testing before a larger Build.",
  },
};

const STATUS_ORDER: IdeaStatus[] = [
  "raw",
  "future-quest",
  "side-quest-candidate",
  "experiment",
];

/* ── VAULT CLIENT ────────────────────────────────────────────────────────── */

export function VaultClient() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getIdeas()
      .then(setIdeas)
      .catch(() => setError("The Vault could not be opened. Try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSeal(text: string): Promise<boolean> {
    try {
      const idea = await createIdea(text);
      setIdeas((prev) => [idea, ...prev]);
      return true;
    } catch {
      return false;
    }
  }

  async function handleStatusChange(id: string, status: IdeaStatus) {
    // Optimistic update — feels instant.
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, status } : idea))
    );
    try {
      await updateIdeaStatus(id, status);
    } catch {
      // Roll back on failure.
      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id
            ? { ...idea, status: ideas.find((i) => i.id === id)?.status ?? idea.status }
            : idea
        )
      );
    }
  }

  async function handleDelete(id: string) {
    // Optimistic update.
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    try {
      await deleteIdea(id);
    } catch {
      // Restore on failure.
      const removed = ideas.find((i) => i.id === id);
      if (removed) setIdeas((prev) => [...prev, removed].sort(byNewest));
    }
  }

  return (
    <div className="space-y-12">
      <CaptureConsole onSeal={handleSeal} />

      <div className="space-y-5">
        <SectionLabel>The Vault</SectionLabel>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 px-1 py-4">
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent/40" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent/60" />
            </span>
            <p className="text-xs italic text-muted/40">Opening the Vault...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-accent/[0.06] bg-black/20 px-5 py-4">
            <p className="text-xs leading-relaxed text-muted/45">{error}</p>
          </div>
        )}

        {/* Compartments */}
        {!loading && !error && (
          <div className="space-y-4">
            {STATUS_ORDER.map((status) => {
              const compartmentIdeas = ideas
                .filter((i) => i.status === status)
                .sort(byNewest);
              return (
                <VaultCompartment
                  key={status}
                  status={status}
                  ideas={compartmentIdeas}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function byNewest(a: Idea, b: Idea) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

/* ── CAPTURE CONSOLE ─────────────────────────────────────────────────────── */

function CaptureConsole({ onSeal }: { onSeal: (text: string) => Promise<boolean> }) {
  const [value, setValue] = useState("");
  const [sealed, setSealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSeal() {
    if (!value.trim() || submitting) return;
    setSubmitting(true);
    setFailed(false);
    const success = await onSeal(value.trim());
    setSubmitting(false);

    if (success) {
      setSealed(true);
      setTimeout(() => {
        setValue("");
        setSealed(false);
      }, 1800);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 2600);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSeal();
  }

  return (
    <section className="space-y-3">
      <SectionLabel>Capture an Idea</SectionLabel>

      <div className="group relative overflow-hidden rounded-2xl transition-all duration-700">
        {/* Panel base */}
        <div className="absolute inset-0 bg-[rgba(4,6,11,0.82)]" />

        {/* Focus glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-focus-within:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(255,171,74,0.07) 0%, transparent 65%)",
          }}
          aria-hidden
        />

        {/* Sealed overlay */}
        {sealed && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
            style={{ background: "rgba(4,6,11,0.65)" }}
            aria-hidden
          >
            <span className="font-display text-sm tracking-[0.18em] uppercase text-accent/80">
              Sealed in the Vault ✦
            </span>
          </div>
        )}

        {/* Failed overlay */}
        {failed && (
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
            style={{ background: "rgba(4,6,11,0.65)" }}
            aria-hidden
          >
            <span className="font-display text-sm tracking-[0.18em] uppercase text-muted/70">
              The Vault could not seal this idea. Try again.
            </span>
          </div>
        )}

        {/* Ring */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-700"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,171,74,0.08), inset 0 0 0 1px rgba(255,171,74,0.05)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-focus-within:opacity-100"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,171,74,0.12), inset 0 0 0 1px rgba(255,171,74,0.10), 0 0 32px rgba(77,216,255,0.06)",
          }}
          aria-hidden
        />

        <div className="relative">
          <label htmlFor="idea-capture" className="sr-only">
            Capture an idea
          </label>
          <textarea
            id="idea-capture"
            rows={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write the idea before it disappears..."
            disabled={sealed || submitting}
            className="w-full resize-none bg-transparent px-5 pb-3 pt-5 text-sm leading-relaxed text-foreground/90 placeholder:text-muted/30 focus:outline-none sm:text-base"
          />

          {/* Console footer */}
          <div className="flex items-center justify-between gap-4 border-t border-accent/[0.07] px-5 py-3">
            <p className="text-xs text-muted/35">
              {sealed
                ? "Idea sealed."
                : submitting
                ? "Sealing..."
                : value.trim()
                ? "⌘ + Enter to seal"
                : "No sorting required. Just capture it."}
            </p>
            <button
              type="button"
              onClick={handleSeal}
              disabled={!value.trim() || sealed || submitting}
              className="group/btn relative overflow-hidden rounded-lg px-4 py-1.5 transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:shadow-[0_0_20px_rgba(255,171,74,0.10)]"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,171,74,0.10), rgba(255,171,74,0.06))",
                boxShadow: "inset 0 1px 0 rgba(255,171,74,0.09)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-accent/8 to-transparent opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"
                aria-hidden
              />
              <span className="relative font-display text-[0.65rem] tracking-[0.15em] uppercase text-accent/70 group-hover/btn:text-accent/90">
                {submitting ? "Sealing..." : "Seal in the Vault"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-[0.65rem] text-muted/35">
        Ideas now sync through Founder Login.
      </p>
    </section>
  );
}

/* ── VAULT COMPARTMENT ───────────────────────────────────────────────────── */

function VaultCompartment({
  status,
  ideas,
  onStatusChange,
  onDelete,
}: {
  status: IdeaStatus;
  ideas: Idea[];
  onStatusChange: (id: string, status: IdeaStatus) => void;
  onDelete: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[status];
  const count = ideas.length;
  const hasItems = count > 0;

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(9,15,24,0.90)] to-[rgba(6,8,14,0.88)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/15 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,171,74,0.06), inset 0 0 0 1px rgba(255,171,74,0.03)",
        }}
        aria-hidden
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div>
            <h3
              className={`font-display text-sm tracking-wide ${
                hasItems ? "text-foreground/85" : "text-foreground/40"
              }`}
            >
              {cfg.label}
            </h3>
            <p
              className={`mt-0.5 text-xs leading-relaxed ${
                hasItems ? "text-muted/50" : "text-muted/28"
              }`}
            >
              {cfg.description}
            </p>
          </div>
          <span
            className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 font-display text-[0.58rem] tracking-wider ${
              hasItems ? "bg-accent/12 text-accent/70" : "bg-muted/5 text-muted/28"
            }`}
          >
            {count}
          </span>
        </div>

        {/* Ideas */}
        {hasItems && (
          <ul className="space-y-1 border-t border-accent/[0.05] px-4 pb-3 pt-2">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}

        {/* Empty */}
        {!hasItems && (
          <p className="border-t border-accent/[0.04] px-5 py-3 text-[0.65rem] italic text-muted/28">
            Empty
          </p>
        )}
      </div>
    </div>
  );
}

/* ── IDEA CARD ───────────────────────────────────────────────────────────── */

function IdeaCard({
  idea,
  onStatusChange,
  onDelete,
}: {
  idea: Idea;
  onStatusChange: (id: string, status: IdeaStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="group flex flex-col gap-2.5 rounded-lg px-3 py-3 transition-colors duration-300 hover:bg-[rgba(255,171,74,0.03)]">
      <div className="flex items-start gap-2.5">
        <span
          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent/30 shadow-[0_0_5px_rgba(255,171,74,0.2)]"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-foreground/70">{idea.text}</p>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <div className="relative">
          <select
            value={idea.status}
            onChange={(e) => onStatusChange(idea.id, e.target.value as IdeaStatus)}
            aria-label="Move to compartment"
            className="cursor-pointer appearance-none rounded-md bg-[rgba(255,171,74,0.05)] py-1 pl-2.5 pr-6 font-display text-[0.6rem] tracking-[0.12em] uppercase text-accent/55 outline-none transition-colors duration-300 hover:bg-[rgba(255,171,74,0.08)] hover:text-accent/75 focus:outline-none"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.5rem] text-accent/40"
            aria-hidden
          >
            ▾
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDelete(idea.id)}
          aria-label="Remove idea"
          className="rounded font-display text-[0.6rem] tracking-[0.12em] uppercase text-muted/35 transition-colors duration-300 hover:text-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30"
        >
          remove
        </button>
      </div>
    </li>
  );
}

/* ── SECTION LABEL ───────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">
        {children}
      </p>
      <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
    </div>
  );
}
