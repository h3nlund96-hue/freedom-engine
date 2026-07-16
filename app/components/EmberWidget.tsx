"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EmberPanel } from "./EmberPanel";
import { EmberGlyph } from "./EmberGlyph";
import { pickRandom } from "../lib/emberProactiveMessage";
import { onEmberEvent } from "../lib/emberEvents";

/**
 * Ember's floating presence on HQ/Quest Board/Idea Vault — a quiet orb that
 * stretches into a message pill when there's something to say, then closes
 * itself again. Only two kinds of things trigger it: approval/praise for
 * completing a Quest or Build (live, via emberEvents), and a greeting on
 * landing at Headquarters. No prompting, no "what's next" nudging.
 */

// Only shown on these routes — Hall of Embers already has Ember front and
// center, and the widget would be noise on Constitution/Profile/Login.
const WIDGET_PATHS = new Set(["/", "/quest-board", "/idea-vault"]);

const QUEST_COMPLETE_NOTES: ((quest: string) => string)[] = [
  (quest) => `${quest} — done. Nicely closed out.`,
  (quest) => `That's ${quest} complete. Good work, Founder.`,
  (quest) => `${quest} is closed. On to the next one.`,
];

const BUILD_COMPLETE_NOTES: ((build: string) => string)[] = [
  (build) => `${build} — shipped.`,
  (build) => `That's ${build} done. Keep the momentum.`,
  (build) => `${build} complete. One ember closer.`,
];

const HQ_ENTRY_NOTES = ["Good to have you back.", "Welcome back to the forge.", "Here whenever you need me."];

const OPEN_DELAY_MS = 300;
const AUTO_CLOSE_MS = 7000;
const COLLAPSE_DURATION_MS = 450;

export function EmberWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [lastBubbleText, setLastBubbleText] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState<string | null>(null);

  // A genuinely new message always starts collapsed, so the open animates
  // even if one bubble replaces another mid-cycle.
  if (bubbleText !== lastBubbleText) {
    setLastBubbleText(bubbleText);
    setExpanded(false);
  }

  // Landing at Headquarters gets a plain greeting — checked here (not an
  // effect) so it fires on the very first render too, not just subsequent
  // navigations.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (pathname === "/") setBubbleText(pickRandom(HQ_ENTRY_NOTES));
  }

  // Completing a Quest or Build anywhere in the app takes over the pill
  // immediately — the most timely thing Ember could say.
  useEffect(() => {
    return onEmberEvent((detail) => {
      if (detail.kind === "quest_completed") {
        setBubbleText(pickRandom(QUEST_COMPLETE_NOTES)(detail.title));
      } else if (detail.kind === "build_completed") {
        setBubbleText(pickRandom(BUILD_COMPLETE_NOTES)(detail.title));
      }
    });
  }, []);

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
    collapseThenClear();
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex justify-end">
        <div className="flex h-12 items-center rounded-full border border-accent-glow/25 bg-[rgba(10,17,30,0.94)] shadow-[0_8px_28px_rgba(0,0,0,0.5)]">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close Ember" : "Ask Ember"}
            aria-expanded={open}
            className="flex size-12 shrink-0 items-center justify-center rounded-full"
          >
            {open ? <span className="font-display text-sm text-muted/70">✕</span> : <EmberGlyph className="h-6 w-6" />}
          </button>

          {showBubble && (
            <>
              <button
                type="button"
                onClick={handleOpenPanel}
                className={`truncate text-left text-xs leading-relaxed text-foreground/85 transition-all duration-500 ease-out ${
                  expanded ? "max-w-[min(300px,calc(100vw-7rem))] pr-2 opacity-100" : "max-w-0 pr-0 opacity-0"
                }`}
              >
                {bubbleText}
              </button>
              <button
                type="button"
                onClick={collapseThenClear}
                aria-label="Dismiss"
                className={`shrink-0 overflow-hidden font-display text-[0.65rem] text-muted/40 transition-all duration-500 ease-out hover:text-foreground/70 ${
                  expanded ? "mr-3.5 max-w-4 opacity-100" : "mr-0 max-w-0 opacity-0"
                }`}
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[min(420px,calc(100vw-3rem))] max-h-[70vh] overflow-hidden rounded-md border border-white/[0.08]">
          <div className="relative flex max-h-[70vh] flex-col overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[rgba(11,20,35,0.97)] to-[rgba(6,9,16,0.99)]" />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.1), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
              aria-hidden
            />
            <div className="relative flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
              <EmberGlyph className="h-5 w-5" />
              <span className="font-display text-sm tracking-wide text-foreground/90">Ember</span>
            </div>
            <div className="relative overflow-y-auto px-5 py-5">
              <EmberPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
