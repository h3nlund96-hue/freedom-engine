"use client";

import { useState } from "react";
import { getAmbientPreference, setAmbientEnabled, setAmbientIntensity } from "../lib/ambientPreferences";

/** Turns HQ's ambient background (fog, ember blooms, grain) on/off and dials
 * its intensity — Profile > Options, alongside ThemeToggle and
 * EmberProactiveToggle. */
export function AmbientToggle() {
  const [pref, setPref] = useState(getAmbientPreference);

  function toggle() {
    const next = !pref.enabled;
    setAmbientEnabled(next);
    setPref((p) => ({ ...p, enabled: next }));
  }

  function handleIntensity(value: number) {
    setAmbientIntensity(value);
    setPref((p) => ({ ...p, intensity: value }));
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm text-foreground/80">Ambient atmosphere</p>
          <p className="text-xs leading-relaxed text-muted/45">Fog, drifting embers and grain across HQ.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={pref.enabled}
          onClick={toggle}
          className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
          style={{
            background: pref.enabled ? "rgba(255,171,74,0.35)" : "var(--chip-tint)",
            border: `1px solid ${pref.enabled ? "rgba(255,171,74,0.4)" : "var(--card-border)"}`,
          }}
        >
          <span
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
            style={{ left: pref.enabled ? "calc(100% - 1.25rem)" : "0.25rem" }}
          />
        </button>
      </div>

      {pref.enabled && (
        <div className="flex items-center gap-3">
          <label htmlFor="ambient-intensity" className="shrink-0 text-xs text-muted/50">
            Intensity
          </label>
          <input
            id="ambient-intensity"
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={pref.intensity}
            onChange={(e) => handleIntensity(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <span className="w-9 shrink-0 text-right font-display text-xs text-accent/70">
            {Math.round(pref.intensity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
