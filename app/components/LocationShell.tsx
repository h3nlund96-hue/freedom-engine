import Link from "next/link";
import { AtmosphericBackground } from "./AtmosphericBackground";

type LocationShellProps = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  lore: string;
  accent?: string;
  children?: React.ReactNode;
};

export function LocationShell({
  icon,
  title,
  subtitle,
  description,
  lore,
  children,
}: LocationShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">
        {/* Back navigation */}
        <nav
          className="animate-fade-up"
          style={{ animationDelay: "0s" }}
          aria-label="Back to headquarters"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-sm text-muted/70 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded"
          >
            <span
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            >
              ←
            </span>
            <span className="font-display tracking-wide text-xs uppercase">
              AI Mastery HQ
            </span>
          </Link>
        </nav>

        {/* Location header */}
        <header
          className="animate-fade-up space-y-6"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-start gap-5">
            <div className="relative mt-1 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[rgba(28,24,18,0.9)] to-[rgba(12,10,8,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(212,165,116,0.06)]">
              <span className="text-3xl">{icon}</span>
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl border border-accent/[0.06]"
                aria-hidden
              />
            </div>

            <div className="space-y-2">
              <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-accent/70">
                {subtitle}
              </p>
              <h1 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
                {title}
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px flex-1 bg-linear-to-r from-accent/15 to-transparent" />
            <span className="size-1 rounded-full bg-accent/25 shadow-[0_0_8px_rgba(212,165,116,0.3)]" />
            <span className="h-px w-8 bg-accent/10" />
          </div>

          <p className="max-w-lg text-base leading-relaxed text-foreground/75 sm:text-lg">
            {description}
          </p>
        </header>

        {/* Lore block */}
        <blockquote
          className="animate-fade-up relative py-1 pl-7"
          style={{ animationDelay: "0.2s" }}
        >
          <span
            className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/40 via-accent/15 to-transparent"
            aria-hidden
          />
          <span
            className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/50 shadow-[0_0_10px_rgba(232,132,42,0.35)]"
            aria-hidden
          />
          <p className="font-display text-sm italic leading-relaxed text-muted/90 sm:text-base">
            {lore}
          </p>
        </blockquote>

        {/* Optional children (future content areas) */}
        {children && (
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {children}
          </div>
        )}

        {/* Alpha notice */}
        <footer
          className="animate-fade-up mt-auto"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/35">
            Alpha — This location is being built.
          </p>
        </footer>
      </main>
    </div>
  );
}
