"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { EmberPanel } from "./EmberPanel";
import { EmberGlyph } from "./EmberGlyph";

// Only shown on these routes — Hall of Embers already has Ember front and
// center, and the widget would be noise on Constitution/Profile/Login.
const WIDGET_PATHS = new Set(["/", "/quest-board", "/idea-vault"]);

export function EmberWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!WIDGET_PATHS.has(pathname)) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Ember" : "Ask Ember"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full border border-accent-glow/25 bg-[rgba(10,17,30,0.94)] shadow-[0_8px_28px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
      >
        {open ? <span className="font-display text-sm text-muted/70">✕</span> : <EmberGlyph size="text-xl" />}
      </button>

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
              <EmberGlyph size="text-lg" />
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
