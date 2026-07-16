"use client";

/**
 * A tiny cross-component event bus (window CustomEvents) so completing a
 * Quest or Build anywhere in the app — the Quest Board's Complete button,
 * the edit form, or one of Ember's own approved proposals — can notify the
 * floating widget without threading a callback through every call site.
 */

export type EmberEventDetail =
  | { kind: "quest_completed"; title: string }
  | { kind: "build_completed"; title: string };

const EVENT_NAME = "ember:event";

export function emitEmberEvent(detail: EmberEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<EmberEventDetail>(EVENT_NAME, { detail }));
}

/** Subscribes for as long as the caller keeps the returned cleanup around — call it on unmount. */
export function onEmberEvent(handler: (detail: EmberEventDetail) => void): () => void {
  if (typeof window === "undefined") return () => {};
  function listener(event: Event) {
    handler((event as CustomEvent<EmberEventDetail>).detail);
  }
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
