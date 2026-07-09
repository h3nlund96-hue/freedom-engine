/**
 * Subtle engraved corner marks for major panels.
 * Place inside a `relative overflow-hidden` container.
 * Use pointer-events-none — purely decorative.
 */

interface CornerMarksProps {
  /** Length of each arm in pixels */
  size?: number;
  /** Tailwind inset class for positioning the marks from the corner */
  inset?: string;
  color?: string;
}

export function CornerMarks({
  size = 10,
  inset = "8px",
  color = "rgba(255,171,74,0.22)",
}: CornerMarksProps) {
  const arm = `${size}px`;
  const thick = "1px";

  return (
    <>
      {/* Top-left */}
      <span
        className="pointer-events-none absolute"
        style={{ top: inset, left: inset }}
        aria-hidden
      >
        <span className="absolute block" style={{ top: 0, left: 0, width: arm, height: thick, background: color }} />
        <span className="absolute block" style={{ top: 0, left: 0, width: thick, height: arm, background: color }} />
      </span>

      {/* Top-right */}
      <span
        className="pointer-events-none absolute"
        style={{ top: inset, right: inset }}
        aria-hidden
      >
        <span className="absolute block" style={{ top: 0, right: 0, width: arm, height: thick, background: color }} />
        <span className="absolute block" style={{ top: 0, right: 0, width: thick, height: arm, background: color }} />
      </span>

      {/* Bottom-left */}
      <span
        className="pointer-events-none absolute"
        style={{ bottom: inset, left: inset }}
        aria-hidden
      >
        <span className="absolute block" style={{ bottom: 0, left: 0, width: arm, height: thick, background: color }} />
        <span className="absolute block" style={{ bottom: 0, left: 0, width: thick, height: arm, background: color }} />
      </span>

      {/* Bottom-right */}
      <span
        className="pointer-events-none absolute"
        style={{ bottom: inset, right: inset }}
        aria-hidden
      >
        <span className="absolute block" style={{ bottom: 0, right: 0, width: arm, height: thick, background: color }} />
        <span className="absolute block" style={{ bottom: 0, right: 0, width: thick, height: arm, background: color }} />
      </span>
    </>
  );
}
