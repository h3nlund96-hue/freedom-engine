"use client";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Generic HUD-styled confirmation modal — used anywhere a destructive or
 * hard-to-undo action needs an explicit second step. */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,6,10,0.72)] px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-md border border-card-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
        <div
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.1), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
          aria-hidden
        />

        <div className="relative flex flex-col gap-4 px-6 py-6">
          <h2 id="confirm-dialog-title" className="font-display text-base tracking-wide text-foreground/95">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-muted/80">{message}</p>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-sm px-3.5 py-1.5 font-display text-[0.65rem] tracking-[0.12em] uppercase text-muted/70 transition-colors duration-300 hover:text-foreground/85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="rounded-sm px-4 py-1.5 font-display text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
              style={
                destructive
                  ? {
                      background: "rgba(255,92,92,0.12)",
                      color: "var(--critical)",
                      border: "1px solid rgba(255,92,92,0.25)",
                    }
                  : {
                      background: "rgba(255,171,74,0.12)",
                      color: "var(--accent)",
                      border: "1px solid rgba(255,171,74,0.25)",
                    }
              }
            >
              {busy ? "Working..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
