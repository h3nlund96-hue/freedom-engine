import type { Metadata } from "next";
import { LocationShell } from "../components/LocationShell";

export const metadata: Metadata = {
  title: "Tend the Fire — Freedom Engine",
};

const reminders = [
  "You built something real today. That is enough.",
  "The Quest does not require perfection. It requires presence.",
  "Every day you return is a day the fire did not go out.",
  "Small is not small. Small is the only way anything great begins.",
  "Rest is not retreat. Rest is reloading.",
];

export default function TendTheFirePage() {
  return (
    <LocationShell
      icon="🔥"
      subtitle="The Hearth Room"
      title="Tend the Fire"
      description="This room is always warm. It is here when the work feels impossible, when motivation disappears, when the path forward is not clear. The Founder does not have to perform here. Only return."
      lore="The fire does not judge. It only waits."
    >
      <div className="space-y-4">
        <p className="font-display text-[0.65rem] tracking-[0.22em] uppercase text-muted/50">
          Words for the Long Journey
        </p>
        <ul className="space-y-3">
          {reminders.map((reminder, i) => (
            <li
              key={i}
              className="rounded-md bg-linear-to-br from-[rgba(10,17,30,0.65)] to-[rgba(7,9,16,0.8)] px-5 py-4 shadow-[inset_0_1px_0_rgba(77,216,255,0.04)]"
            >
              <p className="font-display text-sm italic leading-relaxed text-foreground/70">
                &ldquo;{reminder}&rdquo;
              </p>
            </li>
          ))}
        </ul>
      </div>
    </LocationShell>
  );
}
