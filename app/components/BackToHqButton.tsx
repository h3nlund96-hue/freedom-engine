"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Floating "return to Headquarters" button — replaces the old in-flow back
 * link every location page used to carry at the very top, which pushed real
 * content down before the Founder saw any of it. Fixed to the screen the
 * same way Ember's orb is (mirrored to the opposite corner), so it's always
 * reachable without costing any page space.
 */
export function BackToHqButton() {
  const pathname = usePathname();

  // Not on HQ itself (already there) or the login gate (no "back" to offer).
  if (pathname === "/" || pathname === "/login") return null;

  return (
    <Link
      href="/"
      aria-label="Return to AI Mastery HQ"
      title="AI Mastery HQ"
      className="group fixed bottom-8 left-8 z-40 flex size-14 items-center justify-center rounded-full border border-accent/35 bg-surface/40 shadow-[0_8px_28px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors duration-300 hover:border-accent/55"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="relative h-6 w-6 text-accent/85 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:text-accent"
      >
        <path
          d="M19 12H5M5 12L11 6M5 12L11 18"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
