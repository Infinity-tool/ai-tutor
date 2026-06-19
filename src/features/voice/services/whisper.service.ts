/**
 * Whisper STT Service (client-side)
 * Wraps the POST to /api/ai/speech-to-text.
 * Called by: useSpeechToText hook
 */

export interface TranscribeOptions {
  language?: string;
}

export interface TranscribeResult {
  transcript: string;
}

/**
 * Send audio blob to the server-side Whisper endpoint.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  options: TranscribeOptions = {}
): Promise<TranscribeResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  if (options.language) formData.append("language", options.language);

  const res = await fetch("/api/ai/speech-to-text", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Transcription failed (${res.status})`);
  }

  const data = await res.json();
  return { transcript: data.transcript ?? "" };
}
