/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#020617",
          900: "#070d1e",
          850: "#0a1329",
          800: "#0f172a",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px -3px rgba(6, 182, 212, 0.35)",
        "glow-cyan-lg": "0 0 40px -5px rgba(6, 182, 212, 0.45)",
        "glow-indigo": "0 0 25px -4px rgba(99, 102, 241, 0.4)",
        "glow-emerald": "0 0 20px -3px rgba(16, 185, 129, 0.35)",
        "hud-panel": "0 10px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)",
      },
      keyframes: {
        portalEntry: {
          "0%": { opacity: "0", transform: "scale(1.04)", filter: "blur(12px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        slideNext: {
          "0%": { opacity: "0", transform: "translateX(36px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        slidePrev: {
          "0%": { opacity: "0", transform: "translateX(-36px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        quantumJump: {
          "0%": { opacity: "0", filter: "blur(16px)", transform: "scale(0.94)" },
          "50%": { opacity: "0.8", filter: "blur(4px)" },
          "100%": { opacity: "1", filter: "blur(0)", transform: "scale(1)" },
        },
        telemetryPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.9)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "portal-entry": "portalEntry 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-next": "slideNext 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-prev": "slidePrev 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "quantum-jump": "quantumJump 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "telemetry-pulse": "telemetryPulse 2s ease-in-out infinite",
        "radar-sweep": "radarSweep 10s linear infinite",
      },
    },
  },
  plugins: [],
};
