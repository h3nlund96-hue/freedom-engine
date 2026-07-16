/**
 * A soft fog wash sitting behind a single panel's content, tinted to that
 * location's color bias (see the Location Atmosphere Reference table in
 * DESIGN_SYSTEM.md — Quest Board reads amber+cyan, Idea Vault reads cool
 * cyan, etc.). Place as the first child inside a `relative overflow-hidden`
 * panel, same convention as CornerMarks.
 */

interface PanelAtmosphereProps {
  bias: "amber" | "cyan" | "amber-cyan";
}

export function PanelAtmosphere({ bias }: PanelAtmosphereProps) {
  const background =
    bias === "cyan"
      ? "radial-gradient(ellipse 80% 60% at 20% 15%, color-mix(in srgb, var(--accent-glow) 10%, transparent) 0%, transparent 70%)"
      : bias === "amber-cyan"
      ? "radial-gradient(ellipse 70% 55% at 15% 10%, color-mix(in srgb, var(--accent) 9%, transparent) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 90% 90%, color-mix(in srgb, var(--accent-glow) 8%, transparent) 0%, transparent 70%)"
      : "radial-gradient(ellipse 80% 60% at 20% 15%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 70%)";

  return <div className="pointer-events-none absolute inset-0" style={{ background }} aria-hidden />;
}
