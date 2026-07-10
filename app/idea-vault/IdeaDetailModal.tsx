"use client";

import { useState } from "react";
import {
  type Idea,
  type IdeaStatus,
  type ConvertedToType,
  defaultConvertTarget,
} from "../lib/ideaService";
import type { QuestlineSummary } from "../lib/questMutationService";

const STATUS_LABELS: Record<IdeaStatus, string> = {
  raw: "Raw Ideas",
  "future-quest": "Future Quests",
  "side-quest-candidate": "Side Quest Candidates",
  experiment: "Experiments",
};

const STATUS_ORDER: IdeaStatus[] = [
  "raw",
  "future-quest",
  "side-quest-candidate",
  "experiment",
];

type IdeaDetailModalProps = {
  idea: Idea;
  questlineOptions: QuestlineSummary[];
  onClose: () => void;
  onSave: (fields: { title: string; description: string; status: IdeaStatus }) => Promise<void>;
  onDelete: () => void;
  onConvert: (
    type: ConvertedToType,
    questlineId: string | null,
    title: string,
    description: string
  ) => Promise<void>;
};

export function IdeaDetailModal({
  idea,
  questlineOptions,
  onClose,
  onSave,
  onDelete,
  onConvert,
}: IdeaDetailModalProps) {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [convertOpen, setConvertOpen] = useState(false);
  const [convertType, setConvertType] = useState<ConvertedToType>(defaultConvertTarget(idea.status));
  const [convertQuestlineId, setConvertQuestlineId] = useState(questlineOptions[0]?.id ?? "");
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const alreadyConverted = idea.convertedToType !== null;
  const dirty = title !== idea.title || description !== idea.description || status !== idea.status;

  async function handleSave() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave({ title: title.trim(), description, status });
    } catch {
      setSaveError("Could not save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConvert() {
    if (!title.trim() || converting) return;
    if (convertType === "quest" && !convertQuestlineId) return;
    setConverting(true);
    setConvertError(null);
    try {
      await onConvert(
        convertType,
        convertType === "quest" ? convertQuestlineId : null,
        title.trim(),
        description
      );
    } catch {
      setConvertError("Could not convert this idea. Try again.");
      setConverting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,6,10,0.72)] px-4 py-8 backdrop-blur-sm sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="idea-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-md border border-white/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[rgba(14,19,30,0.98)] to-[rgba(6,8,14,0.99)]" />
        <div
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.09), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
          aria-hidden
        />

        <div className="relative flex flex-col gap-5 px-6 py-6 sm:px-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/60">
              {alreadyConverted ? "Converted Idea" : "Edit Idea"}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded font-display text-xs text-muted/50 transition-colors duration-300 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="idea-title" className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted/50">
              Title
            </label>
            <input
              id="idea-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={alreadyConverted}
              className="rounded-sm border border-white/[0.07] bg-black/25 px-3.5 py-2.5 text-sm text-foreground/90 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="idea-description" className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted/50">
              Description
            </label>
            <textarea
              id="idea-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={alreadyConverted}
              placeholder="Add more detail (optional)..."
              className="resize-none rounded-sm border border-white/[0.07] bg-black/25 px-3.5 py-2.5 text-sm leading-relaxed text-foreground/85 placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="idea-status" className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted/50">
              Status
            </label>
            <select
              id="idea-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as IdeaStatus)}
              disabled={alreadyConverted}
              className="cursor-pointer rounded-sm border border-white/[0.07] bg-black/25 px-3.5 py-2.5 font-display text-xs uppercase tracking-wide text-accent/80 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {saveError && <p className="text-xs text-[rgba(255,120,120,0.9)]">{saveError}</p>}

          {/* Save */}
          {!alreadyConverted && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() || !dirty || saving}
              className="self-start rounded-sm px-4 py-1.5 font-display text-[0.65rem] tracking-[0.15em] uppercase text-accent/85 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                background: "rgba(255,171,74,0.12)",
                border: "1px solid rgba(255,171,74,0.25)",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}

          <div className="h-px bg-linear-to-r from-accent/10 to-transparent" aria-hidden />

          {/* Convert */}
          {alreadyConverted ? (
            <p className="text-xs leading-relaxed text-muted/60">
              This idea became a {idea.convertedToType === "quest" ? "Quest" : "Side Quest"}.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {!convertOpen ? (
                <button
                  type="button"
                  onClick={() => setConvertOpen(true)}
                  className="self-start font-display text-[0.65rem] tracking-[0.15em] uppercase text-accent-glow/75 transition-colors duration-300 hover:text-accent-glow"
                >
                  Convert to Quest / Side Quest →
                </button>
              ) : (
                <>
                  <p className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted/50">
                    Convert this idea into
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConvertType("quest")}
                      className={`flex-1 rounded-sm px-3 py-1.5 font-display text-[0.62rem] tracking-wide uppercase transition-all duration-300 ${
                        convertType === "quest"
                          ? "bg-accent-glow/15 text-accent-glow/90 border border-accent-glow/30"
                          : "bg-white/[0.03] text-muted/55 border border-white/[0.06] hover:text-foreground/70"
                      }`}
                    >
                      Quest
                    </button>
                    <button
                      type="button"
                      onClick={() => setConvertType("side_quest")}
                      className={`flex-1 rounded-sm px-3 py-1.5 font-display text-[0.62rem] tracking-wide uppercase transition-all duration-300 ${
                        convertType === "side_quest"
                          ? "bg-accent-glow/15 text-accent-glow/90 border border-accent-glow/30"
                          : "bg-white/[0.03] text-muted/55 border border-white/[0.06] hover:text-foreground/70"
                      }`}
                    >
                      Side Quest
                    </button>
                  </div>

                  {convertType === "quest" && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="idea-questline" className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted/50">
                        Questline
                      </label>
                      {questlineOptions.length > 0 ? (
                        <select
                          id="idea-questline"
                          value={convertQuestlineId}
                          onChange={(e) => setConvertQuestlineId(e.target.value)}
                          className="cursor-pointer rounded-sm border border-white/[0.07] bg-black/25 px-3.5 py-2.5 font-display text-xs uppercase tracking-wide text-accent/80 focus:outline-none focus:ring-1 focus:ring-accent/30"
                        >
                          {questlineOptions.map((q) => (
                            <option key={q.id} value={q.id}>
                              {q.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-xs text-muted/50">No Questlines exist yet — create one on Quest Board first.</p>
                      )}
                    </div>
                  )}

                  {convertError && <p className="text-xs text-[rgba(255,120,120,0.9)]">{convertError}</p>}

                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={!title.trim() || converting || (convertType === "quest" && !convertQuestlineId)}
                    className="self-start rounded-sm px-4 py-1.5 font-display text-[0.65rem] tracking-[0.15em] uppercase text-accent-glow/90 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                    style={{
                      background: "rgba(77,216,255,0.1)",
                      border: "1px solid rgba(77,216,255,0.25)",
                    }}
                  >
                    {converting ? "Converting..." : `Convert to ${convertType === "quest" ? "Quest" : "Side Quest"}`}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="h-px bg-linear-to-r from-accent/10 to-transparent" aria-hidden />

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="self-start font-display text-[0.6rem] tracking-[0.12em] uppercase text-muted/45 transition-colors duration-300 hover:text-[rgba(255,120,120,0.85)]"
          >
            Delete this idea
          </button>
        </div>
      </div>
    </div>
  );
}
