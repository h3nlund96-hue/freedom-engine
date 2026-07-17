"use client";

import { useEffect, useState } from "react";
import { getAmbientPreference, onAmbientChange, DEFAULT_AMBIENT_INTENSITY } from "../lib/ambientPreferences";

/**
 * HQ's living backdrop — Direction B ("Volumetric Depth & Grain"): parallax
 * fog banks, a full-viewport grain texture, and sparse ember blooms drifting
 * upward. Pure CSS (transform/opacity animations plus one static texture) —
 * no canvas, no per-frame JS, cheap to run continuously. See
 * app/globals.css for the keyframes and .ambient-* / .noise-overlay-ambient
 * classes this assembles.
 *
 * Mounted once at the root layout. Reads its on/off + intensity from
 * ambientPreferences.ts (Profile > Options is the real control for both) and
 * stays in sync live if that changes while already mounted, same pattern as
 * EmberWidget's proactive-messages toggle.
 */

const FOG_BANKS: {
  top: string;
  left: string;
  size: string;
  tint: "accent" | "accent-glow";
  peak: number;
  drift: 1 | 2 | 3;
  duration: string;
  delay: string;
}[] = [
  { top: "-25%", left: "-20%", size: "75vw", tint: "accent", peak: 0.55, drift: 1, duration: "70s", delay: "0s" },
  { top: "25%", left: "50%", size: "70vw", tint: "accent-glow", peak: 0.4, drift: 2, duration: "95s", delay: "-20s" },
  { top: "55%", left: "-15%", size: "80vw", tint: "accent", peak: 0.35, drift: 3, duration: "130s", delay: "-55s" },
];

const EMBER_BLOOMS: { left: string; size: number; duration: string; delay: string }[] = [
  { left: "8%", size: 46, duration: "26s", delay: "0s" },
  { left: "22%", size: 34, duration: "32s", delay: "-6s" },
  { left: "41%", size: 52, duration: "29s", delay: "-12s" },
  { left: "58%", size: 30, duration: "35s", delay: "-18s" },
  { left: "71%", size: 44, duration: "24s", delay: "-4s" },
  { left: "85%", size: 38, duration: "31s", delay: "-24s" },
];

export function AmbientBackground() {
  const [pref, setPref] = useState({ enabled: true, intensity: DEFAULT_AMBIENT_INTENSITY });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from a client-only store, not syncing derived state
    setPref(getAmbientPreference());
    return onAmbientChange(setPref);
  }, []);

  if (!pref.enabled) return null;

  const rootStyle = { "--ambient-intensity": pref.intensity } as React.CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={rootStyle} aria-hidden>
      {FOG_BANKS.map((bank, i) => (
        <div
          key={i}
          className={`absolute rounded-full ambient-fog-drift-${bank.drift}`}
          style={{
            top: bank.top,
            left: bank.left,
            width: bank.size,
            height: bank.size,
            background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--${bank.tint}) var(--ambient-fog-mix), transparent) 0%, transparent 70%)`,
            opacity: `calc(var(--ambient-intensity) * ${bank.peak})`,
            animationDuration: bank.duration,
            animationDelay: bank.delay,
          }}
        />
      ))}

      <div className="absolute inset-0" style={{ opacity: "calc(var(--ambient-intensity) * var(--ambient-ember-opacity))" }}>
        {EMBER_BLOOMS.map((bloom, i) => (
          <div
            key={i}
            className="ambient-ember-bloom absolute bottom-0"
            style={{
              left: bloom.left,
              width: bloom.size,
              height: bloom.size,
              animationDuration: bloom.duration,
              animationDelay: bloom.delay,
            }}
          />
        ))}
      </div>

      <div
        className="noise-overlay-ambient absolute inset-0"
        style={{ opacity: "calc(var(--ambient-intensity) * 0.05)" }}
      />
    </div>
  );
}
