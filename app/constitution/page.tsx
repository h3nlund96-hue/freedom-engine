import Link from "next/link";
import type { Metadata } from "next";
import { AtmosphericBackground } from "../components/AtmosphericBackground";

export const metadata: Metadata = {
  title: "The Founder Constitution — Freedom Engine",
  description: "The moral compass of Freedom Engine.",
};

const principles = [
  {
    numeral: "I",
    title: "Freedom First",
    body: "Frihet er kompasset mitt. Alle store beslutninger vurderes ut fra om de bringer meg nærmere et liv med mer frihet for meg selv, familien min og menneskene rundt meg.",
  },
  {
    numeral: "II",
    title: "Build",
    body: "Jeg lærer ved å bygge. Handling skaper klarhet. Jeg skaper før jeg konsumerer. Små prototyper er bedre enn perfekte planer. Hver uke bygger jeg noe som ikke eksisterte uken før.",
  },
  {
    numeral: "III",
    title: "Curiosity",
    body: "Jeg lar nysgjerrighet åpne nye dører, men jeg lar kompasset bestemme hvilke jeg går gjennom.",
  },
  {
    numeral: "IV",
    title: "Tend the Fire",
    body: "Jeg holder flammen levende. Jeg trenger ikke gjøre alt. Jeg trenger bare å legge på én vedkubbe. Små handlinger holder eventyret levende. Når jeg har lagt på dagens vedkubbe, kan jeg avslutte dagen med god samvittighet. Flammen venter alltid på meg.",
  },
];

export default function ConstitutionPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground variant="constitution" />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">

        {/* Back link */}
        <nav className="animate-fade-up" aria-label="Back to headquarters">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded text-muted/70 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
          >
            <span
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            >
              ←
            </span>
            <span className="font-display text-xs tracking-[0.22em] uppercase">
              AI Mastery HQ
            </span>
          </Link>
        </nav>

        {/* Hall header */}
        <header
          className="animate-fade-up space-y-7"
          style={{ animationDelay: "0.08s" }}
        >
          <div className="space-y-1">
            <p className="font-display text-[0.65rem] tracking-[0.28em] uppercase text-accent/65">
              Constitution Hall
            </p>
            <h1 className="font-display text-4xl font-medium tracking-wide text-foreground sm:text-5xl">
              The Founder Constitution
            </h1>
            <p className="pt-1 text-base text-muted sm:text-lg">
              The moral compass of Freedom Engine.
            </p>
          </div>

          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-linear-to-r from-accent/30 to-accent/10" />
            <span className="size-[3px] rounded-full bg-accent/40 shadow-[0_0_8px_rgba(255,171,74,0.4)]" />
            <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" />
          </div>

          <p className="max-w-lg text-base leading-relaxed text-foreground/70">
            These principles guide every major decision inside Freedom Engine.
          </p>
        </header>

        {/* Core rule — the foundation stone */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.18s" }}
        >
          <CoreRule />
        </div>

        {/* Principles section */}
        <section
          className="animate-fade-up space-y-8"
          style={{ animationDelay: "0.28s" }}
        >
          <div className="flex items-center gap-4">
            <p className="font-display text-[0.65rem] tracking-[0.25em] uppercase text-muted/55">
              The Principles
            </p>
            <span
              className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent"
              aria-hidden
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((p, i) => (
              <ConstitutionTablet
                key={p.numeral}
                numeral={p.numeral}
                title={p.title}
                body={p.body}
                delay={0.32 + i * 0.09}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="animate-fade-up mt-auto flex items-center gap-4 pt-4"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">
            Constitution Hall · Freedom Engine
          </p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}

function CoreRule() {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/[0.07]">
      {/* Layered background */}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(14,23,38,0.92)] to-[rgba(6,8,14,0.97)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,171,74,0.07)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.08),inset_0_-1px_0_rgba(0,0,0,0.4)]" aria-hidden />

      {/* Corner engravings */}
      <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-accent/20" aria-hidden />
      <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-accent/20" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-accent/12" aria-hidden />
      <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-accent/12" aria-hidden />

      <div className="relative px-8 py-9 sm:px-10 sm:py-10">
        <p className="mb-5 font-display text-[0.6rem] tracking-[0.3em] uppercase text-accent/50">
          Core Rule
        </p>
        <div className="space-y-1">
          <p className="font-display text-xl leading-snug tracking-wide text-foreground/95 sm:text-2xl">
            The system exists to serve The Founder.
          </p>
          <p className="font-display text-xl leading-snug tracking-wide text-foreground/95 sm:text-2xl">
            The Founder does not exist to serve the system.
          </p>
        </div>
        {/* Glow line under */}
        <div className="mt-8 h-px w-full bg-linear-to-r from-transparent via-accent/15 to-transparent" aria-hidden />
      </div>
    </div>
  );
}

function ConstitutionTablet({
  numeral,
  title,
  body,
  delay,
}: {
  numeral: string;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <article
      className="group animate-fade-up relative overflow-hidden rounded-md border border-white/[0.07] transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,171,74,0.08)]"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Base */}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(12,18,30,0.85)] to-[rgba(6,8,14,0.95)]" />
      {/* Hover wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,171,74,0.06)_0%,transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {/* Top highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,171,74,0.06)]" aria-hidden />

      {/* Hover bottom glow */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/0 to-transparent transition-all duration-700 group-hover:via-accent/20"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 p-6 sm:p-7">
        {/* Numeral */}
        <div className="flex items-center gap-3">
          <span className="font-display text-xs tracking-[0.2em] text-accent/40 transition-colors duration-500 group-hover:text-accent/60">
            {numeral}
          </span>
          <span className="h-px flex-1 bg-linear-to-r from-accent/10 to-transparent" aria-hidden />
        </div>

        {/* Title */}
        <h2 className="font-display text-xl tracking-wide text-foreground/90 transition-colors duration-500 group-hover:text-foreground">
          {title}
        </h2>

        {/* Body */}
        <p className="text-sm leading-relaxed text-muted/85 transition-colors duration-500 group-hover:text-foreground/65">
          {body}
        </p>
      </div>
    </article>
  );
}
