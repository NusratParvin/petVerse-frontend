import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pv-yellow": "#F5D020",
        "pv-teal": "#00E5CC",
        "pv-purple": "#1E90FF", // ← changed to electric blue
        "pv-coral": "#FF4D6D",
        "pv-bg": "#020812", // ← deeper black-blue
        "pv-surface": "#040d1f",
        "steel-blue": "#4682B4",
        // "steel-blue": "#20B2AA",
        "lime-burst": "#B8FF2E",
      },
      backgroundImage: {
        "pv-gradient":
          "linear-gradient(135deg, #020812 0%, #041020 40%, #030a1a 70%, #020812 100%)",
      },
      fontFamily: {
        raleway: ["var(--font-raleway)"],
        grotesk: ["Space Grotesk", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        "petverse-dark": {
          extend: "dark",
          colors: {
            background: "#020812",
            foreground: "#e8eeff",
            primary: {
              DEFAULT: "#F5D020",
              foreground: "#020812",
            },
            secondary: {
              DEFAULT: "#00E5CC",
              foreground: "#020812",
            },
            danger: {
              DEFAULT: "#FF4D6D",
              foreground: "#ffffff",
            },
          },
        },
        "petverse-light": {
          extend: "light",
          colors: {
            background: "#f0f4ff",
            foreground: "#1a0e30",
            primary: {
              DEFAULT: "#7700CC",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#007A70",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#CC1144",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

export default config;
