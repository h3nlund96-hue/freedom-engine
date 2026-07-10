import { AtmosphericBackground } from "./AtmosphericBackground";
import { LocationHeader } from "./LocationHeader";

type LocationShellProps = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  lore: string;
  accent?: string;
  children?: React.ReactNode;
};

export function LocationShell({
  icon,
  title,
  subtitle,
  description,
  lore,
  children,
}: LocationShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <AtmosphericBackground />

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-14 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">
        <LocationHeader
          icon={icon}
          eyebrow={subtitle}
          title={title}
          description={description}
          lore={lore}
        />

        {/* Optional children (future content areas) */}
        {children && (
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {children}
          </div>
        )}

        {/* Alpha notice */}
        <footer
          className="animate-fade-up mt-auto"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/35">
            Alpha — This location is being built.
          </p>
        </footer>
      </main>
    </div>
  );
}
