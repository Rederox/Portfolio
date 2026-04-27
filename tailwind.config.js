/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        // Référencent les CSS variables — dynamiques, changent avec le mode et le thème
        bg:            "var(--bg)",
        surface:       "var(--surface)",
        card:          "var(--card)",
        "card-border": "var(--card-border)",
        accent:        "var(--accent)",
        "accent-light":"var(--accent-light)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
