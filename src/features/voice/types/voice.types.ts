export type MicrophoneErrorCode =
  | "NOT_ALLOWED"
  | "NOT_FOUND"
  | "NOT_SUPPORTED"
  | "UNKNOWN";

export interface VoiceError {
  code: MicrophoneErrorCode;
  message: string;
}

export type VoiceLanguage = "uz" | "en" | "ru" | "de" | "tr";

export const VOICE_LANGUAGE_LABELS: Record<VoiceLanguage, string> = {
  uz: "O'zbek",
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  tr: "Türkçe",
};

export const ELEVENLABS_VOICE_IDS: Partial<Record<VoiceLanguage, string>> = {
  en: "21m00Tcm4TlvDq8ikWAM",
};
