type QuestStatusProps = {
  sectionTitle: string;
  mainQuest: string;
  currentQuestline: string;
  currentBuild: string;
};

export function QuestStatus({
  sectionTitle,
  mainQuest,
  currentQuestline,
  currentBuild,
}: QuestStatusProps) {
  return (
    <section
      className="animate-fade-up group/quest relative"
      style={{ animationDelay: "0.25s" }}
    >
      {/* Outer glow */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(212,165,116,0.06)_0%,transparent_70%)] opacity-80"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[rgba(24,20,16,0.85)] to-[rgba(10,9,8,0.92)] px-6 py-7 shadow-[0_24px_64px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(212,165,116,0.07)] backdrop-blur-md sm:px-8 sm:py-9">
        {/* Inner top light */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-accent/[0.04] to-transparent"
          aria-hidden
        />

        {/* Corner marks */}
        <span
          className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-accent/15"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-accent/15"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-accent/10"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-accent/10"
          aria-hidden
        />

        <h2 className="relative mb-8 font-display text-xl tracking-wide text-accent sm:text-2xl">
          {sectionTitle}
        </h2>

        <dl className="relative space-y-0">
          <QuestRow label="Main Quest" value={mainQuest} />
          <QuestRow
            label="Current Questline"
            value={currentQuestline}
            active
          />
          <QuestRow label="Current Build" value={currentBuild} isLast />
        </dl>
      </div>
    </section>
  );
}

function QuestRow({
  label,
  value,
  active = false,
  isLast = false,
}: {
  label: string;
  value: string;
  active?: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={`group relative py-5 ${!isLast ? "border-b border-accent/[0.06]" : ""}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <dt className="flex min-w-40 shrink-0 items-center gap-2.5 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-muted/80">
          {active && (
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-glow-pulse rounded-full bg-accent-glow/80" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(232,132,42,0.6)]" />
            </span>
          )}
          {label}
        </dt>
        <dd
          className={`text-base leading-relaxed transition-colors duration-500 ${
            active
              ? "font-display text-accent-glow/95"
              : "text-foreground/80 group-hover:text-foreground/95"
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}
