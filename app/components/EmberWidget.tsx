"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EmberPanel } from "./EmberPanel";
import { EmberGlyph } from "./EmberGlyph";
import { pickRandom } from "../lib/emberProactiveMessage";
import { onEmberEvent } from "../lib/emberEvents";
import { isProactiveEnabled, onProactiveChange } from "../lib/emberPreferences";

/**
 * Ember's floating presence on HQ/Quest Board/Idea Vault — a quiet orb that
 * stretches into a message pill when there's something to say, then closes
 * itself again. Triggers: praise for completing a Quest or Build, a nod for
 * capturing a new Idea (all live, via emberEvents), and a greeting on
 * landing at Headquarters (once per session). No prompting, no "what's
 * next" nudging. All of it can be turned off from Profile — see
 * emberPreferences.ts and EmberProactiveToggle.
 */

// Only shown on these routes — Hall of Embers already has Ember front and
// center, and the widget would be noise on Profile/Login.
const WIDGET_PATHS = new Set(["/", "/quest-board", "/idea-vault", "/constitution"]);

// Short, punchy — praise, not a paragraph.
const QUEST_COMPLETE_NOTES = ["Quest complete.", "Well done, Founder.", "Nice work.", "Quest closed. On to the next."];

const BUILD_COMPLETE_NOTES = ["Build shipped.", "Nice work.", "Well done.", "One ember closer."];

const IDEA_CREATED_NOTES = ["Idea captured.", "Nice catch.", "Into the Vault it goes.", "Good one — logged."];

const HQ_ENTRY_NOTES = ["Good to have you back.", "Welcome back to the forge.", "Here whenever you need me."];

const HQ_GREETING_SESSION_KEY = "ember:hq-greeted";

const OPEN_DELAY_MS = 300;
const AUTO_CLOSE_MS = 7000;
const COLLAPSE_DURATION_MS = 450;

export function EmberWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // The panel content stays mounted once opened (rather than unmounting on
  // close) so its own state — draft text, history drawer, Presence mode —
  // survives closing and reopening, and so it's ready to fade in the moment
  // the orb finishes morphing into the panel shape.
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [lastBubbleText, setLastBubbleText] = useState<string | null>(null);
  const [proactiveEnabled, setProactiveEnabledState] = useState(isProactiveEnabled);

  // A genuinely new message always starts collapsed, so the open animates
  // even if one bubble replaces another mid-cycle.
  if (bubbleText !== lastBubbleText) {
    setLastBubbleText(bubbleText);
    setExpanded(false);
  }

  // The widget stays mounted across client-side navigation, so a toggle
  // flipped on the Profile page has to reach this instance live.
  useEffect(() => {
    return onProactiveChange((enabled) => {
      setProactiveEnabledState(enabled);
      if (!enabled) setBubbleText(null);
    });
  }, []);

  // Landing at Headquarters gets a plain greeting, once per browser session.
  // This has to be an effect (not the render-phase pattern used above) —
  // it reads and writes sessionStorage, and doing that mid-render runs on
  // the very first hydration pass, before the DOM has settled, which is
  // unreliable. An effect only ever runs after commit, on every mount and
  // on every client-side pathname change alike.
  useEffect(() => {
    if (!proactiveEnabled) return;
    if (pathname !== "/") return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(HQ_GREETING_SESSION_KEY)) return;
    window.sessionStorage.setItem(HQ_GREETING_SESSION_KEY, "1");
    // Deferred a tick, same as the event-subscription effect below — keeps
    // this out of the effect's synchronous body so it reads as reacting to
    // an external system rather than an unconditional render-triggered update.
    queueMicrotask(() => setBubbleText(pickRandom(HQ_ENTRY_NOTES)));
  }, [pathname, proactiveEnabled]);

  // Completing a Quest or Build, or capturing an Idea, anywhere in the app
  // takes over the pill immediately — the most timely thing Ember could say.
  useEffect(() => {
    return onEmberEvent((detail) => {
      if (!proactiveEnabled) return;
      if (detail.kind === "quest_completed") {
        setBubbleText(pickRandom(QUEST_COMPLETE_NOTES));
      } else if (detail.kind === "build_completed") {
        setBubbleText(pickRandom(BUILD_COMPLETE_NOTES));
      } else if (detail.kind === "idea_created") {
        setBubbleText(pickRandom(IDEA_CREATED_NOTES));
      }
    });
  }, [proactiveEnabled]);

  // The full open → hold → close lifecycle for whatever bubbleText currently is.
  useEffect(() => {
    if (!bubbleText) return;
    const openTimer = setTimeout(() => setExpanded(true), OPEN_DELAY_MS);
    const closeTimer = setTimeout(() => setExpanded(false), OPEN_DELAY_MS + AUTO_CLOSE_MS);
    const clearTimer = setTimeout(
      () => setBubbleText(null),
      OPEN_DELAY_MS + AUTO_CLOSE_MS + COLLAPSE_DURATION_MS
    );
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      clearTimeout(clearTimer);
    };
  }, [bubbleText]);

  if (!WIDGET_PATHS.has(pathname)) return null;

  const showBubble = bubbleText !== null && !open;

  function collapseThenClear() {
    setExpanded(false);
    setTimeout(() => setBubbleText(null), COLLAPSE_DURATION_MS);
  }

  function handleOpenPanel() {
    setOpen(true);
    setHasOpenedOnce(true);
    collapseThenClear();
  }

  function toggleOpen() {
    setOpen((v) => !v);
    setHasOpenedOnce(true);
  }

  return (
    <div className="fixed bottom-8 right-8 z-40 flex items-center justify-end gap-3">
      {/* Message pill — a separate, secondary bit of chrome next to the orb;
          only ever shown while closed. */}
      {showBubble && (
        <div className="flex h-12 items-center rounded-full border border-accent-glow/20 bg-surface pl-4 shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={handleOpenPanel}
            className={`truncate text-left text-sm leading-relaxed text-foreground/85 transition-all duration-500 ease-out ${
              expanded ? "max-w-[min(300px,calc(100vw-11rem))] pr-2 opacity-100" : "max-w-0 pr-0 opacity-0"
            }`}
          >
            {bubbleText}
          </button>
          <button
            type="button"
            onClick={collapseThenClear}
            aria-label="Dismiss"
            className={`shrink-0 overflow-hidden font-display text-xs text-muted/40 transition-all duration-500 ease-out hover:text-foreground/70 ${
              expanded ? "mr-4 max-w-4 opacity-100" : "mr-0 max-w-0 opacity-0"
            }`}
          >
            ✕
          </button>
        </div>
      )}

      {/* The orb itself — this same box morphs directly into the panel when
          opened (width/height/border-radius all transition together)
          instead of a separate panel appearing next to it. */}
      <div
        className={`relative overflow-hidden border bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out ${
          open
            ? "h-[70vh] max-h-[70vh] w-[min(480px,calc(100vw-3rem))] rounded-md border-card-border"
            : "h-16 w-16 rounded-full border-accent-glow/25"
        }`}
      >
        {/* Orb face — hidden as soon as opening starts. */}
        <button
          type="button"
          onClick={toggleOpen}
          aria-label="Ask Ember"
          aria-expanded={open}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            open ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <EmberGlyph className="h-14 w-14" />
        </button>

        {/* Panel face — mounted once opened the first time and left mounted
            afterward, so conversation state (draft text, history drawer,
            Presence mode) survives closing and reopening; fades in once
            there's room to actually show it. */}
        {hasOpenedOnce && (
          <div
            className={`absolute inset-0 flex w-[min(480px,calc(100vw-3rem))] flex-col overflow-hidden transition-opacity duration-200 ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.1), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
              aria-hidden
            />
            <div className="relative flex items-center gap-2.5 border-b border-card-border px-5 py-4">
              <EmberGlyph className="h-7 w-7" />
              <span className="font-display text-base tracking-wide text-foreground/90">Ember</span>
              <button
                type="button"
                onClick={toggleOpen}
                aria-label="Close Ember"
                className="ml-auto font-display text-xs text-muted/50 transition-colors duration-300 hover:text-foreground/80"
              >
                ✕
              </button>
            </div>
            <div className="relative flex-1 overflow-y-auto px-5 py-5">
              <EmberPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
