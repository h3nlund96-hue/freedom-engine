/** Ember's own glyph — a small living core with a breathing amber-to-cyan
 * glow and an expanding pulse halo behind it. Reused everywhere Ember shows
 * up (Companion Hall, the floating widget) so she reads as one consistent
 * character rather than a generic status dot. */
export function EmberGlyph({ size = "text-2xl" }: { size?: string }) {
  return (
    <span className="relative inline-flex items-center justify-center" aria-hidden>
      <span className="absolute inline-flex size-[1.9em] animate-glow-pulse rounded-full bg-accent-glow/20 blur-md" />
      <span className="ember-glyph-mount relative">
        <span className={`ember-glyph-core relative inline-block ${size} text-accent`}>◉</span>
      </span>
    </span>
  );
}
