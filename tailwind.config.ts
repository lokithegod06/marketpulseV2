import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-base": "hsl(var(--surface-base) / <alpha-value>)",
        "surface-low": "hsl(var(--surface-low) / <alpha-value>)",
        "surface-mid": "hsl(var(--surface-mid) / <alpha-value>)",
        "surface-high": "hsl(var(--surface-high) / <alpha-value>)",
        "border": "hsl(var(--border) / <alpha-value>)",
        "text-primary": "hsl(var(--text-primary) / <alpha-value>)",
        "text-secondary": "hsl(var(--text-secondary) / <alpha-value>)",
        "text-muted": "hsl(var(--text-muted) / <alpha-value>)",
        "accent-blue": "hsl(var(--accent-blue) / <alpha-value>)",
        "accent-green": "hsl(var(--accent-green) / <alpha-value>)",
        "accent-red": "hsl(var(--accent-red) / <alpha-value>)",
        "accent-yellow": "hsl(var(--accent-yellow) / <alpha-value>)",
        "accent-contrast": "hsl(var(--accent-contrast) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
