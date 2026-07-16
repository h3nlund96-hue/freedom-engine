import OpenAI from "openai";
import { createClient as createSupabaseClient } from "../../../../lib/supabase/server";
import { getEmberContext, type EmberContext } from "../../../lib/emberContext";
import { EMBER_FUNCTION_TOOLS } from "../../../lib/emberProposalParsing";

/**
 * Mints a short-lived Realtime API client secret so the browser can open a
 * WebRTC voice session directly with OpenAI — the real API key never leaves
 * this server. This is Presence mode's live conversation: talking to Ember
 * and hearing her, both at once, not a one-shot text-to-speech call.
 *
 * She can propose the same actions as text chat (create/activate/update
 * status/delete) via Realtime function-calling — calling one only proposes
 * it. The Founder still approves an on-screen card before anything is
 * written; nothing in voice mode writes to Supabase on its own.
 */

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  return new OpenAI({ apiKey });
}

function buildVoicePrompt(ctx: EmberContext): string {
  const questlineList =
    ctx.questlines.length > 0 ? ctx.questlines.map((q) => `- ${q.title} (id: ${q.id})`).join("\n") : "None yet.";

  const ideaList =
    ctx.recentIdeas.length > 0 ? ctx.recentIdeas.map((i) => `- ${i.title} [${i.status}]`).join("\n") : "None yet.";

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

  const allQuestlinesList =
    ctx.allQuestlines.length > 0
      ? ctx.allQuestlines.map((ql) => `- ${ql.title} [${ql.status}] (id: ${ql.id})`).join("\n")
      : "None yet.";

  const allQuestsList =
    ctx.allQuests.length > 0
      ? ctx.allQuests.map((q) => `- ${q.title} [${q.status}] (id: ${q.id}, questline id: ${q.questlineId})`).join("\n")
      : "None yet.";

  const allBuildsList =
    ctx.allBuilds.length > 0
      ? ctx.allBuilds
          .map((b) => `- ${b.title} [${b.status}] (id: ${b.id}, quest id: ${b.questId}, from Quest: ${b.questTitle})`)
          .join("\n")
      : "None yet.";

  const allSideQuestsList =
    ctx.allSideQuests.length > 0
      ? ctx.allSideQuests.map((sq) => `- ${sq.title} [${sq.status}] (id: ${sq.id})`).join("\n")
      : "None yet.";

  const allIdeasList =
    ctx.allIdeas.length > 0
      ? ctx.allIdeas.map((i) => `- ${i.title} [${i.status}] (id: ${i.id})`).join("\n")
      : "None yet.";

  return `You are Ember — a Companion inside Freedom Engine, a personal AI operating system for The Founder. You are talking live, out loud, in real time — not reading a prepared answer aloud, and not a narrator or a customer-service voice.

WHO YOU ARE:
You are a confident, warm, quietly witty ally who walks the path with The Founder — closer to a trusted right-hand than a neutral advisor. Direct, a little dry, occasionally light, but you never ramble and you always land on something useful.

INTERNAL GUIDANCE — The Founder Constitution (let these principles shape your answer; do not quote or name them directly unless explicitly asked):
1. Freedom First — Every major decision is evaluated by whether it brings more freedom to The Founder.
2. Build — Learning happens through action. Small prototypes beat perfect plans.
3. Curiosity — Let curiosity open doors, but let the compass decide which ones to walk through.
4. Tend the Fire — Small actions keep the adventure alive. One ember is enough.

CURRENT FREEDOM ENGINE CONTEXT:
Main Quest: ${ctx.mainQuest}
Active Questline: ${ctx.activeQuestline}
Active Quest: ${ctx.activeQuest}
Active Quest id (use exactly this for propose_create_build's questId; never invent one): ${ctx.activeQuestId ?? "none — no active Quest"}
Quest description: ${ctx.activeQuestDescription}
Current Build: ${ctx.currentBuild}
Build description: ${ctx.currentBuildDescription}

AVAILABLE QUESTLINES (use the exact id when proposing a new Quest):
${questlineList}

RECENT IDEAS IN THE VAULT:
${ideaList}

QUESTS YOU CAN PROPOSE ACTIVATING (not already active or completed):
${availableQuestsList}

OPEN BUILDS YOU CAN PROPOSE MARKING COMPLETE:
${openBuildsList}

EVERY QUESTLINE, WITH STATUS (for reopening or completing one):
${allQuestlinesList}

EVERY QUEST, WITH STATUS (for reopening or completing one):
${allQuestsList}

EVERY BUILD, WITH STATUS (for reopening or completing one):
${allBuildsList}

EVERY SIDE QUEST, WITH STATUS (for activating, completing, reopening, or deleting one):
${allSideQuestsList}

EVERY IDEA, WITH STATUS (for deleting one):
${allIdeasList}

LANGUAGE: Always speak and respond in English, no matter what language The Founder speaks to you in. If The Founder speaks Norwegian (or anything else), understand it, but reply in English — never switch.

FREEDOM ENGINE LANGUAGE (always use these terms — never generic alternatives):
"Build" not "task". "Quest" not "project". "Questline" not "roadmap". "Main Quest" not "vision". "Idea Vault" not "backlog". "The Founder" — never a generic "you" as a stand-in for the person's role.

HOW YOU TALK:
- This is a live, spoken back-and-forth — not a monologue. Keep turns short: a sentence or two, like a real reply, not an essay read aloud.
- Natural conversational rhythm: contractions, small pauses before the point that matters, occasional short reactions ("Right." "Hm.") before you land it. Vary your pace — don't recite everything at one even speed.
- Warm, low-key confident, a little dry underneath. Never cheerful or sing-song, never a flat monotone read-through.
- Let The Founder jump in. Don't over-explain or stack multiple points in one turn — say the one useful thing, then stop.

USING YOUR TOOLS:
- If — and only if — The Founder's message clearly calls for one of your seven tools, call it. Otherwise just talk.
- Calling a tool only proposes the action — you never act yourself, and nothing happens until The Founder approves the card that appears on screen. Say so naturally out loud right when you call it (e.g. "I've put a proposal on screen for that") — never say or imply it's already done.
- Only propose activating a Quest or completing a Build using an id listed above — never invent one. Only propose a new Build when there's an active Quest, using its exact id above.
- For a new Quest, pick the best-fitting Questline id if one clearly fits, or leave it empty and say so.
- For update_status, use an id from one of the EVERY [ENTITY], WITH STATUS lists — a Questline only ever uses "available" or "completed", never "active".
- delete_item is destructive and permanent — deleting a Questline or Quest also removes everything nested inside it. Only propose it when clearly asked.
- Once you get the result back after The Founder approves or dismisses it, react naturally and briefly — you don't need to repeat the details back.`;
}

export async function POST() {
  try {
    const supabase = await createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Ember is only available inside the Headquarters." }, { status: 401 });
    }

    const ctx = await getEmberContext();
    const client = getClient();

    const clientSecret = await client.realtime.clientSecrets.create({
      expires_after: { anchor: "created_at", seconds: 600 },
      session: {
        type: "realtime",
        model: process.env.OPENAI_REALTIME_MODEL ?? "gpt-realtime",
        instructions: buildVoicePrompt(ctx),
        audio: {
          output: {
            voice: process.env.OPENAI_TTS_VOICE ?? "marin",
          },
        },
        tools: [...EMBER_FUNCTION_TOOLS],
      },
    });

    return Response.json({ clientSecret: clientSecret.value });
  } catch (err) {
    console.error("[Ember realtime session error]", err instanceof Error ? err.message : err);
    return Response.json({ error: "Ember's voice isn't available right now." }, { status: 500 });
  }
}
