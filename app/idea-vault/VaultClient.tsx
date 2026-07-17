"use client";

import { useEffect, useState } from "react";
import {
  type Idea,
  type IdeaStatus,
  type ConvertedToType,
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  convertIdeaToQuest,
  convertIdeaToSideQuest,
} from "../lib/ideaService";
import { getQuestlineOptions, type QuestlineSummary } from "../lib/questMutationService";
import { onEmberEvent } from "../lib/emberEvents";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { IdeaDetailModal } from "./IdeaDetailModal";

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
  const [questlineOptions, setQuestlineOptions] = useState<QuestlineSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Idea | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([getIdeas(), getQuestlineOptions().catch(() => [])])
      .then(([ideaList, questlines]) => {
        setIdeas(ideaList);
        setQuestlineOptions(questlines);
      })
      .catch(() => setError("The Vault could not be opened. Try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  // Ember can capture an Idea (or convert one into a Quest/Side Quest) from
  // the floating widget or Hall of Embers — entirely outside this
  // component's own buttons. No loading state here: this is a silent
  // background refresh, not the initial open.
  useEffect(() => {
    return onEmberEvent((detail) => {
      if (detail.kind !== "quest_system_changed") return;
      Promise.all([getIdeas(), getQuestlineOptions().catch(() => [])])
        .then(([ideaList, questlines]) => {
          setIdeas(ideaList);
          setQuestlineOptions(questlines);
        })
        .catch(() => {
          // Keep showing the last known state — the next successful event will catch up.
        });
    });
  }, []);

  async function handleSeal(title: string, description: string, status: IdeaStatus): Promise<boolean> {
    try {
      const idea = await createIdea(title, description, status);
      setIdeas((prev) => [idea, ...prev]);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSaveIdea(fields: { title: string; description: string; status: IdeaStatus }) {
    if (!selectedIdea) return;
    const updated = await updateIdea(selectedIdea.id, fields);
    setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedIdea(updated);
  }

  async function handleConvert(
    type: ConvertedToType,
    questlineId: string | null,
    title: string,
    description: string
  ) {
    if (!selectedIdea) return;
    const result =
      type === "quest" && questlineId
        ? await convertIdeaToQuest(selectedIdea.id, questlineId, title, description)
        : await convertIdeaToSideQuest(selectedIdea.id, title, description);
    const updated: Idea = {
      ...selectedIdea,
      title,
      description,
      convertedAt: new Date().toISOString(),
      convertedToType: type,
      convertedToId: result.id,
    };
    setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedIdea(updated);
  }

  function handleRequestDelete(idea: Idea) {
    setDeleteTarget(idea);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteIdea(deleteTarget.id);
      setIdeas((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      if (selectedIdea?.id === deleteTarget.id) setSelectedIdea(null);
      setDeleteTarget(null);
    } catch {
      // Leave the dialog open so the Founder can retry.
    } finally {
      setDeleting(false);
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
            <p className="text-xs italic text-muted/55">Opening the Vault...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-md border border-accent/[0.06] bg-surface-sunken px-5 py-4">
            <p className="text-xs leading-relaxed text-foreground/80">{error}</p>
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
                  onSelect={setSelectedIdea}
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          questlineOptions={questlineOptions}
          onClose={() => setSelectedIdea(null)}
          onSave={handleSaveIdea}
          onDelete={() => handleRequestDelete(selectedIdea)}
          onConvert={handleConvert}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this idea?"
          message={`"${deleteTarget.title}" will be permanently removed from the Vault. This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function byNewest(a: Idea, b: Idea) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

/* ── CAPTURE CONSOLE ─────────────────────────────────────────────────────── */

function CaptureConsole({
  onSeal,
}: {
  onSeal: (title: string, description: string, status: IdeaStatus) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IdeaStatus>("raw");
  const [sealed, setSealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSeal() {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    setFailed(false);
    const success = await onSeal(title.trim(), description.trim(), status);
    setSubmitting(false);

    if (success) {
      setSealed(true);
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setStatus("raw");
        setSealed(false);
      }, 1800);
    } else {
      setFailed(true);
      setTimeout(() => setFailed(false), 2600);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSeal();
  }

  return (
    <section className="space-y-3">
      <SectionLabel>Capture an Idea</SectionLabel>

      <div className="group relative overflow-hidden rounded-md border border-card-border transition-all duration-700">
        {/* Panel base */}
        <div className="absolute inset-0 bg-surface" />

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
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md"
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
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md"
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
          className="pointer-events-none absolute inset-0 rounded-md transition-all duration-700"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,171,74,0.08), inset 0 0 0 1px rgba(255,171,74,0.05)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-700 group-focus-within:opacity-100"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,171,74,0.12), inset 0 0 0 1px rgba(255,171,74,0.10), 0 0 32px rgba(77,216,255,0.06)",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col gap-3 px-5 pb-3 pt-5">
          <label htmlFor="idea-capture-title" className="sr-only">
            Idea title
          </label>
          <input
            id="idea-capture-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write the idea before it disappears..."
            disabled={sealed || submitting}
            className="w-full bg-transparent text-base font-medium text-foreground/90 placeholder:text-muted/30 placeholder:font-normal focus:outline-none"
          />

          <label htmlFor="idea-capture-description" className="sr-only">
            Idea description
          </label>
          <textarea
            id="idea-capture-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add more detail (optional)..."
            disabled={sealed || submitting}
            className="w-full resize-none bg-transparent text-base sm:text-xs leading-relaxed text-foreground/70 placeholder:text-muted/25 focus:outline-none"
          />

          {/* Console footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-accent/[0.07] pt-3">
            <div className="flex items-center gap-3">
              <label htmlFor="idea-capture-status" className="sr-only">
                Idea status
              </label>
              <select
                id="idea-capture-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                disabled={sealed || submitting}
                className="cursor-pointer rounded-sm bg-[rgba(255,171,74,0.05)] px-2.5 py-1 font-display text-base sm:text-[0.6rem] tracking-[0.1em] uppercase text-accent/60 outline-none transition-colors duration-300 hover:bg-[rgba(255,171,74,0.08)] hover:text-accent/80 focus:outline-none disabled:opacity-50"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted/55">
                {sealed
                  ? "Idea sealed."
                  : submitting
                  ? "Sealing..."
                  : "⌘ + Enter to seal"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeal}
              disabled={!title.trim() || sealed || submitting}
              className="group/btn relative overflow-hidden rounded-sm px-4 py-1.5 transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:shadow-[0_0_20px_rgba(255,171,74,0.10)]"
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

      <p className="text-[0.65rem] text-muted/50">
        Ideas now sync through Founder Login.
      </p>
    </section>
  );
}

/* ── VAULT COMPARTMENT ───────────────────────────────────────────────────── */

function VaultCompartment({
  status,
  ideas,
  onSelect,
}: {
  status: IdeaStatus;
  ideas: Idea[];
  onSelect: (idea: Idea) => void;
}) {
  const cfg = STATUS_CONFIG[status];
  const count = ideas.length;
  const hasItems = count > 0;

  return (
    <div className="relative overflow-hidden rounded-md border border-card-border">
      <div className="absolute inset-0 bg-linear-to-br from-surface-raised/90 to-surface/88" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/15 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
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
                hasItems ? "text-foreground/85" : "text-foreground/60"
              }`}
            >
              {cfg.label}
            </h3>
            <p
              className={`mt-0.5 text-xs leading-relaxed ${
                hasItems ? "text-muted/60" : "text-muted/50"
              }`}
            >
              {cfg.description}
            </p>
          </div>
          <span
            className={`mt-0.5 shrink-0 rounded-sm px-2 py-0.5 font-display text-[0.58rem] tracking-wider ${
              hasItems ? "bg-accent/12 text-accent/70" : "bg-muted/10 text-foreground/65"
            }`}
          >
            {count}
          </span>
        </div>

        {/* Ideas */}
        {hasItems && (
          <ul className="space-y-1 border-t border-accent/[0.05] px-4 pb-3 pt-2">
            {ideas.map((idea) => (
              <IdeaRow key={idea.id} idea={idea} onSelect={onSelect} />
            ))}
          </ul>
        )}

        {/* Empty */}
        {!hasItems && (
          <p className="border-t border-accent/[0.04] px-5 py-3 text-[0.65rem] italic text-muted/45">
            Empty
          </p>
        )}
      </div>
    </div>
  );
}

/* ── IDEA ROW ─────────────────────────────────────────────────────────────── */

function IdeaRow({ idea, onSelect }: { idea: Idea; onSelect: (idea: Idea) => void }) {
  const converted = idea.convertedToType !== null;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(idea)}
        className="group flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left transition-colors duration-300 hover:bg-[rgba(255,171,74,0.04)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30"
      >
        <span
          className="size-1.5 shrink-0 rounded-full bg-accent/30 shadow-[0_0_5px_rgba(255,171,74,0.2)]"
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-sm leading-relaxed text-foreground/75 group-hover:text-foreground/90">
          {idea.title}
        </span>
        {converted && (
          <span className="shrink-0 rounded-sm bg-accent-glow/10 px-1.5 py-0.5 font-display text-[0.55rem] tracking-wide uppercase text-accent-glow/70">
            {idea.convertedToType === "quest" ? "→ Quest" : "→ Side Quest"}
          </span>
        )}
      </button>
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
