import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#080710",
        "bg-secondary": "#0C0B18",
        "bg-card": "rgba(255,255,255,0.03)",
        "border-glass": "rgba(255,255,255,0.1)",
        "accent-cyan": "#00E5FF",
        "accent-green": "#00FF66",
        "accent-orange": "#FF5A00",
        "accent-primary": "#00E5FF",
        "accent-secondary": "#00FF66",
        "accent-success": "#00FF66",
        "accent-warning": "#FF5A00",
        "accent-danger": "#FF3366",
        "text-primary": "#F0F4FF",
        "text-secondary": "#8892A4",
        "text-muted": "#4A5568",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "Menlo", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: { glass: "20px" },
      boxShadow: {
        glass: "0 4px 32px rgba(0,0,0,0.45)",
        "glow-cyan": "0 0 32px rgba(0,229,255,0.35)",
        "glow-green": "0 0 32px rgba(0,255,102,0.35)",
        "glow-orange": "0 0 24px rgba(255,90,0,0.4)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "80%": { opacity: "0" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "orb-glow": {
          "0%, 100%": { boxShadow: "0 0 40px rgba(0,229,255,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(0,229,255,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "fade-in": "fade-in 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "orb-glow": "orb-glow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
