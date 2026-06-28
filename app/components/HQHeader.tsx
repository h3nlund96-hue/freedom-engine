type HQHeaderProps = {
  title: string;
  welcome: string;
};

export function HQHeader({ title, welcome }: HQHeaderProps) {
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
      <h1 className="font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="text-lg text-muted sm:text-xl">{welcome}</p>
    </header>
  );
}
