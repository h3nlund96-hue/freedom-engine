import OpenAI from "openai";
import { createClient as createSupabaseClient } from "../../../../lib/supabase/server";

/**
 * Turns one of Ember's answers into audio — the first step of voice chat.
 * Text-to-speech only for now; talking back to her comes later. Scoped to
 * Hall of Embers, where Presence mode and the reactive glyph already live.
 */

// Instantiated per-request so the key is read at runtime, never bundled client-side.
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
  return new OpenAI({ apiKey });
}

// OpenAI's TTS input limit.
const MAX_INPUT_LENGTH = 4096;

const VOICE_INSTRUCTIONS =
  "Speak warmly and confidently, with a calm, grounded delivery and a touch of dry wit — like a trusted ally, not a customer service agent. Unhurried, never robotic.";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Ember is only available inside the Headquarters." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const text: unknown = body?.text;

    if (typeof text !== "string" || !text.trim()) {
      return Response.json({ error: "No text provided." }, { status: 400 });
    }

    const voice = process.env.OPENAI_TTS_VOICE ?? "nova";
    const client = getClient();

    const speech = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text.trim().slice(0, MAX_INPUT_LENGTH),
      instructions: VOICE_INSTRUCTIONS,
      response_format: "mp3",
    });

    const audio = await speech.arrayBuffer();

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Ember speech API error]", err instanceof Error ? err.message : err);
    return Response.json({ error: "Ember's voice isn't available right now." }, { status: 500 });
  }
}
