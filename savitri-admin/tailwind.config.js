/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: { 300:"#f5e08a", 400:"#edca4a", 500:"#d4a82a", 600:"#b8881a", 700:"#946815" },
        ink:  { 50:"#f7f7f8", 100:"#ededf0", 200:"#d4d4db", 300:"#ababba", 400:"#7c7c93", 500:"#5c5c72", 600:"#474758", 700:"#35353f", 800:"#26262e", 900:"#18181f", 950:"#0e0e13" },
        emerald:{ 400:"#34d399", 500:"#10b981" },
        rose:   { 400:"#fb7185", 500:"#f43f5e" },
        amber:  { 400:"#fbbf24", 500:"#f59e0b" },
        sky:    { 400:"#38bdf8", 500:"#0ea5e9" },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg,#edca4a 0%,#d4a82a 50%,#b8881a 100%)",
        "sidebar":       "linear-gradient(180deg,#18181f 0%,#0e0e13 100%)",
      },
      boxShadow: {
        gold:   "0 4px 24px rgba(212,168,42,.2)",
        card:   "0 2px 16px rgba(0,0,0,.18)",
        glow:   "0 0 24px rgba(212,168,42,.15)",
      },
      animation: {
        "fade-up":  "fadeUp .4s ease both",
        "fade-in":  "fadeIn .3s ease both",
        "shimmer":  "shimmer 1.8s infinite",
        "pulse-gold":"pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { "0%":{ opacity:0, transform:"translateY(16px)" }, "100%":{ opacity:1, transform:"translateY(0)" } },
        fadeIn:    { "0%":{ opacity:0 }, "100%":{ opacity:1 } },
        shimmer:   { "0%":{ backgroundPosition:"-200% 0" }, "100%":{ backgroundPosition:"200% 0" } },
        pulseGold: { "0%,100%":{ boxShadow:"0 0 0 0 rgba(212,168,42,.4)" }, "50%":{ boxShadow:"0 0 0 8px rgba(212,168,42,0)" } },
      },
    },
  },
  plugins: [],
};
