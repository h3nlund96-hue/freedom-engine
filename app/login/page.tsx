import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { EmberGlyph } from "../components/EmberGlyph";
import { CornerMarks } from "../components/CornerMarks";
import { PanelAtmosphere } from "../components/PanelAtmosphere";

export const metadata: Metadata = {
  title: "Enter the Headquarters — Freedom Engine",
  description: "Founder access to Freedom Engine.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <PanelAtmosphere bias="amber" />
      <main className="relative flex min-h-full flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">

          {/* Gate mark */}
          <div className="mb-12 flex flex-col items-center gap-4">
            <EmberGlyph className="h-16 w-16" />

            <div className="space-y-2 text-center">
              <p className="font-display text-[0.6rem] tracking-[0.28em] uppercase text-accent/75">
                Freedom Engine
              </p>
              <h1 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
                Enter the Headquarters
              </h1>
              <p className="text-sm text-muted/55">
                Sign in to return to AI Mastery HQ.
              </p>
            </div>
          </div>

          {/* Panel */}
          <div className="relative overflow-hidden rounded-md border border-card-border">
            <CornerMarks size={8} inset="6px" />
            <div className="absolute inset-0 bg-linear-to-br from-surface-raised to-surface" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top, rgba(255,171,74,0.05) 0%, transparent 60%)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.09), inset 0 0 0 1px rgba(255,171,74,0.04)" }}
              aria-hidden
            />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent" aria-hidden />

            <div className="relative px-7 py-8">
              <LoginForm />
            </div>
          </div>

          {/* Footer mark */}
          <p className="mt-8 text-center text-[0.6rem] tracking-[0.18em] uppercase text-muted/25">
            Founder access only
          </p>

        </div>
      </main>
    </div>
  );
}
