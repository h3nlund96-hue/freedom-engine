type LocationHeaderProps = {
  icon?: string;
  eyebrow: string;
  title: string;
  description: string;
  lore?: string;
};

/**
 * Compact location header — icon and title share one row so real content
 * starts sooner on small screens. The back-to-HQ link that used to sit
 * above this is now BackToHqButton, floating and fixed to the screen
 * instead of costing space at the top of every page.
 */
export function LocationHeader({ icon, eyebrow, title, description, lore }: LocationHeaderProps) {
  return (
    <header className="animate-fade-up flex items-start gap-3.5">
      {icon && (
        <span className="icon-pulse-glow mt-1 inline-block w-fit shrink-0 font-display text-3xl leading-none text-accent">
          {icon}
        </span>
      )}

      <div className="min-w-0 space-y-1">
        <h1 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-display text-2xl font-medium tracking-wide text-foreground sm:text-3xl">
            {title}
          </span>
          <span className="font-display text-[0.55rem] tracking-[0.22em] uppercase text-accent/85">
            {eyebrow}
          </span>
        </h1>
        <p className="text-sm leading-relaxed text-muted sm:text-base">{description}</p>
        {lore && (
          <p className="pt-0.5 text-xs italic leading-relaxed text-muted/55">{lore}</p>
        )}
      </div>
    </header>
  );
}
