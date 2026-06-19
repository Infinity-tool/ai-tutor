import { useState, useRef, useCallback } from "react";

export interface UseTextToSpeechOptions {
  voice_id?: string;
}

export interface UseTextToSpeechReturn {
  speak: (text: string, language?: string, onAudio?: (buffer: ArrayBuffer) => void) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;
  error: string | null;
}

/**
 * useTextToSpeech
 *
 * Accepts text + language, POSTs to /api/ai/text-to-speech (ElevenLabs),
 * streams audio back, and plays it via the Web Audio API.
 */
export function useTextToSpeech(
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
  const { voice_id } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to manage Web Audio API lifecycle
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /** Stop any currently playing audio */
  const stop = useCallback(() => {
    // Abort in-flight fetch
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    // Stop the audio source node
    try {
      sourceNodeRef.current?.stop();
    } catch {
      // Ignore — may already be stopped
    }
    sourceNodeRef.current = null;

    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string, language = "uz", onAudio?: (buffer: ArrayBuffer) => void) => {
      // Stop any previous playback
      stop();
      setError(null);

      if (!text.trim()) return;

      // Ensure Web Audio API is available
      if (typeof AudioContext === "undefined" && typeof (window as any).webkitAudioContext === "undefined") {
        setError("Web Audio API is not supported in this browser.");
        return;
      }

      setIsSpeaking(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/ai/text-to-speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language, voice_id }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error ?? `Server error: ${response.status}`);
        }

        // Read the full audio stream into an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // If onAudio callback provided, let the caller handle playback (e.g., TalkingHead)
        if (onAudio) {
          onAudio(arrayBuffer);
          setIsSpeaking(true); // Still consider it speaking
          return;
        }

        // Abort was called while streaming
        if (controller.signal.aborted) return;

        // Create or reuse AudioContext
        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          const AudioContextClass =
            window.AudioContext ?? (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass();
        }

        const audioContext = audioContextRef.current;

        // Resume context if suspended (autoplay policy)
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (controller.signal.aborted) return;

        // Create source node and play
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(audioContext.destination);
        sourceNodeRef.current = sourceNode;

        sourceNode.onended = () => {
          sourceNodeRef.current = null;
          setIsSpeaking(false);
        };

        sourceNode.start(0);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Intentional stop, not an error
          return;
        }
        const message =
          err instanceof Error ? err.message : "Failed to play audio.";
        setError(message);
        setIsSpeaking(false);
      }
    },
    [voice_id, stop]
  );

  return { speak, stop, isSpeaking, setIsSpeaking, error };
}
