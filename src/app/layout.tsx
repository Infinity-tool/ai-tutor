import type { Metadata } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SuperTutor AI — Your Personal AI Teacher",
    template: "%s | SuperTutor AI",
  },
  description:
    "Premium AI-powered language and math tutoring. Learn English, Russian, German, Turkish with real-time voice feedback and a live AI avatar.",
  keywords: ["AI tutor", "language learning", "math tutor", "English learning", "voice AI"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
