"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch {
      setError("Access not granted. Check your Founder credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-display text-[0.6rem] tracking-[0.22em] uppercase text-muted/55">
          Email
        </label>
        <div className="relative overflow-hidden rounded-sm">
          <div className="absolute inset-0 bg-surface-sunken" />
          <div
            className="pointer-events-none absolute inset-0 rounded-sm"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.06), inset 0 0 0 1px rgba(255,171,74,0.08)" }}
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
        <div className="relative overflow-hidden rounded-sm">
          <div className="absolute inset-0 bg-surface-sunken" />
          <div
            className="pointer-events-none absolute inset-0 rounded-sm"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,171,74,0.06), inset 0 0 0 1px rgba(255,171,74,0.08)" }}
            aria-hidden
          />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
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
        <p className="rounded-sm border border-accent/[0.07] bg-surface-sunken px-4 py-2.5 text-xs leading-relaxed text-muted/55">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="group relative mt-1 overflow-hidden rounded-sm py-3.5 font-display text-xs tracking-[0.18em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, rgba(255,171,74,0.16) 0%, rgba(77,216,255,0.10) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,171,74,0.14), 0 4px 24px rgba(0,0,0,0.35)",
          color: "rgba(255,171,74,0.90)",
          border: "1px solid rgba(255,171,74,0.12)",
        }}
      >
        <span className="relative z-10">{loading ? "Entering..." : "Enter HQ"}</span>
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse at center, rgba(77,216,255,0.07) 0%, transparent 70%)" }}
          aria-hidden
        />
      </button>

    </form>
  );
}
