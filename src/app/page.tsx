import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Providers } from "@/shared/components/Providers";
import { LandingAnimated } from "@/features/landing/LandingAnimated";

export const metadata: Metadata = {
  title: "SuperTutor AI — Kelajak o'qituvchingiz",
  description: "Ingliz, Rus, Nemis, Turk tillari va Matematikani AI bilan o'rganing.",
};

export default function LandingPage() {
  return (
    <Providers>
      <LandingAnimated />
    </Providers>
  );
}
