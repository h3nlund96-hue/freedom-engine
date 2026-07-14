type PrincipleBlockProps = {
  principle: string;
};

export function PrincipleBlock({ principle }: PrincipleBlockProps) {
  return (
    <blockquote
      className="animate-fade-up relative py-1 pl-7"
      style={{ animationDelay: "0.3s" }}
    >
      <span
        className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-accent-glow/50 via-accent/20 to-transparent"
        aria-hidden
      />
      <span
        className="absolute left-0 top-0 size-1 -translate-x-[1.5px] rounded-full bg-accent-glow/60 shadow-[0_0_10px_rgba(77,216,255,0.4)]"
        aria-hidden
      />
      <p className="font-display text-base italic leading-relaxed text-foreground/85 sm:text-lg">
        {principle}
      </p>
    </blockquote>
  );
}
