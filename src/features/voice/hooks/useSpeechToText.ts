import { useState, useCallback } from "react";

export interface UseSpeechToTextOptions {
  language?: string; // e.g. "uz", "en", "ru"
}

export interface UseSpeechToTextReturn {
  transcript: string | null;
  isTranscribing: boolean;
  error: string | null;
  transcribe: (audioBlob: Blob) => Promise<string | null>;
  reset: () => void;
}

/**
 * useSpeechToText
 *
 * Accepts an audio Blob, POSTs it to /api/ai/speech-to-text,
 * and returns the transcribed text via OpenAI Whisper.
 */
export function useSpeechToText(
  options: UseSpeechToTextOptions = {}
): UseSpeechToTextReturn {
  const { language = "uz" } = options;

  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribe = useCallback(
    async (audioBlob: Blob): Promise<string | null> => {
      setIsTranscribing(true);
      setError(null);
      setTranscript(null);

      try {
        // Build multipart/form-data payload
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("language", language);

        const response = await fetch("/api/ai/speech-to-text", {
          method: "POST",
          body: formData,
          // Do NOT set Content-Type manually — browser sets it with boundary
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData?.error ?? `Server error: ${response.status}`
          );
        }

        const data = await response.json();
        const result: string = data.transcript ?? "";
        setTranscript(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to transcribe audio. Please try again.";
        setError(message);
        return null;
      } finally {
        setIsTranscribing(false);
      }
    },
    [language]
  );

  const reset = useCallback(() => {
    setTranscript(null);
    setError(null);
    setIsTranscribing(false);
  }, []);

  return {
    transcript,
    isTranscribing,
    error,
    transcribe,
    reset,
  };
}
