"use client";

/**
 * The Founder's device-level preference for Ember's proactive widget
 * messages (completion praise, idea-capture feedback, the HQ greeting).
 * Persisted in localStorage — it should stick across sessions, not just the
 * current tab. Off by choice, on by default (matches the widget's existing
 * behavior before this preference existed).
 *
 * The floating widget stays mounted across client-side navigation, so a
 * toggle flipped on the Profile page needs to reach that already-mounted
 * instance live — hence the change event, the same pattern as emberEvents.ts.
 */

const STORAGE_KEY = "ember:proactive-enabled";
const CHANGE_EVENT = "ember:proactive-changed";

export function isProactiveEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setProactiveEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent<boolean>(CHANGE_EVENT, { detail: enabled }));
}

export function onProactiveChange(handler: (enabled: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};
  function listener(event: Event) {
    handler((event as CustomEvent<boolean>).detail);
  }
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
