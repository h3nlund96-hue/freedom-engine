"use client";

import { useState } from "react";
import { AmbientBackground } from "../../components/AmbientBackground";
import { PanelAtmosphere } from "../../components/PanelAtmosphere";
import { CornerMarks } from "../../components/CornerMarks";
import { ThemeToggle } from "../../components/ThemeToggle";
import { HQHeader } from "../../components/HQHeader";

/**
 * Live tuning ground for the ambient background (Direction B: Volumetric
 * Depth & Grain) — not wired into the real app yet. Preview it here, dial
 * intensity and on/off with the controls, and flip light/dark with the
 * existing ThemeToggle to see both moods before this touches HQ for real.
 */
export default function AmbientPreviewPage() {
  const [enabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState(0.6);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AmbientBackground intensity={intensity} enabled={enabled} />

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-14 sm:px-8 sm:py-20 lg:max-w-3xl xl:max-w-4xl">
        <HQHeader title="Ambient Preview" />

        <p className="max-w-lg text-sm leading-relaxed text-muted">
          This is a dev-only preview of the ambient background system — Direction B, tuned live. Nothing here is
          wired into the real HQ, Quest Board, or Idea Vault yet.
        </p>

        <section className="space-y-4">
          <SectionLabel>Mock Panels — per-location atmosphere accents</SectionLabel>
          <div className="grid gap-5 sm:grid-cols-2">
            <MockPanel label="Quest Board" bias="amber-cyan" />
            <MockPanel label="Idea Vault" bias="cyan" />
          </div>
        </section>
      </main>

      <ControlPanel
        enabled={enabled}
        onEnabledChange={setEnabled}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />
    </div>
  );
}

function MockPanel({ label, bias }: { label: string; bias: "amber" | "cyan" | "amber-cyan" }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-card-border">
      <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
      <PanelAtmosphere bias={bias} />
      <CornerMarks size={8} inset="6px" />
      <div className="relative flex flex-col gap-2 px-6 py-7">
        <p className="font-display text-[0.6rem] tracking-[0.25em] uppercase text-accent/70">{label}</p>
        <p className="text-sm leading-relaxed text-muted/70">
          Sample panel content sitting on top of its atmosphere wash — text and cards stay fully legible.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">{children}</p>
      <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
    </div>
  );
}

function ControlPanel({
  enabled,
  onEnabledChange,
  intensity,
  onIntensityChange,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  intensity: number;
  onIntensityChange: (v: number) => void;
}) {
  return (
    <div className="fixed bottom-6 left-6 z-20 w-72 overflow-hidden rounded-md border border-card-border">
      <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
      <div className="relative flex flex-col gap-4 px-5 py-5">
        <p className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-muted/50">Ambient Controls</p>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-foreground/80">Enabled</p>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onEnabledChange(!enabled)}
            className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
            style={{
              background: enabled ? "rgba(255,171,74,0.35)" : "var(--chip-tint)",
              border: `1px solid ${enabled ? "rgba(255,171,74,0.4)" : "var(--card-border)"}`,
            }}
          >
            <span
              className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
              style={{ left: enabled ? "calc(100% - 1.25rem)" : "0.25rem" }}
            />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="intensity-slider" className="text-sm text-foreground/80">
              Intensity
            </label>
            <span className="font-display text-xs text-accent/70">{Math.round(intensity * 100)}%</span>
          </div>
          <input
            id="intensity-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={intensity}
            disabled={!enabled}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className="w-full accent-accent disabled:opacity-40"
          />
        </div>

        <div className="h-px bg-linear-to-r from-accent/10 to-transparent" aria-hidden />

        <ThemeToggle />
      </div>
    </div>
  );
}
