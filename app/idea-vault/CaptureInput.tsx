"use client";

import { useState } from "react";

export function CaptureInput() {
  const [value, setValue] = useState("");
  const [sealed, setSealed] = useState(false);

  function handleSeal() {
    if (!value.trim()) return;
    setSealed(true);
    setTimeout(() => {
      setValue("");
      setSealed(false);
    }, 2400);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSeal();
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-700">
      {/* Panel base */}
      <div className="absolute inset-0 bg-[rgba(8,6,4,0.82)]" />

      {/* Focus glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-focus-within:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(212,165,116,0.07) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Sealed state overlay */}
      {sealed && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
          style={{ background: "rgba(8,6,4,0.60)" }}
          aria-hidden
        >
          <span className="font-display text-sm tracking-[0.18em] uppercase text-accent/80">
            Sealed in the Vault ✦
          </span>
        </div>
      )}

      {/* Outer ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-700"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(212,165,116,0.08), inset 0 0 0 1px rgba(212,165,116,0.05)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-focus-within:opacity-100"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(212,165,116,0.12), inset 0 0 0 1px rgba(212,165,116,0.10), 0 0 32px rgba(232,132,42,0.06)",
        }}
        aria-hidden
      />

      <div className="relative">
        {/* Textarea */}
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
          disabled={sealed}
          className="w-full resize-none bg-transparent px-5 pb-3 pt-5 text-sm leading-relaxed text-foreground/90 placeholder:text-muted/30 focus:outline-none sm:text-base"
        />

        {/* Console footer — attached to input */}
        <div className="flex items-center justify-between gap-4 border-t border-accent/[0.07] px-5 py-3">
          <p className="text-xs text-muted/35">
            {sealed
              ? "Idea sealed."
              : value.trim()
              ? "⌘ + Enter to seal"
              : "No sorting required. Just capture it."}
          </p>

          <button
            type="button"
            onClick={handleSeal}
            disabled={!value.trim() || sealed}
            className="group/btn relative overflow-hidden rounded-lg px-4 py-1.5 transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:shadow-[0_0_20px_rgba(212,165,116,0.10)]"
            style={{
              background:
                "linear-gradient(to right, rgba(212,165,116,0.10), rgba(212,165,116,0.06))",
              boxShadow: "inset 0 1px 0 rgba(212,165,116,0.09)",
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-accent/8 to-transparent opacity-0 transition-opacity duration-400 group-hover/btn:opacity-100"
              aria-hidden
            />
            <span className="relative font-display text-[0.65rem] tracking-[0.15em] uppercase text-accent/70 group-hover/btn:text-accent/90">
              Seal in the Vault
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
