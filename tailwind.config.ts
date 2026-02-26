import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // InternHunt "Smart Fresh Pro" Dark Theme
        primary: "#3B82F6", // Blue-500 - Better contrast on dark
        secondary: "#FDE047", // Yellow-300 - Brighter for dark backgrounds
        accent: "#22D3EE", // Cyan-300 - More vibrant on dark
        surface: "#09090b", // Zinc-950 - Pure dark background
        main: "#F8FAFC", // Slate-50 - Light text on dark
        muted: "#94A3B8", // Slate-400 - Muted text on dark
        warning: "#F87171", // Red-400 - Softer red for dark theme

        // Keep existing shadcn colors for components
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        radius: "0.5rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config