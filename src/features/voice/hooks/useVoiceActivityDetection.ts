import { useEffect, useCallback, useRef } from "react";
import { MicVAD, utils } from "@ricky0123/vad-web";

interface UseVoiceActivityDetectionOptions {
  onSpeechEnd: (audio: Float32Array) => void;
  onSpeechStart?: () => void;
  enabled?: boolean;
}

export function useVoiceActivityDetection({
  onSpeechEnd,
  onSpeechStart,
  enabled = true,
}: UseVoiceActivityDetectionOptions) {
  const vadRef = useRef<MicVAD | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initVAD() {
      try {
        const vad = await MicVAD.new({
          onSpeechStart: () => {
            console.log("VAD: Gapirish boshlandi");
            onSpeechStart?.();
          },
          onSpeechEnd: (audio) => {
            console.log("VAD: Gapirish tugadi");
            onSpeechEnd(audio);
          },
        });

        if (isMounted) {
          vadRef.current = vad;
          if (enabled) {
            vad.start();
          }
        } else {
          vad.destroy();
        }
      } catch (e) {
        console.error("VAD initialization failed", e);
      }
    }

    initVAD();

    return () => {
      isMounted = false;
      if (vadRef.current) {
        vadRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (vadRef.current) {
      if (enabled) {
        vadRef.current.start();
      } else {
        vadRef.current.pause();
      }
    }
  }, [enabled]);

  const convertToBlob = useCallback((audio: Float32Array) => {
    const wavBuffer = utils.encodeWAV(audio);
    return new Blob([wavBuffer], { type: "audio/wav" });
  }, []);

  return {
    convertToBlob,
  };
}
