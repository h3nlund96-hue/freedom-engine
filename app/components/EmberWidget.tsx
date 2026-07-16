"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EmberPanel } from "./EmberPanel";
import { EmberGlyph } from "./EmberGlyph";
import { getProgressClient } from "../lib/questMutationService";
import { getActiveQuest, getCurrentBuild } from "../data/freedomEngineProgress";
import { pickProactiveNote } from "../lib/emberProactiveMessage";

// Only shown on these routes — Hall of Embers already has Ember front and
// center, and the widget would be noise on Constitution/Profile/Login.
const WIDGET_PATHS = new Set(["/", "/quest-board", "/idea-vault"]);

export function EmberWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!WIDGET_PATHS.has(pathname)) return;

    let cancelled = false;
    getProgressClient()
      .then((progress) => {
        if (cancelled) return;
        const quest = getActiveQuest(progress);
        const build = quest ? getCurrentBuild(quest) : undefined;
        const proactive = pickProactiveNote(quest?.title, build?.title);
        if (proactive) setNote(proactive);
      })
      .catch(() => {
        // No note — the plain orb is enough.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Let the orb render first, then unfurl a beat later — reads as a
  // stretch, not a jump-cut.
  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setExpanded(true), 350);
    return () => clearTimeout(timer);
  }, [note]);

  if (!WIDGET_PATHS.has(pathname)) return null;

  const showBubble = note !== null && !open;

  function handleOpen() {
    setOpen(true);
    setNote(null);
    setExpanded(false);
  }

  function handleDismiss() {
    setNote(null);
    setExpanded(false);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
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
                onClick={handleOpen}
                className={`overflow-hidden text-ellipsis whitespace-nowrap pr-1 text-left text-xs leading-relaxed text-foreground/85 transition-all duration-500 ease-out ${
                  expanded ? "max-w-[min(260px,calc(100vw-6rem))] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                {note}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="mr-3.5 shrink-0 font-display text-[0.65rem] text-muted/40 transition-colors duration-300 hover:text-foreground/70"
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
