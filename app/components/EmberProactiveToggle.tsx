"use client";

import { useState } from "react";
import { isProactiveEnabled, setProactiveEnabled } from "../lib/emberPreferences";

/** A switch for whether Ember's floating widget speaks up on its own
 * (completion praise, idea-capture feedback, the HQ greeting) — for a
 * Founder who'd rather she stayed quiet unless asked. Doesn't affect the
 * orb itself or her full console; only the unprompted messages. */
export function EmberProactiveToggle() {
  const [enabled, setEnabled] = useState(isProactiveEnabled);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setProactiveEnabled(next);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-sm text-foreground/80">Ember speaks up unprompted</p>
        <p className="text-xs leading-relaxed text-muted/45">
          Praise on completing a Quest, Build or Idea, and a greeting on landing at HQ.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
        style={{
          background: enabled ? "rgba(255,171,74,0.35)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${enabled ? "rgba(255,171,74,0.4)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        <span
          className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white transition-all duration-300"
          style={{
            left: enabled ? "calc(100% - 1.25rem)" : "0.25rem",
            boxShadow: enabled ? "0 0 8px rgba(255,171,74,0.6)" : "none",
          }}
        />
      </button>
    </div>
  );
}
