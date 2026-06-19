import { NextRequest, NextResponse } from "next/server";

// ElevenLabs voice IDs — override with env var or request body
const DEFAULT_VOICE_ID =
  process.env.ELEVENLABS_DEFAULT_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM"; // "Rachel" (English, neutral)

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

/**
 * Map language codes to reasonable ElevenLabs voices.
 * Extend this map as needed.
 */
const LANGUAGE_VOICE_MAP: Record<string, string> = {
  en: "21m00Tcm4TlvDq8ikWAM", // Rachel — English
  uz: process.env.ELEVENLABS_UZ_VOICE_ID ?? DEFAULT_VOICE_ID,
  ru: process.env.ELEVENLABS_RU_VOICE_ID ?? DEFAULT_VOICE_ID,
};

/**
 * POST /api/ai/text-to-speech
 *
 * Request body (JSON):
 *   {
 *     text: string,       // required
 *     language?: string,  // ISO-639-1, e.g. "uz", "en", "ru"
 *     voice_id?: string   // ElevenLabs voice ID (overrides language map)
 *   }
 *
 * Returns: audio/mpeg stream
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = "uz", voice_id } = body as {
      text?: string;
      language?: string;
      voice_id?: string;
    };

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Request body must include a non-empty 'text' field." },
        { status: 400 }
      );
    }

    // ElevenLabs has a ~5000 character limit per request
    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text is too long. Maximum 5000 characters per request." },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured." },
        { status: 500 }
      );
    }

    // Resolve voice: explicit voice_id > language map > default
    const resolvedVoiceId =
      voice_id ??
      LANGUAGE_VOICE_MAP[language] ??
      DEFAULT_VOICE_ID;

    const elevenLabsResponse = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${resolvedVoiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error("[text-to-speech] ElevenLabs error:", errorText);
      return NextResponse.json(
        { error: `ElevenLabs API error: ${elevenLabsResponse.status}` },
        { status: elevenLabsResponse.status }
      );
    }

    // Stream the audio response back to the client
    const audioStream = elevenLabsResponse.body;

    if (!audioStream) {
      return NextResponse.json(
        { error: "No audio stream received from ElevenLabs." },
        { status: 500 }
      );
    }

    return new NextResponse(audioStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        "X-Voice-Id": resolvedVoiceId,
      },
    });
  } catch (error) {
    console.error("[text-to-speech] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during text-to-speech." },
      { status: 500 }
    );
  }
}
