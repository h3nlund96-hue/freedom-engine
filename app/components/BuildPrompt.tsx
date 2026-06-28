export function BuildPrompt() {
  return (
    <footer
      className="animate-fade-up mt-8 space-y-5"
      style={{ animationDelay: "0.75s" }}
    >
      <div className="flex items-center gap-4">
        <span
          className="h-px flex-1 bg-linear-to-r from-transparent via-accent/10 to-transparent"
          aria-hidden
        />
        <span
          className="size-1 rounded-full bg-accent/40 shadow-[0_0_8px_rgba(212,165,116,0.5)]"
          aria-hidden
        />
        <span
          className="h-px flex-1 bg-linear-to-r from-transparent via-accent/10 to-transparent"
          aria-hidden
        />
      </div>

      <p className="font-display text-center text-lg text-foreground/85 sm:text-left sm:text-xl">
        What would you like to build today?
      </p>

      <div className="group relative">
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-b from-accent/10 via-transparent to-accent-glow/5 opacity-0 blur-sm transition-opacity duration-700 group-focus-within:opacity-100"
          aria-hidden
        />
        <label htmlFor="build-intent" className="sr-only">
          What would you like to build today?
        </label>
        <input
          id="build-intent"
          type="text"
          placeholder="Speak your intention into the world…"
          className="relative w-full rounded-2xl border-0 bg-[rgba(12,10,8,0.6)] px-5 py-4 text-base text-foreground/90 shadow-[inset_0_2px_12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,165,116,0.06)] backdrop-blur-md transition-all duration-500 placeholder:text-muted/40 focus:bg-[rgba(16,13,10,0.75)] focus:shadow-[inset_0_2px_12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(212,165,116,0.12),0_0_32px_rgba(232,132,42,0.08)] focus:outline-none"
        />
      </div>
    </footer>
  );
}
