/* ── VARIANT CONFIG ───────────────────────────────────────────────────────── */

type AtmosphericVariant =
  | "hq"
  | "constitution"
  | "quest-board"
  | "idea-vault"
  | "companions"
  | "login"
  | "default";

interface VariantConfig {
  overheadColor: string;
  tint?: string;       // subtle overall hue shift layer
  glow1: string;
  glow2: string;
  floor: string;
}

const VARIANTS: Record<AtmosphericVariant, VariantConfig> = {
  hq: {
    overheadColor: "rgba(255,171,74,0.09)",
    glow1: "rgba(255,171,74,0.06)",
    glow2: "rgba(77,216,255,0.04)",
    floor: "rgba(255,171,74,0.04)",
  },
  constitution: {
    overheadColor: "rgba(255,171,74,0.08)",    // command-deck amber
    tint: "rgba(77,216,255,0.02)",
    glow1: "rgba(255,171,74,0.05)",
    glow2: "rgba(77,216,255,0.03)",
    floor: "rgba(255,171,74,0.03)",
  },
  "quest-board": {
    overheadColor: "rgba(255,171,74,0.11)",    // mission-control, strongest signal
    glow1: "rgba(255,171,74,0.06)",
    glow2: "rgba(77,216,255,0.05)",
    floor: "rgba(255,171,74,0.04)",
  },
  "idea-vault": {
    overheadColor: "rgba(77,216,255,0.07)",    // cool cyan, encrypted archive
    tint: "rgba(77,216,255,0.025)",
    glow1: "rgba(77,216,255,0.045)",
    glow2: "rgba(90,150,180,0.035)",
    floor: "rgba(60,140,170,0.03)",
  },
  companions: {
    overheadColor: "rgba(77,216,255,0.08)",    // comms channel, cyan-leaning
    tint: "rgba(77,216,255,0.03)",
    glow1: "rgba(77,216,255,0.05)",
    glow2: "rgba(255,171,74,0.03)",
    floor: "rgba(60,140,170,0.03)",
  },
  login: {
    overheadColor: "rgba(255,171,74,0.08)",
    glow1: "rgba(255,171,74,0.05)",
    glow2: "rgba(77,216,255,0.03)",
    floor: "rgba(255,171,74,0.04)",
  },
  default: {
    overheadColor: "rgba(255,171,74,0.09)",
    glow1: "rgba(255,171,74,0.06)",
    glow2: "rgba(77,216,255,0.04)",
    floor: "rgba(255,171,74,0.04)",
  },
};

/* ── COMPONENT ────────────────────────────────────────────────────────────── */

export function AtmosphericBackground({
  variant = "hq",
}: {
  variant?: AtmosphericVariant;
}) {
  const v = VARIANTS[variant];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Base depth gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#0e131c] via-[#070a10] to-[#04060a]" />

      {/* Per-variant hue tint */}
      {v.tint && (
        <div className="absolute inset-0" style={{ background: v.tint }} />
      )}

      {/* Overhead instrument light */}
      <div
        className="absolute -top-1/4 left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${v.overheadColor} 0%, transparent 65%)`,
        }}
      />

      {/* Telemetry glow pools */}
      <div
        className="animate-ember-drift absolute -left-20 top-1/4 h-[28rem] w-[28rem] rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${v.glow1} 0%, transparent 70%)` }}
      />
      <div
        className="animate-ember-drift absolute -right-16 top-1/2 h-80 w-80 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${v.glow2} 0%, transparent 70%)`, animationDelay: "-5s" }}
      />
      <div
        className="animate-ember-drift absolute left-1/4 top-2/3 h-72 w-72 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${v.glow1} 0%, transparent 70%)`, animationDelay: "-9s" }}
      />
      <div
        className="animate-ember-drift absolute right-1/4 top-1/4 h-64 w-64 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${v.glow2} 0%, transparent 70%)`, animationDelay: "-3s" }}
      />
      <div
        className="animate-ember-drift absolute -left-10 top-2/3 h-56 w-56 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${v.glow2} 0%, transparent 70%)`, animationDelay: "-12s" }}
      />
      <div
        className="animate-ember-drift absolute right-[10%] top-[15%] h-48 w-48 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${v.glow1} 0%, transparent 70%)`, animationDelay: "-7s" }}
      />

      {/* Floor instrument glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: `radial-gradient(ellipse at bottom, ${v.floor} 0%, transparent 60%)` }}
      />

      {/* HUD grid — faint, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,205,230,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(180,205,230,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 0%, transparent 75%)",
        }}
      />

      {/* Vignette — strengthened corners for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
      {/* Extra corner deepening */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_center,transparent_50%,rgba(0,0,0,0.30)_100%)]" />

      {/* Floating particles — distant telemetry points */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="animate-particle-float absolute rounded-full bg-accent-glow/30"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Film grain — slightly stronger */}
      <div className="noise-overlay absolute inset-0 opacity-[0.052] mix-blend-overlay" />

      {/* Horizon line */}
      <div className="animate-glow-pulse absolute bottom-[18%] left-1/2 h-px w-1/2 max-w-xl -translate-x-1/2 bg-linear-to-r from-transparent via-accent/15 to-transparent" />
    </div>
  );
}

/* ── PARTICLES ────────────────────────────────────────────────────────────── */

const particles = [
  // Tiny
  { id:  1, left: "12%", top: "22%", size: "1.5px", delay: "0s",   duration: "14s", opacity: 0.45 },
  { id:  2, left: "78%", top: "18%", size: "1px",   delay: "-3s",  duration: "18s", opacity: 0.35 },
  { id:  3, left: "45%", top: "35%", size: "1px",   delay: "-7s",  duration: "20s", opacity: 0.28 },
  { id:  4, left: "88%", top: "55%", size: "1.5px", delay: "-2s",  duration: "16s", opacity: 0.40 },
  { id:  5, left: "22%", top: "68%", size: "1px",   delay: "-9s",  duration: "22s", opacity: 0.25 },
  { id:  6, left: "62%", top: "72%", size: "1px",   delay: "-5s",  duration: "19s", opacity: 0.32 },
  { id:  7, left: "35%", top: "48%", size: "1px",   delay: "-11s", duration: "24s", opacity: 0.20 },
  { id:  8, left: "92%", top: "38%", size: "1.5px", delay: "-6s",  duration: "17s", opacity: 0.30 },
  // Medium
  { id:  9, left: "8%",  top: "45%", size: "2px",   delay: "-4s",  duration: "21s", opacity: 0.38 },
  { id: 10, left: "55%", top: "15%", size: "2px",   delay: "-13s", duration: "26s", opacity: 0.28 },
  { id: 11, left: "70%", top: "62%", size: "2px",   delay: "-8s",  duration: "23s", opacity: 0.35 },
  { id: 12, left: "28%", top: "80%", size: "1.5px", delay: "-16s", duration: "28s", opacity: 0.22 },
  { id: 13, left: "82%", top: "28%", size: "2px",   delay: "-1s",  duration: "15s", opacity: 0.42 },
  { id: 14, left: "18%", top: "55%", size: "1.5px", delay: "-10s", duration: "25s", opacity: 0.30 },
  // Larger, slower — like heavier dust
  { id: 15, left: "50%", top: "40%", size: "2.5px", delay: "-14s", duration: "32s", opacity: 0.18 },
  { id: 16, left: "40%", top: "75%", size: "3px",   delay: "-19s", duration: "38s", opacity: 0.14 },
];
