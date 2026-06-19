import { useState, useRef, useCallback } from "react";

export type MicrophoneError =
  | "NOT_ALLOWED"
  | "NOT_FOUND"
  | "NOT_SUPPORTED"
  | "UNKNOWN";

export interface UseMicrophoneReturn {
  stream: MediaStream | null;
  isRecording: boolean;
  error: MicrophoneError | null;
  errorMessage: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => MediaStream | null;
}

/**
 * useMicrophone
 *
 * Handles microphone permission request and MediaStream lifecycle.
 *
 * IMPORTANT: This hook requires HTTPS in production.
 * navigator.mediaDevices is only available on secure origins (HTTPS or localhost).
 */
export function useMicrophone(): UseMicrophoneReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<MicrophoneError | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    // Clear previous errors
    setError(null);
    setErrorMessage(null);

    // Check if the browser supports mediaDevices API
    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("NOT_SUPPORTED");
      setErrorMessage(
        "Your browser does not support microphone access. Please use a modern browser (Chrome, Firefox, Safari, Edge) over HTTPS."
      );
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsRecording(true);
    } catch (err) {
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
          case "PermissionDeniedError":
            setError("NOT_ALLOWED");
            setErrorMessage(
              "Microphone access was denied. Please allow microphone permission in your browser settings and try again."
            );
            break;
          case "NotFoundError":
          case "DevicesNotFoundError":
            setError("NOT_FOUND");
            setErrorMessage(
              "No microphone was found on your device. Please connect a microphone and try again."
            );
            break;
          default:
            setError("UNKNOWN");
            setErrorMessage(`Microphone error: ${err.message}`);
        }
      } else {
        setError("UNKNOWN");
        setErrorMessage("An unexpected error occurred while accessing the microphone.");
      }
    }
  }, []);

  const stopRecording = useCallback((): MediaStream | null => {
    const currentStream = streamRef.current;

    if (currentStream) {
      // Stop all tracks to release the microphone
      currentStream.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    setStream(null);
    setIsRecording(false);

    return currentStream;
  }, []);

  return {
    stream,
    isRecording,
    error,
    errorMessage,
    startRecording,
    stopRecording,
  };
}
