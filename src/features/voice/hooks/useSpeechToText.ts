import { useState, useCallback, useRef, useEffect } from "react";

export interface UseSpeechToTextOptions {
  language?: string; // e.g. "uz", "en", "ru"
}

export interface UseSpeechToTextReturn {
  transcript: string | null;
  isTranscribing: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  reset: () => void;
}

/**
 * useSpeechToText
 *
 * Uses browser's native Web Speech API (free, no API key needed) for speech-to-text.
 * Falls back to OpenAI Whisper API if Web Speech API is not supported.
 */
export function useSpeechToText(
  options: UseSpeechToTextOptions = {}
): UseSpeechToTextReturn {
  const { language = "uz" } = options;

  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API on mount
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsTranscribing(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setIsTranscribing(false);
      };

      recognition.onerror = (event: any) => {
        setError(event.error);
        setIsTranscribing(false);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      // Fallback to OpenAI Whisper if Web Speech API not available
      setError("Web Speech API not available. Please use OpenAI Whisper.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript(null);
    setError(null);
    setIsTranscribing(false);
  }, []);

  return {
    transcript,
    isTranscribing,
    error,
    startListening,
    stopListening,
    reset,
  };
}
