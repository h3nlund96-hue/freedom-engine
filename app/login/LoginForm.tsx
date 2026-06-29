"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-display text-[0.6rem] tracking-[0.22em] uppercase text-muted/55">
            Email
          </label>
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ boxShadow: "inset 0 1px 0 rgba(212,165,116,0.06), inset 0 0 0 1px rgba(212,165,116,0.08)" }}
              aria-hidden
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="founder@freedomengine.co"
              className="relative w-full bg-transparent px-5 py-3.5 text-sm text-foreground/85 placeholder:text-muted/25 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-display text-[0.6rem] tracking-[0.22em] uppercase text-muted/55">
            Password
          </label>
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ boxShadow: "inset 0 1px 0 rgba(212,165,116,0.06), inset 0 0 0 1px rgba(212,165,116,0.08)" }}
              aria-hidden
            />
            <input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="relative w-full bg-transparent px-5 py-3.5 text-sm text-foreground/85 placeholder:text-muted/25 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-accent/[0.07] bg-black/20 px-4 py-2.5 text-xs leading-relaxed text-muted/55">
            {error}
          </p>
        )}

        {/* Notice */}
        {notice && (
          <p className="rounded-lg border border-accent/[0.10] bg-accent/[0.03] px-4 py-2.5 text-xs leading-relaxed text-accent/70">
            {notice}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-1 overflow-hidden rounded-xl py-3.5 text-sm font-medium tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, rgba(212,165,116,0.16) 0%, rgba(232,132,42,0.10) 100%)",
            boxShadow: "inset 0 1px 0 rgba(212,165,116,0.14), 0 4px 24px rgba(0,0,0,0.35)",
            color: "rgba(212,165,116,0.90)",
            border: "1px solid rgba(212,165,116,0.12)",
          }}
        >
          <span className="relative z-10">
            {loading ? "Entering..." : mode === "signin" ? "Enter the Headquarters" : "Create Founder Account"}
          </span>
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(ellipse at center, rgba(232,132,42,0.07) 0%, transparent 70%)" }}
            aria-hidden
          />
        </button>
      </form>

      {/* Mode toggle */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-muted/30">
          {mode === "signin" ? "No account yet?" : "Already have access?"}
        </span>
        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNotice(null); }}
          className="font-display text-[0.65rem] tracking-[0.14em] uppercase text-accent/50 transition-colors duration-300 hover:text-accent/75"
        >
          {mode === "signin" ? "Create account" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
