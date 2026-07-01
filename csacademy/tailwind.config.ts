import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        cyber: {
          50:  "#e6fbff",
          100: "#b3f4ff",
          200: "#80eeff",
          300: "#4de8ff",
          400: "#1ae1ff",
          500: "#06B6D4",
          600: "#0589a1",
          700: "#045f70",
          800: "#023540",
          900: "#010b0f",
        },
        // Neutral dark palette
        space: {
          50:  "#f0f4ff",
          100: "#c9d7f5",
          200: "#a3baeb",
          300: "#7d9de1",
          400: "#567fd7",
          500: "#3062cd",
          600: "#1E3A8A",
          700: "#162b6a",
          800: "#0d1b4a",
          900: "#070B14",
          950: "#030609",
        },
        surface: "#0D1424",
        card: "#131D31",
        border: "#1E2D47",
        // Status
        xp: "#F59E0B",
        streak: "#EF4444",
        complete: "#10B981",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)",         "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains)",     "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float":      "float 3s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "slide-in":   "slide-in 0.3s ease-out",
        "fade-up":    "fade-up 0.4s ease-out",
        "bounce-xp":  "bounce-xp 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #06B6D4, 0 0 10px #06B6D4" },
          "50%":       { boxShadow: "0 0 20px #06B6D4, 0 0 40px #06B6D4, 0 0 60px #06B6D4" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-in": {
          "0%":   { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)",     opacity: "1" },
        },
        "fade-up": {
          "0%":   { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "bounce-xp": {
          "0%, 100%": { transform: "scale(1)" },
          "40%":      { transform: "scale(1.4)" },
          "60%":      { transform: "scale(0.9)" },
        },
      },
      backgroundImage: {
        "cyber-gradient":  "linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)",
        "glow-radial":     "radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)",
        "card-shimmer":    "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.1) 50%, transparent 100%)",
        "hero-gradient":   "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.2) 0%, transparent 60%)",
        "dark-mesh":       "radial-gradient(at 20% 20%, rgba(124,58,237,0.12) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(6,182,212,0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        "cyber":     "0 0 20px rgba(6,182,212,0.3)",
        "cyber-lg":  "0 0 40px rgba(6,182,212,0.4)",
        "purple":    "0 0 20px rgba(124,58,237,0.3)",
        "card":      "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover":"0 8px 40px rgba(0,0,0,0.5), 0 0 1px rgba(6,182,212,0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
