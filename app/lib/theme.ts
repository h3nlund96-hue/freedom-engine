"use client";

/**
 * Light/dark preference, set from Profile > Options. Dark is the default —
 * this does not follow prefers-color-scheme — until the Founder switches,
 * at which point it's remembered in localStorage and re-applied on every
 * load via the blocking script in app/layout.tsx (avoids a flash of the
 * wrong theme before React hydrates).
 */

export type Theme = "dark" | "light";

const STORAGE_KEY = "founder-theme";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  if (theme === "light") {
    document.documentElement.dataset.theme = "light";
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing or storage disabled — the choice just won't persist.
  }
}

/** The literal script text inlined into <head> so the stored theme applies
 * before first paint, not after React hydrates. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light")document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`;
