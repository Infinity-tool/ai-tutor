/**
 * ElevenLabs TTS Service (client-side)
 * Wraps the POST to /api/ai/text-to-speech.
 * Called by: useTextToSpeech hook
 */

export interface SynthesizeOptions {
  language?: string;
  voice_id?: string;
}

/**
 * Request TTS audio from ElevenLabs via the server-side proxy.
 * Returns an ArrayBuffer of audio/mpeg data.
 */
export async function synthesizeSpeech(
  text: string,
  options: SynthesizeOptions = {},
  signal?: AbortSignal
): Promise<ArrayBuffer> {
  const res = await fetch("/api/ai/text-to-speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      language: options.language ?? "uz",
      voice_id: options.voice_id,
    }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `TTS failed (${res.status})`);
  }

  return res.arrayBuffer();
}
