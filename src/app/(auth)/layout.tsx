import React from "react";
import { Providers } from "@/shared/components/Providers";
import { ParallaxBackground } from "@/shared/components/effects/ParallaxBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen flex items-center justify-center p-4 relative"
        style={{ background: "var(--gradient-cosmos)" }}>
        <ParallaxBackground />
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </Providers>
  );
}
