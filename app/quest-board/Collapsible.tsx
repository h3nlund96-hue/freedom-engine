"use client";

import { useState } from "react";

export function Collapsible({
  label,
  count,
  defaultOpen = false,
  children,
}: {
  label: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30 rounded"
        aria-expanded={open}
      >
        <span className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55 transition-colors duration-300 group-hover:text-muted/80">
          {label}
        </span>
        {count !== undefined && (
          <span className="rounded-full bg-muted/8 px-1.5 py-0.5 font-display text-[0.58rem] tracking-wide text-muted/40">
            {count}
          </span>
        )}
        <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
        <span
          className={`text-[0.55rem] text-muted/35 transition-transform duration-300 group-hover:text-muted/55 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
