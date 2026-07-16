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

const VOICE_INSTRUCTIONS = `Voice: Ember — a close, trusted ally speaking one-on-one, in the moment, to someone she knows well and respects. Not a narrator. Not a voice assistant. Not reading a script aloud.

Tone: Warm, low-key confident, a little dry and amused underneath — like someone who's already made up their mind and is just letting you in on it.

Delivery: Real conversational rhythm, not an even recitation. Let the pacing breathe — a small pause before the point that actually matters, then land it plainly instead of speeding through every word at the same rate. Some phrases can be quicker and more offhand; slow down and get a touch quieter for the one thing she wants remembered. Vary emphasis the way a person naturally does when they mean what they're saying, not the flat cadence of text being read aloud.

Avoid: Cheerfulness, sing-song intonation, customer-service brightness, or a flat monotone read-through.`;

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
      speed: 0.95,
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
