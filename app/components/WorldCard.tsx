import Link from "next/link";

type WorldCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
  delay?: number;
  glow?: "gold" | "ember" | "amber" | "warm";
};

const glowStyles = {
  gold: {
    hover: "group-hover:shadow-[0_16px_48px_rgba(212,165,116,0.12),inset_0_1px_0_rgba(212,165,116,0.1)]",
    orb: "from-accent/20 to-accent/5 group-hover:from-accent/30 group-hover:to-accent/8",
    accent: "group-hover:text-accent",
  },
  ember: {
    hover: "group-hover:shadow-[0_16px_48px_rgba(232,132,42,0.14),inset_0_1px_0_rgba(232,132,42,0.08)]",
    orb: "from-accent-glow/20 to-accent-glow/5 group-hover:from-accent-glow/35 group-hover:to-accent-glow/10",
    accent: "group-hover:text-accent-glow",
  },
  amber: {
    hover: "group-hover:shadow-[0_16px_48px_rgba(201,140,60,0.12),inset_0_1px_0_rgba(201,140,60,0.08)]",
    orb: "from-[rgba(201,140,60,0.2)] to-[rgba(201,140,60,0.05)] group-hover:from-[rgba(201,140,60,0.3)] group-hover:to-[rgba(201,140,60,0.08)]",
    accent: "group-hover:text-[#c98c3c]",
  },
  warm: {
    hover: "group-hover:shadow-[0_16px_48px_rgba(220,120,50,0.13),inset_0_1px_0_rgba(220,120,50,0.07)]",
    orb: "from-[rgba(220,120,50,0.18)] to-[rgba(220,120,50,0.04)] group-hover:from-[rgba(220,120,50,0.28)] group-hover:to-[rgba(220,120,50,0.08)]",
    accent: "group-hover:text-[#dc7832]",
  },
};

export function WorldCard({
  icon,
  title,
  description,
  href,
  delay = 0,
  glow = "gold",
}: WorldCardProps) {
  const style = glowStyles[glow];

  return (
    <Link
      href={href}
      className={`group animate-fade-up relative w-full overflow-hidden rounded-2xl bg-linear-to-br from-[rgba(22,18,14,0.7)] to-[rgba(10,9,8,0.85)] p-6 text-left shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(212,165,116,0.04)] backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-1.5 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30 ${style.hover}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Hover wash */}
      <span
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        aria-hidden
      />

      {/* Bottom glow line */}
      <span
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-linear-to-r from-transparent via-accent/0 to-transparent transition-all duration-700 group-hover:via-accent/25"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4">
        {/* Icon orb */}
        <div
          className={`flex size-10 items-center justify-center rounded-full bg-linear-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,165,116,0.15)] ${style.orb}`}
        >
          <span className="text-lg transition-transform duration-700 group-hover:scale-110">
            {icon}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-display text-base tracking-wide text-foreground/90 transition-colors duration-500 ${style.accent}`}
            >
              {title}
            </h3>
            <span
              className="mt-0.5 shrink-0 translate-x-1 text-[0.6rem] tracking-widest uppercase text-accent/0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-accent/45"
              aria-hidden
            >
              Enter
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted/85 transition-colors duration-500 group-hover:text-foreground/60">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
