"use client";

/**
 * HQ's living backdrop — Direction B ("Volumetric Depth & Grain"): parallax
 * fog banks, a full-viewport grain texture, and sparse ember blooms drifting
 * upward. Pure CSS (transform/opacity animations plus one static texture) —
 * no canvas, no per-frame JS, cheap to run continuously. See
 * app/globals.css for the keyframes and .ambient-* / .noise-overlay-ambient
 * classes this assembles.
 *
 * `intensity` is a single 0–1 dial multiplying every layer's opacity via the
 * --ambient-intensity custom property — turn it up or down without touching
 * the layer definitions below. `enabled` unmounts the whole system.
 */

interface AmbientBackgroundProps {
  /** 0–1. Defaults to a balanced level — noticeable without competing with content. */
  intensity?: number;
  enabled?: boolean;
}

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

export function AmbientBackground({ intensity = 0.6, enabled = true }: AmbientBackgroundProps) {
  if (!enabled) return null;

  const rootStyle = { "--ambient-intensity": intensity } as React.CSSProperties;

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
            background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--${bank.tint}) 16%, transparent) 0%, transparent 70%)`,
            opacity: `calc(var(--ambient-intensity) * ${bank.peak})`,
            animationDuration: bank.duration,
            animationDelay: bank.delay,
          }}
        />
      ))}

      <div className="absolute inset-0" style={{ opacity: "calc(var(--ambient-intensity) * 0.6)" }}>
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
