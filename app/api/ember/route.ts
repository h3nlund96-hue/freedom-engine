import OpenAI from "openai";
import { createClient as createSupabaseClient } from "../../../lib/supabase/server";
import { getEmberContext, type EmberContext } from "../../lib/emberContext";
import { parseProposal } from "../../lib/emberProposalParsing";

/* ── CLIENT ───────────────────────────────────────────────────────────────── */

// Instantiated per-request so the key is read at runtime, never bundled client-side.
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  return new OpenAI({ apiKey });
}

/* ── HISTORY ──────────────────────────────────────────────────────────────── */

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// Cap how much prior conversation gets resent — keeps token growth in check
// over a long session instead of resending the entire history every turn.
const MAX_HISTORY_MESSAGES = 12;

function parseHistory(value: unknown): HistoryMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (m): m is HistoryMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(-MAX_HISTORY_MESSAGES);
}

/* ── SYSTEM PROMPT ────────────────────────────────────────────────────────── */

function buildSystemPrompt(ctx: EmberContext): string {
  const questlineList =
    ctx.questlines.length > 0
      ? ctx.questlines.map((q) => `- ${q.title} (id: ${q.id})`).join("\n")
      : "None yet.";

  const ideaList =
    ctx.recentIdeas.length > 0
      ? ctx.recentIdeas.map((i) => `- ${i.title} [${i.status}]`).join("\n")
      : "None yet.";

  const availableQuestsList =
    ctx.availableQuests.length > 0
      ? ctx.availableQuests
          .map((q) => `- ${q.title} (id: ${q.id}, questline id: ${q.questlineId})`)
          .join("\n")
      : "None — every Quest is either already active or completed.";

  const openBuildsList =
    ctx.openBuilds.length > 0
      ? ctx.openBuilds
          .map((b) => `- ${b.title} (id: ${b.id}, quest id: ${b.questId}, from Quest: ${b.questTitle})`)
          .join("\n")
      : "None open right now.";

  return `You are Ember — a Companion inside Freedom Engine, a personal AI operating system for The Founder.

You are not a generic AI assistant. You are not a chatbot. You are a confident, warm, quietly witty ally who walks the path with The Founder — closer to a trusted right-hand than a neutral advisor. You have personality: you can be direct, a little dry, occasionally light — but you never ramble, never perform the humor at the expense of clarity, and you always land on something useful.

YOUR PURPOSE:
- Help The Founder think clearly and choose the right direction.
- Protect the Main Quest and the active Build.
- Give counsel with personality, not lectures.
- Recommend one useful step at a time.
- Never create guilt, pressure, or overwhelm.
- Speak with warmth, confidence, and a touch of dry wit — familiar, not clinical.

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
Active Quest id (use exactly this for create_build's questId; do not invent one): ${ctx.activeQuestId ?? "none — no active Quest"}
Quest description: ${ctx.activeQuestDescription}
Current Build: ${ctx.currentBuild}
Build description: ${ctx.currentBuildDescription}
Next step: ${ctx.nextStep}

AVAILABLE QUESTLINES (use the exact id when proposing a new Quest):
${questlineList}

RECENT IDEAS IN THE VAULT:
${ideaList}

QUESTS YOU CAN PROPOSE ACTIVATING (not already active or completed):
${availableQuestsList}

OPEN BUILDS YOU CAN PROPOSE MARKING COMPLETE:
${openBuildsList}

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
- Confident, warm, direct, with a light touch of dry wit — never clinical, never a lecture.
- Short paragraphs. Never verbose or over-explained.
- No bullet points or lists inside your response values.
- No markdown formatting inside your response values.
- Plain prose only.
- Encourage one small useful action — not a big plan.
- Protect the Founder's focus. Avoid recommending new complexity unless it is clearly the right move.
- If the question is vague, answer what is most useful rather than asking for clarification.
- The conversation history given to you is real — refer back to it naturally when relevant, the way an ally who was actually listening would.

PROPOSING AN ACTION:
- If — and only if — The Founder's message clearly calls for one of the five actions below, include a "proposal" object in your response (see RESPONSE FORMAT). Otherwise leave it null.
- You never act yourself. Proposing is enough — The Founder approves it before anything is written anywhere.
- Only propose "activate_quest" for a Quest listed under QUESTS YOU CAN PROPOSE ACTIVATING, and "complete_build" for a Build listed under OPEN BUILDS YOU CAN PROPOSE MARKING COMPLETE — never invent an id.
- Only propose "create_build" when there is an active Quest — attach it using the Active Quest id given above, exactly as written, and never invent one. If there is no active Quest, don't propose a Build; say so instead and suggest activating one.
- For a new Quest proposal, pick the single best-fitting Questline id from AVAILABLE QUESTLINES if one clearly fits; if none fit well or none exist, leave questlineId null and say so in your answer.
- For a new Idea proposal, there is no Questline — Ideas don't belong to one.
- Keep proposed titles short and concrete. Keep proposed descriptions to one sentence. For a new Build, nextStep should be one concrete next action, or an empty string if there isn't an obvious one yet.
- Mention the proposal naturally in your answer (e.g. "I've put together a proposal below") — don't just silently attach it.

RESPONSE FORMAT:
Respond with a valid JSON object containing exactly these two fields and no others:

{
  "answer": "One direct, flowing answer in Ember's own voice — not separate labeled parts. If a next step is relevant, weave it into the same answer naturally. 2–4 sentences. Plain prose.",
  "proposal": null OR exactly one of:
    { "action": "create_quest", "title": "...", "description": "...", "questlineId": "an id from AVAILABLE QUESTLINES, or null" }
    { "action": "create_idea", "title": "...", "description": "..." }
    { "action": "activate_quest", "questId": "an id from QUESTS YOU CAN PROPOSE ACTIVATING", "questlineId": "that Quest's questline id", "questTitle": "that Quest's title" }
    { "action": "complete_build", "buildId": "an id from OPEN BUILDS YOU CAN PROPOSE MARKING COMPLETE", "questId": "that Build's quest id", "buildTitle": "that Build's title" }
    { "action": "create_build", "questId": "the Active Quest id given above", "questTitle": "the Active Quest's title", "title": "...", "description": "...", "nextStep": "one concrete next action, or empty string" }
}

Do not include any text outside the JSON object.
Do not use markdown inside any value.
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
        { error: "Ember is only available inside the Headquarters." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const question: unknown = body?.question;
    const history = parseHistory(body?.history);

    if (typeof question !== "string" || !question.trim()) {
      return Response.json({ error: "No question provided." }, { status: 400 });
    }

    // Build live context from the shared progress data source.
    const ctx = await getEmberContext();

    const model = process.env.OPENAI_MODEL ?? "gpt-4o";
    const client = getClient();

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: buildSystemPrompt(ctx) },
        ...history,
        { role: "user", content: question.trim() },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 700,
      temperature: 0.65,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      console.error("[Ember] Failed to parse OpenAI response.");
      return Response.json(
        { error: "Ember could not form a response." },
        { status: 500 }
      );
    }

    return Response.json({
      answer: typeof parsed.answer === "string" ? parsed.answer : "",
      proposal: parseProposal(parsed.proposal),
    });
  } catch (err) {
    // Log server-side only — never expose details to the client.
    console.error("[Ember API error]", err instanceof Error ? err.message : err);
    return Response.json(
      { error: "Ember could not answer right now. The fire is still burning." },
      { status: 500 }
    );
  }
}
