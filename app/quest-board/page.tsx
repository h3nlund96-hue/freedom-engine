import type { Metadata } from "next";
import { LocationHeader } from "../components/LocationHeader";
import { QuestBoardClient } from "./QuestBoardClient";
import { getProgress } from "../lib/questService";

export const metadata: Metadata = {
  title: "Quest Board — Freedom Engine",
  description: "The active path through Freedom Engine.",
};

export default async function QuestBoardPage() {
  const progress = await getProgress();

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:max-w-3xl">

        <LocationHeader
          icon="◎"
          eyebrow="Quest Chamber"
          title="Quest Board"
          description="The active path — current Quest, active Build, next step forward."
        />

        <QuestBoardClient initialProgress={progress} />

        {/* Footer */}
        <footer className="animate-fade-up mt-auto flex items-center gap-4 pt-2" style={{ animationDelay: "0.6s" }}>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted/30">Quest Chamber · Freedom Engine</p>
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-accent/8 to-transparent" aria-hidden />
        </footer>

      </main>
    </div>
  );
}
