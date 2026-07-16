"use client";

import { useState } from "react";
import { getTheme, setTheme } from "../lib/theme";

/** A switch between dark and light mode. Dark is the default; the choice
 * is remembered (see app/lib/theme.ts) and re-applied before first paint
 * on future visits. The backgrounds each mode will eventually get are a
 * separate, later piece of work — this only flips the base tokens. */
export function ThemeToggle() {
  const [theme, setThemeState] = useState(getTheme);
  const isLight = theme === "light";

  function toggle() {
    const next = isLight ? "dark" : "light";
    setThemeState(next);
    setTheme(next);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-sm text-foreground/80">Light mode</p>
        <p className="text-xs leading-relaxed text-muted/45">Switch between dark and light. Defaults to dark.</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        onClick={toggle}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
        style={{
          background: isLight ? "rgba(255,171,74,0.35)" : "var(--chip-tint)",
          border: `1px solid ${isLight ? "rgba(255,171,74,0.4)" : "var(--card-border)"}`,
        }}
      >
        <span
          className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
          style={{
            left: isLight ? "calc(100% - 1.25rem)" : "0.25rem",
            boxShadow: isLight ? "0 0 8px rgba(255,171,74,0.6)" : undefined,
          }}
        />
      </button>
    </div>
  );
}
