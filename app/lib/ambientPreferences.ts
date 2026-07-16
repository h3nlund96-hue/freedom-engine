"use client";

/**
 * The Founder's device-level preference for HQ's ambient background (fog,
 * ember blooms, grain) — on by default at a balanced intensity. Persisted
 * in localStorage, same pattern as emberPreferences.ts: AmbientBackground
 * is mounted once at the root layout, so a toggle flipped on Profile needs
 * to reach that already-mounted instance live via a change event.
 */

const ENABLED_KEY = "ambient:enabled";
const INTENSITY_KEY = "ambient:intensity";
const CHANGE_EVENT = "ambient:changed";

export const DEFAULT_AMBIENT_INTENSITY = 0.6;

export interface AmbientPreference {
  enabled: boolean;
  intensity: number;
}

export function getAmbientPreference(): AmbientPreference {
  if (typeof window === "undefined") return { enabled: true, intensity: DEFAULT_AMBIENT_INTENSITY };
  const enabled = window.localStorage.getItem(ENABLED_KEY) !== "false";
  const stored = Number(window.localStorage.getItem(INTENSITY_KEY));
  const intensity = Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_AMBIENT_INTENSITY;
  return { enabled, intensity };
}

export function setAmbientEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ENABLED_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent<AmbientPreference>(CHANGE_EVENT, { detail: getAmbientPreference() }));
}

export function setAmbientIntensity(intensity: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTENSITY_KEY, String(intensity));
  window.dispatchEvent(new CustomEvent<AmbientPreference>(CHANGE_EVENT, { detail: getAmbientPreference() }));
}

export function onAmbientChange(handler: (pref: AmbientPreference) => void): () => void {
  if (typeof window === "undefined") return () => {};
  function listener(event: Event) {
    handler((event as CustomEvent<AmbientPreference>).detail);
  }
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
