export function AtmosphericBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Base depth gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#16120e] via-[#0a0908] to-[#060504]" />

      {/* Overhead warm light — like entering a hall */}
      <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.09)_0%,transparent_65%)]" />

      {/* Side ember pools */}
      <div className="animate-ember-drift absolute -left-20 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(232,132,42,0.06)_0%,transparent_70%)] blur-2xl" />
      <div
        className="animate-ember-drift absolute -right-16 top-1/2 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.05)_0%,transparent_70%)] blur-2xl"
        style={{ animationDelay: "-5s" }}
      />

      {/* Floor warmth */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_bottom,rgba(232,132,42,0.04)_0%,transparent_60%)]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="animate-particle-float absolute rounded-full bg-accent/30"
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

      {/* Film grain */}
      <div className="noise-overlay absolute inset-0 opacity-[0.035] mix-blend-overlay" />

      {/* Horizon line */}
      <div className="animate-glow-pulse absolute bottom-[18%] left-1/2 h-px w-1/2 max-w-xl -translate-x-1/2 bg-linear-to-r from-transparent via-accent/15 to-transparent" />
    </div>
  );
}

const particles = [
  { id: 1, left: "12%", top: "22%", size: 2, delay: "0s", duration: "14s", opacity: 0.4 },
  { id: 2, left: "78%", top: "18%", size: 1.5, delay: "-3s", duration: "18s", opacity: 0.3 },
  { id: 3, left: "45%", top: "35%", size: 1, delay: "-7s", duration: "20s", opacity: 0.25 },
  { id: 4, left: "88%", top: "55%", size: 2, delay: "-2s", duration: "16s", opacity: 0.35 },
  { id: 5, left: "22%", top: "68%", size: 1.5, delay: "-9s", duration: "22s", opacity: 0.2 },
  { id: 6, left: "62%", top: "72%", size: 1, delay: "-5s", duration: "19s", opacity: 0.3 },
  { id: 7, left: "35%", top: "48%", size: 1, delay: "-11s", duration: "24s", opacity: 0.15 },
  { id: 8, left: "92%", top: "38%", size: 1.5, delay: "-6s", duration: "17s", opacity: 0.25 },
];
