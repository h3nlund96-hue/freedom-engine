"use client";

import { useState } from "react";
import type {
  FreedomEngineProgress,
  Questline,
  Quest,
  Build,
  SideQuest,
  QuestStatus,
} from "../data/freedomEngineProgress";
import { getActiveQuest, getActiveQuestline, getCurrentBuild } from "../data/freedomEngineProgress";
import {
  getProgressClient,
  createQuestline,
  updateQuestline,
  deleteQuestline,
  createQuest,
  updateQuest,
  deleteQuest,
  createBuild,
  updateBuild,
  deleteBuild,
  createSideQuest,
  updateSideQuest,
  deleteSideQuest,
} from "../lib/questMutationService";
import { ConfirmDialog } from "../components/ConfirmDialog";

/* ── SHARED BITS ──────────────────────────────────────────────────────────── */

const inputClass =
  "w-full rounded-sm border border-card-border bg-surface-sunken px-3 py-2 text-xs text-foreground/90 placeholder:text-muted/35 focus:outline-none focus:ring-1 focus:ring-accent/30";
const smallBtn =
  "rounded-sm px-2.5 py-1 font-display text-[0.58rem] tracking-[0.1em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40";

function StatusPill({ status }: { status: QuestStatus }) {
  const styles: Record<QuestStatus, string> = {
    active: "bg-accent-glow/12 text-accent-glow/80",
    available: "bg-muted/8 text-muted/50",
    completed: "bg-accent/10 text-accent/60",
  };
  return (
    <span className={`shrink-0 rounded-sm px-2 py-0.5 font-display text-[0.55rem] tracking-[0.14em] uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}

const ALL_STATUS_OPTIONS: QuestStatus[] = ["available", "active", "completed"];

/** Title + description + status editor, used for every entity type. */
function EntityEditForm({
  initialTitle,
  initialDescription,
  initialStatus,
  statusOptions = ALL_STATUS_OPTIONS,
  questlinePicker,
  onSave,
  onCancel,
  onDelete,
}: {
  initialTitle: string;
  initialDescription: string;
  initialStatus: QuestStatus;
  statusOptions?: QuestStatus[];
  questlinePicker?: { options: { id: string; title: string }[]; initialQuestlineId: string };
  onSave: (fields: { title: string; description: string; status: QuestStatus; questlineId?: string }) => Promise<void>;
  onCancel: () => void;
  /** When provided, renders a "Delete" action inside the form — the caller
   * owns the confirmation step (see QuestCard's confirmingDelete state). */
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<QuestStatus>(initialStatus);
  const [questlineId, setQuestlineId] = useState(questlinePicker?.initialQuestlineId ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave({
        title: title.trim(),
        description,
        status,
        questlineId: questlinePicker ? questlineId : undefined,
      });
    } catch {
      setSaveError("Could not save. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-accent/[0.12] bg-surface-sunken p-3">
      {questlinePicker && (
        <select
          value={questlineId}
          onChange={(e) => setQuestlineId(e.target.value)}
          className={`${inputClass} cursor-pointer font-display uppercase tracking-wide text-accent-glow/80`}
        >
          {questlinePicker.options.map((ql) => (
            <option key={ql.id} value={ql.id}>
              {ql.title}
            </option>
          ))}
        </select>
      )}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={inputClass} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className={`${inputClass} resize-none`}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as QuestStatus)}
        className={`${inputClass} cursor-pointer font-display uppercase tracking-wide text-accent/75`}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s === "available" ? "Available" : s === "active" ? "Active" : "Completed"}
          </option>
        ))}
      </select>
      {saveError && <p className="text-[0.65rem] text-[rgba(255,120,120,0.9)]">{saveError}</p>}
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className={`${smallBtn} bg-accent/12 text-accent/85`}
            style={{ border: "1px solid rgba(255,171,74,0.25)" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onCancel} className={`${smallBtn} text-muted/60 hover:text-foreground/80`}>
            Cancel
          </button>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className={`${smallBtn} text-muted/50 hover:text-[rgba(255,120,120,0.85)]`}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

/** Title + description form for creating a new entity — always starts Available. */
function AddEntityForm({
  onAdd,
  onCancel,
}: {
  onAdd: (fields: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function handleAdd() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setAddError(null);
    try {
      await onAdd({ title: title.trim(), description });
    } catch {
      setAddError("Could not add. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-dashed border-accent/[0.15] bg-surface-sunken p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        autoFocus
        className={inputClass}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className={`${inputClass} resize-none`}
      />
      {addError && <p className="text-[0.65rem] text-[rgba(255,120,120,0.9)]">{addError}</p>}
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!title.trim() || saving}
          className={`${smallBtn} bg-accent-glow/12 text-accent-glow/85`}
          style={{ border: "1px solid rgba(77,216,255,0.25)" }}
        >
          {saving ? "Adding..." : "Add"}
        </button>
        <button type="button" onClick={onCancel} className={`${smallBtn} text-muted/60 hover:text-foreground/80`}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function AddToggle({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start font-display text-[0.6rem] tracking-[0.12em] uppercase text-accent-glow/65 transition-colors duration-300 hover:text-accent-glow"
    >
      + {label}
    </button>
  );
}

/* ── BUILD ROW (step within a Quest) ─────────────────────────────────────── */

function BuildRow({ build, questId, onChanged }: { build: Build; questId: string; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteBuild(build.id, questId);
      onChanged();
    } catch {
      setDeleting(false);
      // Leave the dialog open so the Founder can retry.
    }
  }

  return (
    <>
      {editing ? (
        <EntityEditForm
          initialTitle={build.title}
          initialDescription={build.description ?? ""}
          initialStatus={build.status}
          onCancel={() => setEditing(false)}
          onSave={async (fields) => {
            await updateBuild(build.id, questId, fields);
            setEditing(false);
            onChanged();
          }}
          onDelete={() => setConfirmingDelete(true)}
        />
      ) : (
        <li className="flex items-start gap-2.5 rounded-sm px-2.5 py-2 transition-colors duration-300 hover:bg-[rgba(255,171,74,0.03)]">
          <span
            className={`mt-1 size-1.5 shrink-0 rounded-full ${
              build.status === "completed"
                ? "bg-accent/50"
                : build.status === "active"
                ? "bg-accent-glow shadow-[0_0_5px_rgba(77,216,255,0.6)]"
                : "bg-muted/25"
            }`}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-display text-[0.65rem] tabular-nums text-muted/40">
                #{build.buildNumber}
              </span>
              <p
                className={`text-xs leading-relaxed ${
                  build.status === "completed" ? "text-foreground/45 line-through" : "text-foreground/80"
                }`}
              >
                {build.title}
              </p>
              <StatusPill status={build.status} />
            </div>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {build.status !== "completed" && (
              <button
                type="button"
                onClick={() => updateBuild(build.id, questId, { status: "completed" }).then(onChanged)}
                className={`${smallBtn} text-accent/60 hover:text-accent/85`}
              >
                Complete
              </button>
            )}
            <button type="button" onClick={() => setEditing(true)} className={`${smallBtn} text-muted/50 hover:text-foreground/75`}>
              Edit
            </button>
          </div>
        </li>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this Build?"
          message={`"${build.title}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}

/* ── QUEST CARD ───────────────────────────────────────────────────────────── */

function QuestCard({
  quest,
  questlineId,
  questlineTitle,
  questlineOptions,
  onChanged,
  highlight = false,
}: {
  quest: Quest;
  questlineId: string;
  questlineTitle?: string;
  questlineOptions?: { id: string; title: string }[];
  onChanged: () => void;
  highlight?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [addingBuild, setAddingBuild] = useState(false);
  const [showCompletedBuilds, setShowCompletedBuilds] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const builds = quest.builds ?? [];
  const openBuilds = builds.filter((b) => b.status !== "completed");
  const completedBuilds = builds.filter((b) => b.status === "completed");

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteQuest(quest.id);
      onChanged();
    } catch {
      setDeleting(false);
      // Leave the dialog open so the Founder can retry.
    }
  }

  const content = editing ? (
    <EntityEditForm
      initialTitle={quest.title}
      initialDescription={quest.description}
      initialStatus={quest.status}
      questlinePicker={
        questlineOptions && questlineOptions.length > 0
          ? { options: questlineOptions, initialQuestlineId: questlineId }
          : undefined
      }
      onCancel={() => setEditing(false)}
      onSave={async (fields) => {
        await updateQuest(quest.id, questlineId, { ...fields, newQuestlineId: fields.questlineId });
        setEditing(false);
        onChanged();
      }}
      onDelete={() => setConfirmingDelete(true)}
    />
  ) : (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {questlineTitle && (
            <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-muted/35">{questlineTitle}</p>
          )}
          <div className="flex items-center gap-2">
            <h4 className="font-display text-sm tracking-wide text-foreground/90">{quest.title}</h4>
            <StatusPill status={quest.status} />
          </div>
          {quest.description && <p className="mt-1 text-xs leading-relaxed text-muted/60">{quest.description}</p>}
        </div>
        <div className="flex shrink-0 gap-1.5">
          {quest.status !== "active" && quest.status !== "completed" && (
            <button
              type="button"
              onClick={() => updateQuest(quest.id, questlineId, { status: "active" }).then(onChanged)}
              className={`${smallBtn} text-accent-glow/70 hover:text-accent-glow`}
            >
              Activate
            </button>
          )}
          {quest.status !== "completed" && (
            <button
              type="button"
              onClick={() => updateQuest(quest.id, questlineId, { status: "completed" }).then(onChanged)}
              className={`${smallBtn} text-accent/60 hover:text-accent/85`}
            >
              Complete
            </button>
          )}
          <button type="button" onClick={() => setEditing(true)} className={`${smallBtn} text-muted/50 hover:text-foreground/75`}>
            Edit
          </button>
        </div>
      </div>

      {/* Builds — steps. Completed ones stay collapsed by default so a
          long-running Quest's history doesn't drown out what's actionable. */}
      <div className="space-y-1 border-t border-accent/[0.06] pt-2.5">
        {openBuilds.length > 0 && (
          <ul className="space-y-0.5">
            {openBuilds.map((b) => (
              <BuildRow key={b.id} build={b} questId={quest.id} onChanged={onChanged} />
            ))}
          </ul>
        )}

        {completedBuilds.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowCompletedBuilds((v) => !v)}
              className="font-display text-[0.6rem] tracking-[0.1em] uppercase text-muted/45 transition-colors duration-300 hover:text-foreground/70"
            >
              {showCompletedBuilds ? "▾" : "▸"} {completedBuilds.length} completed
            </button>
            {showCompletedBuilds && (
              <ul className="mt-1 space-y-0.5">
                {completedBuilds.map((b) => (
                  <BuildRow key={b.id} build={b} questId={quest.id} onChanged={onChanged} />
                ))}
              </ul>
            )}
          </div>
        )}

        {addingBuild ? (
          <AddEntityForm
            onCancel={() => setAddingBuild(false)}
            onAdd={async (fields) => {
              await createBuild(quest.id, fields.title, fields.description);
              setAddingBuild(false);
              onChanged();
            }}
          />
        ) : (
          <AddToggle label="Add Build" onClick={() => setAddingBuild(true)} />
        )}
      </div>
    </>
  );

  const card = highlight ? (
    <div className="flex flex-col gap-3 rounded-sm border border-accent-glow/20 bg-accent-glow/[0.03] px-3.5 py-3">
      {content}
    </div>
  ) : (
    <ElevatedCard>{content}</ElevatedCard>
  );

  return (
    <>
      {card}
      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this Quest?"
          message={`"${quest.title}" and all of its Builds will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}

/* ── ELEVATED CARD ────────────────────────────────────────────────────────── */

/** The opaque HUD card shell used for every top-level entity in a tab
 * (Questlines, Side Quests, and completed-Quest groupings). Nested entities
 * (Quests inside a Questline, Builds inside a Quest) use a lighter tint
 * instead, since they already sit on top of this opaque surface. */
function ElevatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-card-border">
      <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.06)]" aria-hidden />
      <div className="relative flex flex-col gap-3 p-5">{children}</div>
    </div>
  );
}

/* ── QUESTLINE CARD ───────────────────────────────────────────────────────── */

function QuestlineCard({ questline, onChanged }: { questline: Questline; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteQuestline(questline.id);
      onChanged();
    } catch {
      setDeleting(false);
      // Leave the dialog open so the Founder can retry.
    }
  }

  const content = editing ? (
    <EntityEditForm
      initialTitle={questline.title}
      initialDescription={questline.description}
      initialStatus={questline.status}
      statusOptions={["available", "completed"]}
      onCancel={() => setEditing(false)}
      onSave={async (fields) => {
        await updateQuestline(questline.id, fields);
        setEditing(false);
        onChanged();
      }}
      onDelete={() => setConfirmingDelete(true)}
    />
  ) : (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h3 className="font-display text-base tracking-wide text-foreground/95">{questline.title}</h3>
          <StatusPill status={questline.status} />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted/60">{questline.description}</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        {questline.status !== "completed" && (
          <button
            type="button"
            onClick={() => updateQuestline(questline.id, { status: "completed" }).then(onChanged)}
            className={`${smallBtn} text-accent/60 hover:text-accent/85`}
          >
            Complete
          </button>
        )}
        <button type="button" onClick={() => setEditing(true)} className={`${smallBtn} text-muted/50 hover:text-foreground/75`}>
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ElevatedCard>{content}</ElevatedCard>
      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this Questline?"
          message={`"${questline.title}" and all of its Quests and Builds will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}

/* ── SIDE QUEST CARD ──────────────────────────────────────────────────────── */

function SideQuestCard({
  sideQuest,
  onChanged,
  highlight = false,
}: {
  sideQuest: SideQuest;
  onChanged: () => void;
  highlight?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteSideQuest(sideQuest.id);
      onChanged();
    } catch {
      setDeleting(false);
      // Leave the dialog open so the Founder can retry.
    }
  }

  const content = editing ? (
    <EntityEditForm
      initialTitle={sideQuest.title}
      initialDescription={sideQuest.description}
      initialStatus={sideQuest.status}
      onCancel={() => setEditing(false)}
      onSave={async (fields) => {
        await updateSideQuest(sideQuest.id, fields);
        setEditing(false);
        onChanged();
      }}
      onDelete={() => setConfirmingDelete(true)}
    />
  ) : (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h3 className="font-display text-base tracking-wide text-foreground/95">{sideQuest.title}</h3>
          <StatusPill status={sideQuest.status} />
        </div>
        {sideQuest.description && (
          <p className="mt-1 text-xs leading-relaxed text-muted/60">{sideQuest.description}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-1.5">
        {sideQuest.status !== "active" && sideQuest.status !== "completed" && (
          <button
            type="button"
            onClick={() => updateSideQuest(sideQuest.id, { status: "active" }).then(onChanged)}
            className={`${smallBtn} text-accent-glow/70 hover:text-accent-glow`}
          >
            Activate
          </button>
        )}
        {sideQuest.status !== "completed" && (
          <button
            type="button"
            onClick={() => updateSideQuest(sideQuest.id, { status: "completed" }).then(onChanged)}
            className={`${smallBtn} text-accent/60 hover:text-accent/85`}
          >
            Complete
          </button>
        )}
        <button type="button" onClick={() => setEditing(true)} className={`${smallBtn} text-muted/50 hover:text-foreground/75`}>
          Edit
        </button>
      </div>
    </div>
  );

  const card = highlight ? (
    <div className="rounded-sm border border-accent-glow/20 bg-accent-glow/[0.03] px-3.5 py-3">{content}</div>
  ) : (
    <ElevatedCard>{content}</ElevatedCard>
  );

  return (
    <>
      {card}
      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this Side Quest?"
          message={`"${sideQuest.title}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}

/* ── SUB TAB BAR (Active / Completed, within a main tab) ──────────────────── */

type SubTab = "active" | "completed";

function SubTabBar({
  subTab,
  onChange,
  activeCount,
  completedCount,
}: {
  subTab: SubTab;
  onChange: (s: SubTab) => void;
  activeCount: number;
  completedCount: number;
}) {
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => onChange("active")}
        className={`rounded-sm px-3 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase transition-colors duration-300 ${
          subTab === "active" ? "bg-accent-glow/12 text-accent-glow/85" : "text-muted/50 hover:text-foreground/70"
        }`}
      >
        Active <span className="ml-1 opacity-60">{activeCount}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("completed")}
        className={`rounded-sm px-3 py-1.5 font-display text-[0.6rem] tracking-[0.12em] uppercase transition-colors duration-300 ${
          subTab === "completed" ? "bg-accent/12 text-accent/80" : "text-muted/50 hover:text-foreground/70"
        }`}
      >
        Completed <span className="ml-1 opacity-60">{completedCount}</span>
      </button>
    </div>
  );
}

/* ── ADD QUEST FORM (needs a Questline picker) ────────────────────────────── */

function AddQuestForm({
  questlineOptions,
  defaultQuestlineId,
  onAdd,
  onCancel,
}: {
  questlineOptions: { id: string; title: string }[];
  defaultQuestlineId?: string;
  onAdd: (fields: { title: string; description: string; questlineId: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questlineId, setQuestlineId] = useState(defaultQuestlineId ?? questlineOptions[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function handleAdd() {
    if (!title.trim() || !questlineId || saving) return;
    setSaving(true);
    setAddError(null);
    try {
      await onAdd({ title: title.trim(), description, questlineId });
    } catch {
      setAddError("Could not add. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-dashed border-accent/[0.15] bg-surface-sunken p-3">
      <select
        value={questlineId}
        onChange={(e) => setQuestlineId(e.target.value)}
        className={`${inputClass} cursor-pointer font-display uppercase tracking-wide text-accent-glow/80`}
      >
        {questlineOptions.map((ql) => (
          <option key={ql.id} value={ql.id}>
            {ql.title}
          </option>
        ))}
      </select>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        autoFocus
        className={inputClass}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className={`${inputClass} resize-none`}
      />
      {addError && <p className="text-[0.65rem] text-[rgba(255,120,120,0.9)]">{addError}</p>}
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!title.trim() || !questlineId || saving}
          className={`${smallBtn} bg-accent-glow/12 text-accent-glow/85`}
          style={{ border: "1px solid rgba(77,216,255,0.25)" }}
        >
          {saving ? "Adding..." : "Add"}
        </button>
        <button type="button" onClick={onCancel} className={`${smallBtn} text-muted/60 hover:text-foreground/80`}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── TABS ─────────────────────────────────────────────────────────────────── */

function QuestLinesTab({ questlines, onChanged }: { questlines: Questline[]; onChanged: () => void }) {
  const [subTab, setSubTab] = useState<SubTab>("active");
  const [adding, setAdding] = useState(false);

  const activeItems = questlines.filter((q) => q.status !== "completed");
  const completedItems = questlines.filter((q) => q.status === "completed");
  const visible = subTab === "active" ? activeItems : completedItems;

  return (
    <div className="space-y-4">
      <SubTabBar subTab={subTab} onChange={setSubTab} activeCount={activeItems.length} completedCount={completedItems.length} />

      <div className="space-y-3">
        {visible.length === 0 ? (
          <p className="text-xs italic text-muted/40">None yet.</p>
        ) : (
          visible.map((ql) => <QuestlineCard key={ql.id} questline={ql} onChanged={onChanged} />)
        )}
      </div>

      {subTab === "active" &&
        (adding ? (
          <AddEntityForm
            onCancel={() => setAdding(false)}
            onAdd={async (fields) => {
              await createQuestline(fields.title, fields.description);
              setAdding(false);
              onChanged();
            }}
          />
        ) : (
          <AddToggle label="New Questline" onClick={() => setAdding(true)} />
        ))}
    </div>
  );
}

function QuestsTab({ questlines, onChanged }: { questlines: Questline[]; onChanged: () => void }) {
  const [subTab, setSubTab] = useState<SubTab>("active");
  const [adding, setAdding] = useState(false);
  const [filterQuestlineId, setFilterQuestlineId] = useState<string>("all");

  const questlineOptions = questlines.map((ql) => ({ id: ql.id, title: ql.title }));

  const allQuests = questlines.flatMap((ql) =>
    (ql.quests ?? []).map((q) => ({ quest: q, questlineId: ql.id, questlineTitle: ql.title }))
  );
  const filtered =
    filterQuestlineId === "all" ? allQuests : allQuests.filter((q) => q.questlineId === filterQuestlineId);

  const activeItems = filtered.filter(({ quest }) => quest.status !== "completed");
  const completedItems = filtered.filter(({ quest }) => quest.status === "completed");
  const visible = subTab === "active" ? activeItems : completedItems;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SubTabBar subTab={subTab} onChange={setSubTab} activeCount={activeItems.length} completedCount={completedItems.length} />

        {questlineOptions.length > 0 && (
          <select
            value={filterQuestlineId}
            onChange={(e) => setFilterQuestlineId(e.target.value)}
            className="cursor-pointer rounded-sm border border-card-border bg-surface-sunken px-2.5 py-1 font-display text-[0.58rem] uppercase tracking-wide text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent/30"
          >
            <option value="all">All Questlines</option>
            {questlineOptions.map((ql) => (
              <option key={ql.id} value={ql.id}>
                {ql.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2.5">
        {visible.length === 0 ? (
          <p className="text-xs italic text-muted/40">None yet.</p>
        ) : (
          visible.map(({ quest, questlineId, questlineTitle }) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              questlineId={questlineId}
              questlineTitle={questlineTitle}
              questlineOptions={questlineOptions}
              onChanged={onChanged}
            />
          ))
        )}
      </div>

      {subTab === "active" &&
        (questlineOptions.length === 0 ? (
          <p className="text-xs text-muted/50">Create a Questline first, on the Quest Lines tab, before adding a Quest.</p>
        ) : adding ? (
          <AddQuestForm
            questlineOptions={questlineOptions}
            defaultQuestlineId={filterQuestlineId !== "all" ? filterQuestlineId : undefined}
            onCancel={() => setAdding(false)}
            onAdd={async (fields) => {
              await createQuest(fields.questlineId, fields.title, fields.description);
              setAdding(false);
              onChanged();
            }}
          />
        ) : (
          <AddToggle label="New Quest" onClick={() => setAdding(true)} />
        ))}
    </div>
  );
}

function SideQuestsTab({ sideQuests, onChanged }: { sideQuests: SideQuest[]; onChanged: () => void }) {
  const [subTab, setSubTab] = useState<SubTab>("active");
  const [adding, setAdding] = useState(false);

  const activeItems = sideQuests.filter((s) => s.status !== "completed");
  const completedItems = sideQuests.filter((s) => s.status === "completed");
  const visible = subTab === "active" ? activeItems : completedItems;

  return (
    <div className="space-y-4">
      <SubTabBar subTab={subTab} onChange={setSubTab} activeCount={activeItems.length} completedCount={completedItems.length} />

      {subTab === "active" && (
        <p className="text-xs leading-relaxed text-muted/50">
          Smaller useful quests that support the main path without becoming the main path.
        </p>
      )}

      <div className="space-y-2.5">
        {visible.length === 0 ? (
          <p className="text-xs italic text-muted/40">None yet.</p>
        ) : (
          visible.map((sq) => <SideQuestCard key={sq.id} sideQuest={sq} onChanged={onChanged} />)
        )}
      </div>

      {subTab === "active" &&
        (adding ? (
          <AddEntityForm
            onCancel={() => setAdding(false)}
            onAdd={async (fields) => {
              await createSideQuest(fields.title, fields.description);
              setAdding(false);
              onChanged();
            }}
          />
        ) : (
          <AddToggle label="New Side Quest" onClick={() => setAdding(true)} />
        ))}
    </div>
  );
}

/* ── ACTIVE FOCUS PANEL ───────────────────────────────────────────────────── */

function ActiveFocusPanel({
  questline,
  quest,
  build,
  sideQuest,
  questlineOptions,
  onChanged,
}: {
  questline?: Questline;
  quest?: Quest;
  build?: Build;
  sideQuest?: SideQuest;
  questlineOptions: { id: string; title: string }[];
  onChanged: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-card-border">
      <div className="absolute inset-0 bg-linear-to-b from-surface-raised to-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(77,216,255,0.08)_0%,transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.11), inset 0 -1px 0 rgba(0,0,0,0.4)" }}
        aria-hidden
      />
      <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-accent/22" aria-hidden />
      <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-accent/22" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-accent/12" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-accent/12" aria-hidden />

      <div className="relative px-6 py-8 sm:px-8 sm:py-9">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/55" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-glow shadow-[0_0_10px_rgba(77,216,255,0.65)]" />
          </span>
          <span className="font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent-glow/75">Active Path</span>
        </div>

        {questline && quest ? (
          <>
            <dl className="space-y-0 border-b border-accent/[0.07] pb-6">
              <div className="flex flex-col gap-1.5 border-b border-accent/[0.05] py-3.5 sm:flex-row sm:items-baseline sm:gap-6">
                <dt className="min-w-28 shrink-0 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted/55">Questline</dt>
                <dd className="text-sm leading-relaxed text-foreground/80">{questline.title}</dd>
              </div>
              <div className="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-baseline sm:gap-6">
                <dt className="min-w-28 shrink-0 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted/55">Quest</dt>
                <dd className="text-sm leading-relaxed text-foreground/80">{quest.title}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {build ? (
                <>
                  <p className="mb-2 font-display text-[0.6rem] tracking-[0.3em] uppercase text-accent/55">
                    Current Build <span className="tabular-nums text-accent/40">#{build.buildNumber}</span>
                  </p>
                  <h2 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">{build.title}</h2>
                  {build.description && (
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/65 sm:text-base">{build.description}</p>
                  )}
                </>
              ) : (
                <p className="text-sm leading-relaxed text-muted/55">
                  No Build is marked Active on this Quest yet — open it in the Quests tab to activate or add one.
                </p>
              )}
            </div>

            {/* Full quest card — edit, complete, manage builds, right here */}
            <div className="mt-8 border-t border-accent/[0.06] pt-6">
              <QuestCard
                quest={quest}
                questlineId={questline.id}
                questlineOptions={questlineOptions}
                onChanged={onChanged}
                highlight
              />
            </div>
          </>
        ) : sideQuest ? (
          <>
            <p className="mb-2 font-display text-[0.6rem] tracking-[0.3em] uppercase text-accent/55">Active Side Quest</p>
            <h2 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">{sideQuest.title}</h2>
            {sideQuest.description && (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/65 sm:text-base">{sideQuest.description}</p>
            )}

            {/* Full side quest card — edit, complete, right here */}
            <div className="mt-8 border-t border-accent/[0.06] pt-6">
              <SideQuestCard sideQuest={sideQuest} onChanged={onChanged} highlight />
            </div>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted/60">
            Nothing is marked Active yet. Activate a Quest or Side Quest below.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── MAIN QUEST TILE ──────────────────────────────────────────────────────── */

function MainQuestTile({ quest }: { quest: string }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-card-border">
      <div className="absolute inset-0 bg-linear-to-r from-surface-raised to-surface" />
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent/50 via-accent/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.07)]" aria-hidden />
      <div className="relative flex flex-col gap-1.5 px-6 py-5 sm:flex-row sm:items-center sm:gap-8 sm:px-7">
        <div className="shrink-0">
          <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/50">North Star</p>
          <p className="mt-1 font-display text-lg tracking-wide text-foreground/95">{quest}</p>
        </div>
        <p className="border-t border-accent/[0.06] pt-3 text-xs leading-relaxed text-muted/55 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          The long-term path. Everything inside AI Mastery HQ serves this larger mission.
        </p>
      </div>
    </div>
  );
}

/* ── SECTION LABEL / TAB BAR ──────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2.5">
      {children}
      <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
    </div>
  );
}

type MainTab = "active" | "questlines" | "quests" | "sidequests";

function MainTabBar({
  tab,
  onChange,
  counts,
}: {
  tab: MainTab;
  onChange: (t: MainTab) => void;
  counts: Record<Exclude<MainTab, "active">, number>;
}) {
  const tabs: { id: MainTab; label: string }[] = [
    { id: "active", label: "Active Path" },
    { id: "questlines", label: "Quest Lines" },
    { id: "quests", label: "Quests" },
    { id: "sidequests", label: "Side Quests" },
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b border-card-border">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`relative px-3.5 py-2.5 font-display text-[0.65rem] tracking-[0.14em] uppercase transition-colors duration-300 ${
            tab === t.id ? "text-accent" : "text-muted/50 hover:text-foreground/70"
          }`}
        >
          {t.label}
          {t.id !== "active" && <span className="ml-1.5 text-muted/40">{counts[t.id]}</span>}
          {tab === t.id && (
            <span className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-accent to-transparent" aria-hidden />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── QUEST BOARD CLIENT ───────────────────────────────────────────────────── */

export function QuestBoardClient({ initialProgress }: { initialProgress: FreedomEngineProgress }) {
  const [progress, setProgress] = useState(initialProgress);
  const [tab, setTab] = useState<MainTab>("active");

  async function onChanged() {
    const fresh = await getProgressClient();
    setProgress(fresh);
  }

  const activeQuest = getActiveQuest(progress);
  const activeQuestline = activeQuest ? getActiveQuestline(progress, activeQuest) : undefined;
  const currentBuild = activeQuest ? getCurrentBuild(activeQuest) : undefined;
  const activeSideQuest = progress.sideQuests.find((s) => s.status === "active");
  const questlineOptions = progress.questlines.map((ql) => ({ id: ql.id, title: ql.title }));

  const questlinesCount = progress.questlines.filter((q) => q.status !== "completed").length;
  const questsCount = progress.questlines.reduce(
    (sum, ql) => sum + (ql.quests ?? []).filter((q) => q.status !== "completed").length,
    0
  );
  const sideQuestsCount = progress.sideQuests.filter((s) => s.status !== "completed").length;

  return (
    <>
      {/* ── MAIN QUEST ── */}
      <section className="animate-fade-up" style={{ animationDelay: "0.16s" }}>
        <SectionLabel>Main Quest</SectionLabel>
        <MainQuestTile quest={progress.mainQuest} />
      </section>

      {/* ── QUEST SYSTEM — Active Path, Quest Lines, Quests, Side Quests ── */}
      <section className="animate-fade-up space-y-5" style={{ animationDelay: "0.24s" }}>
        <MainTabBar
          tab={tab}
          onChange={setTab}
          counts={{ questlines: questlinesCount, quests: questsCount, sidequests: sideQuestsCount }}
        />
        {tab === "active" && (
          <ActiveFocusPanel
            questline={activeQuestline}
            quest={activeQuest}
            build={currentBuild}
            sideQuest={activeSideQuest}
            questlineOptions={questlineOptions}
            onChanged={onChanged}
          />
        )}
        {tab === "questlines" && <QuestLinesTab questlines={progress.questlines} onChanged={onChanged} />}
        {tab === "quests" && <QuestsTab questlines={progress.questlines} onChanged={onChanged} />}
        {tab === "sidequests" && <SideQuestsTab sideQuests={progress.sideQuests} onChanged={onChanged} />}
      </section>

      {/* Guiding principle */}
      <blockquote className="animate-fade-up relative py-1 pl-7" style={{ animationDelay: "0.32s" }}>
        <span className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/40 via-accent/15 to-transparent" aria-hidden />
        <span
          className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/50 shadow-[0_0_10px_rgba(77,216,255,0.35)]"
          aria-hidden
        />
        <p className="font-display text-sm italic leading-relaxed text-muted/90 sm:text-base">
          Every Quest is completed through Builds.
        </p>
      </blockquote>
    </>
  );
}
