"use client";

import { useEffect, useState } from "react";

const CHARS_PER_TICK = 2;
const TICK_MS = 18;

/**
 * Reveals `text` progressively instead of all at once — this is what lets
 * Ember's glyph animate "while she speaks" today, and is the exact seam
 * real voice output will drive later instead of a fixed typing speed.
 * Resets and re-reveals whenever `text` changes to a new value.
 */
export function useTypewriterReveal(text: string): { revealed: string; speaking: boolean } {
  const [prevText, setPrevText] = useState(text);
  const [length, setLength] = useState(text.length);

  if (text !== prevText) {
    setPrevText(text);
    setLength(0);
  }

  useEffect(() => {
    if (!text) return;
    const interval = setInterval(() => {
      setLength((prev) => {
        const next = Math.min(prev + CHARS_PER_TICK, text.length);
        if (next >= text.length) clearInterval(interval);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [text]);

  return { revealed: text.slice(0, length), speaking: length < text.length };
}
