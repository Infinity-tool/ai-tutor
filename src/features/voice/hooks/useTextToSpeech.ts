import { useState, useCallback, useRef, useEffect } from "react";

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
 * Uses browser's native Web Speech API (free, no API key needed) for text-to-speech.
 * Falls back to ElevenLabs API if Web Speech API is not supported or premium voice needed.
 */
export function useTextToSpeech(
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
  const { voice_id } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  /** Stop any currently playing audio */
  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string, language = "uz", onAudio?: (buffer: ArrayBuffer) => void) => {
      // Stop any previous playback
      stop();
      setError(null);

      if (!text.trim()) return;

      // Try Web Speech API first (free, no API key needed)
      if (synthRef.current && !onAudio) {
        setIsSpeaking(true);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        
        // Try to find a voice for the language
        const voices = synthRef.current.getVoices();
        const voice = voices.find(v => v.lang.startsWith(language)) || voices[0];
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          setError(event.error);
          setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        return;
      }

      // Fallback to ElevenLabs if Web Speech API not available or onAudio callback needed
      if (voice_id) {
        // Original ElevenLabs logic here (for premium voice)
        const audioContextRef = useRef<AudioContext | null>(null);
        const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
        const abortControllerRef = useRef<AbortController | null>(null);

        try {
          const response = await fetch("/api/ai/text-to-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, language, voice_id }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error ?? `Server error: ${response.status}`);
          }

          const arrayBuffer = await response.arrayBuffer();

          if (onAudio) {
            onAudio(arrayBuffer);
            setIsSpeaking(true);
            return;
          }

          // Web Audio API playback for ElevenLabs fallback
          if (!audioContextRef.current || audioContextRef.current.state === "closed") {
            const AudioContextClass =
              window.AudioContext ?? (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
          }

          const audioContext = audioContextRef.current;
          if (audioContext.state === "suspended") {
            await audioContext.resume();
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
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
          const message =
            err instanceof Error ? err.message : "Failed to play audio.";
          setError(message);
          setIsSpeaking(false);
        }
      } else {
        setError("No text-to-speech method available.");
      }
    },
    [voice_id, stop]
  );

  return { speak, stop, isSpeaking, setIsSpeaking, error };
}
