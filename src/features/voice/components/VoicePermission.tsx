"use client";

import React from "react";
import { MicrophoneError } from "../hooks/useMicrophone";

interface VoicePermissionProps {
  onAllow: () => void;
  error?: MicrophoneError | null;
  errorMessage?: string | null;
}

/**
 * VoicePermission
 *
 * Shown before requesting microphone access, or when permission is denied.
 * Explains why microphone access is needed and guides the user on how to fix
 * permission issues.
 */
export function VoicePermission({
  onAllow,
  error,
  errorMessage,
}: VoicePermissionProps) {
  const isDenied = error === "NOT_ALLOWED";
  const isNotFound = error === "NOT_FOUND";
  const isNotSupported = error === "NOT_SUPPORTED";

  return (
    <div
      role="dialog"
      aria-labelledby="voice-permission-title"
      aria-describedby="voice-permission-desc"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
        borderRadius: "1rem",
        background: "var(--surface, #1e1e2e)",
        color: "var(--text, #cdd6f4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        style={{
          fontSize: "3rem",
          lineHeight: 1,
          padding: "1rem",
          borderRadius: "50%",
          background: isDenied
            ? "rgba(243,139,168,0.15)"
            : "rgba(137,180,250,0.15)",
        }}
      >
        {isDenied ? "🚫" : isNotFound ? "🎤" : "🎙️"}
      </div>

      {/* Title */}
      <h2
        id="voice-permission-title"
        style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}
      >
        {isDenied
          ? "Mikrofon ruxsati rad etildi"
          : isNotFound
          ? "Mikrofon topilmadi"
          : isNotSupported
          ? "Brauzer qo'llab-quvvatlamaydi"
          : "Mikrofon ruxsati kerak"}
      </h2>

      {/* Description */}
      <p
        id="voice-permission-desc"
        style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.8 }}
      >
        {isDenied ? (
          <>
            Ovozli yordamchi ishlashi uchun mikrofon kerak. Iltimos, brauzer
            manzil satrining chap qismidagi{" "}
            <strong>🔒 qulf belgisi</strong>ni bosib, mikrofonga ruxsat bering,
            so'ng sahifani yangilang.
          </>
        ) : isNotFound ? (
          "Qurilmangizda mikrofon topilmadi. Mikrofon ulang va qayta urinib ko'ring."
        ) : isNotSupported ? (
          "Sizning brauzeringiz mikrofon xususiyatini qo'llab-quvvatlamaydi. Iltimos, Chrome, Firefox yoki Safari dan foydalaning (HTTPS orqali)."
        ) : (
          "AI o'qituvchi sizning savollaringizni eshitish va javob berish uchun mikrofonga kirish huquqi kerak. Ovozingiz hech qaerga saqlanmaydi."
        )}
      </p>

      {/* Error details if present and not one of the handled cases */}
      {errorMessage && !isDenied && !isNotFound && !isNotSupported && (
        <p
          role="alert"
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--error, #f38ba8)",
            background: "rgba(243,139,168,0.1)",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            width: "100%",
          }}
        >
          {errorMessage}
        </p>
      )}

      {/* Action button — only show if it's actionable */}
      {!isDenied && !isNotFound && !isNotSupported && (
        <button
          onClick={onAllow}
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "2rem",
            border: "none",
            cursor: "pointer",
            background: "var(--accent, #89b4fa)",
            color: "var(--base, #1e1e2e)",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
          }
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          Mikrofonga ruxsat berish
        </button>
      )}

      {/* Browser permission fix instructions */}
      {isDenied && (
        <div
          style={{
            fontSize: "0.8rem",
            opacity: 0.7,
            background: "rgba(255,255,255,0.05)",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            width: "100%",
            textAlign: "left",
          }}
        >
          <strong>Qanday tuzatish mumkin:</strong>
          <ol style={{ margin: "0.5rem 0 0 1rem", padding: 0 }}>
            <li>Manzil satrida 🔒 belgisini bosing</li>
            <li>"Sayt sozlamalari" ni oching</li>
            <li>Mikrofon → "Ruxsat berish" ni tanlang</li>
            <li>Sahifani yangilang (F5)</li>
          </ol>
        </div>
      )}
    </div>
  );
}
