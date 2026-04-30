/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fefdf5",
          100: "#fdf8e1",
          200: "#faefc3",
          300: "#f5e08a",
          400: "#edca4a",
          500: "#d4a82a",
          600: "#b8881a",
          700: "#946815",
          800: "#7a5317",
          900: "#674618",
        },
        obsidian: {
          50:  "#f6f6f7",
          100: "#e1e2e5",
          200: "#c3c5cb",
          300: "#9b9ea9",
          400: "#737789",
          500: "#585c6e",
          600: "#474b5d",
          700: "#3b3e4e",
          800: "#333643",
          900: "#1a1b24",
          950: "#0d0e14",
        },
        cream: "#faf6ee",
        ivory: "#f5efe3",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      boxShadow: {
        gold:   "0 4px 32px rgba(212,168,42,0.18)",
        "gold-lg": "0 8px 48px rgba(212,168,42,0.28)",
        card:   "0 2px 24px rgba(26,27,36,0.08)",
        "card-hover": "0 8px 40px rgba(26,27,36,0.14)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #edca4a 0%, #d4a82a 50%, #b8881a 100%)",
        "dark-gradient": "linear-gradient(135deg, #1a1b24 0%, #333643 100%)",
        "cream-gradient":"linear-gradient(180deg, #faf6ee 0%, #f5efe3 100%)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "slide-left": "slideLeft 0.5s ease both",
        "shimmer":    "shimmer 1.8s infinite",
        "float":      "float 6s ease-in-out infinite",
        "spin-slow":  "spin 12s linear infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity:0, transform:"translateY(24px)" }, "100%": { opacity:1, transform:"translateY(0)" } },
        fadeIn:    { "0%": { opacity:0 }, "100%": { opacity:1 } },
        slideLeft: { "0%": { opacity:0, transform:"translateX(24px)" }, "100%": { opacity:1, transform:"translateX(0)" } },
        shimmer:   { "0%": { backgroundPosition:"-200% 0" }, "100%": { backgroundPosition:"200% 0" } },
        float:     { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(-12px)" } },
      },
    },
  },
  plugins: [],
};
