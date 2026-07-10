import Link from "next/link";

type LocationHeaderProps = {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  lore?: string;
};

/**
 * Compact location header — icon, title and back-link share one row so
 * real content starts sooner on small screens. Replaces the old tall
 * hero (eyebrow above title, divider, separate description block).
 */
export function LocationHeader({ icon, eyebrow, title, description, lore }: LocationHeaderProps) {
  return (
    <>
      {/* Back navigation */}
      <nav className="animate-fade-up" aria-label="Back to headquarters">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded text-sm text-muted/70 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
            ←
          </span>
          <span className="font-display text-xs tracking-[0.22em] uppercase">AI Mastery HQ</span>
        </Link>
      </nav>

      {/* Location header */}
      <header className="animate-fade-up flex items-start gap-4" style={{ animationDelay: "0.06s" }}>
        <div className="relative mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-linear-to-br from-[rgba(18,25,38,0.9)] to-[rgba(8,10,16,0.95)] text-xl shadow-[0_6px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,171,74,0.06)]">
          {icon}
        </div>

        <div className="min-w-0 space-y-1">
          <h1 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-display text-2xl font-medium tracking-wide text-foreground sm:text-3xl">
              {title}
            </span>
            <span className="font-display text-[0.55rem] tracking-[0.22em] uppercase text-accent/70">
              {eyebrow}
            </span>
          </h1>
          <p className="text-sm leading-relaxed text-muted sm:text-base">{description}</p>
          {lore && (
            <p className="pt-0.5 text-xs italic leading-relaxed text-muted/55">{lore}</p>
          )}
        </div>
      </header>
    </>
  );
}
