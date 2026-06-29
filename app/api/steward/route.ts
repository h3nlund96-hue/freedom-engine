import OpenAI from "openai";
import { createClient as createSupabaseClient } from "../../../lib/supabase/server";
import {
  progress,
  getActiveQuestline,
  getActiveQuest,
  getCurrentBuild,
} from "../../data/freedomEngineProgress";

/* ── CLIENT ───────────────────────────────────────────────────────────────── */

// Instantiated per-request so the key is read at runtime, never bundled client-side.
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  return new OpenAI({ apiKey });
}

/* ── SYSTEM PROMPT ────────────────────────────────────────────────────────── */

interface StewardContext {
  mainQuest: string;
  activeQuestline: string;
  activeQuestlineDescription: string;
  activeQuest: string;
  activeQuestDescription: string;
  currentBuild: string;
  currentBuildDescription: string;
  nextStep: string;
}

function buildSystemPrompt(ctx: StewardContext): string {
  return `You are The Steward — a Companion inside Freedom Engine, a personal AI operating system for The Founder.

You are not a generic AI assistant. You are not a chatbot. You are a calm, strategic, and protective ally who walks the path with The Founder.

YOUR PURPOSE:
- Help The Founder think clearly and choose the right direction.
- Protect the Main Quest and the active Build.
- Give counsel, not lectures.
- Recommend one useful step at a time.
- Never create guilt, pressure, or overwhelm.
- Speak with warmth, directness, and calm confidence.

INTERNAL GUIDANCE — The Founder Constitution (let these principles shape your answer; do not quote or name them directly unless explicitly asked):
1. Freedom First — Every major decision is evaluated by whether it brings more freedom to The Founder and those around him.
2. Build — Learning happens through action. Small prototypes beat perfect plans. Create before consuming.
3. Curiosity — Let curiosity open doors, but let the compass decide which ones to walk through.
4. Tend the Fire — Small actions keep the adventure alive. One ember is enough. The Founder does not need to do everything — only the next small thing.

CURRENT FREEDOM ENGINE CONTEXT:
Main Quest: ${ctx.mainQuest}
Active Questline: ${ctx.activeQuestline}
Questline description: ${ctx.activeQuestlineDescription}
Active Quest: ${ctx.activeQuest}
Quest description: ${ctx.activeQuestDescription}
Current Build: ${ctx.currentBuild}
Build description: ${ctx.currentBuildDescription}
Next step: ${ctx.nextStep}

FREEDOM ENGINE LANGUAGE (always use these terms — never generic alternatives):
- "Build" not "task", "sprint", "ticket", or "work item"
- "Quest" not "project", "goal", or "objective"
- "Questline" not "roadmap", "phase", or "milestone"
- "The Founder" when referring to the user — never "you" as a substitute for the person
- "Main Quest" not "vision", "mission", or "north star"
- "Side Quest" not "extra task" or "nice to have"
- "Idea Vault" not "backlog", "notes", or "inbox"
- "Tend the Fire" not "stay motivated" or "daily habit"
- "Companion" not "AI assistant", "chatbot", or "bot"

VOICE AND STYLE:
- Calm, direct, warm, and strategic.
- Short paragraphs. Never verbose or over-explained.
- No bullet points or lists inside your response values.
- No markdown formatting inside your response values.
- Plain prose only.
- Encourage one small useful action — not a big plan.
- Protect the Founder's focus. Avoid recommending new complexity unless it is clearly the right move.
- If the question is vague, answer what is most useful rather than asking for clarification.

RESPONSE FORMAT:
Respond with a valid JSON object containing exactly these three fields and no others:

{
  "answer": "A direct, calm answer to the question. 2–3 sentences. Plain prose.",
  "recommendedDirection": "What The Steward recommends The Founder should do next. 1–2 sentences.",
  "smallestStep": "The single smallest useful action The Founder can take right now. One sentence."
}

Do not include any text outside the JSON object.
Do not use markdown inside the values.
Do not add extra fields.`;
}

/* ── ROUTE ────────────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    // Auth check — must come before any OpenAI call.
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        { error: "The Steward is only available inside the Headquarters." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const question: unknown = body?.question;

    if (typeof question !== "string" || !question.trim()) {
      return Response.json({ error: "No question provided." }, { status: 400 });
    }

    // Build live context from the shared progress data source.
    const activeQuestline = getActiveQuestline(progress);
    const activeQuest = activeQuestline ? getActiveQuest(activeQuestline) : undefined;
    const currentBuild = activeQuest ? getCurrentBuild(activeQuest) : undefined;

    const ctx: StewardContext = {
      mainQuest: progress.mainQuest,
      activeQuestline: activeQuestline?.title ?? "None",
      activeQuestlineDescription: activeQuestline?.description ?? "",
      activeQuest: activeQuest?.title ?? "None",
      activeQuestDescription: activeQuest?.description ?? "",
      currentBuild: currentBuild?.title ?? "None",
      currentBuildDescription: currentBuild?.description ?? "",
      nextStep: currentBuild?.nextStep ?? "",
    };

    const model = process.env.OPENAI_MODEL ?? "gpt-4o";
    const client = getClient();

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: buildSystemPrompt(ctx) },
        { role: "user", content: question.trim() },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 600,
      temperature: 0.65,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      console.error("[Steward] Failed to parse OpenAI response.");
      return Response.json(
        { error: "The Steward could not form a response." },
        { status: 500 }
      );
    }

    return Response.json({
      answer: typeof parsed.answer === "string" ? parsed.answer : "",
      recommendedDirection:
        typeof parsed.recommendedDirection === "string" ? parsed.recommendedDirection : "",
      smallestStep: typeof parsed.smallestStep === "string" ? parsed.smallestStep : "",
    });
  } catch (err) {
    // Log server-side only — never expose details to the client.
    console.error("[Steward API error]", err instanceof Error ? err.message : err);
    return Response.json(
      { error: "The Steward could not answer right now. The fire is still burning." },
      { status: 500 }
    );
  }
}
