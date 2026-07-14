type HQHeaderProps = {
  title: string;
};

export function HQHeader({ title }: HQHeaderProps) {
  return (
    <header className="animate-fade-up space-y-4">
      <div className="flex items-center gap-3">
        <span
          className="h-px w-8 bg-linear-to-r from-transparent to-accent/60"
          aria-hidden
        />
        <p className="font-display text-xs tracking-[0.25em] uppercase text-accent/80">
          Headquarters
        </p>
      </div>
      <h1 className="flex items-center gap-3.5 font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">
        <span className="hq-glyph-mount text-3xl sm:text-4xl" aria-hidden>
          <span className="hq-glyph-spin">
            <span className="hq-glyph-char text-accent">⌬</span>
          </span>
        </span>
        <span className="hq-title-settle">{title}</span>
      </h1>
    </header>
  );
}
