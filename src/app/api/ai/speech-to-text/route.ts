import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * POST /api/ai/speech-to-text
 *
 * Accepts multipart/form-data with:
 *   - audio: audio file (Blob/File)
 *   - language: (optional) ISO-639-1 language code hint, e.g. "uz", "en", "ru"
 *
 * Returns: { transcript: string }
 */
export async function POST(req: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = (formData.get("language") as string | null) ?? "uz";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided. Send audio as form field 'audio'." },
        { status: 400 }
      );
    }

    // Validate file size (OpenAI Whisper limit: 25 MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Audio file is too large. Maximum size is 25 MB." },
        { status: 400 }
      );
    }

    // Validate OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI Whisper API
    // Note: Whisper supports language hints to improve accuracy
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: language || undefined, // pass undefined to let Whisper auto-detect
      response_format: "json",
    });

    return NextResponse.json({ transcript: transcription.text });
  } catch (error) {
    console.error("[speech-to-text] Error:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during transcription." },
      { status: 500 }
    );
  }
}
