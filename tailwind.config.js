import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: "#0A7C6E",
          light: "#12A98F",
        },
        accent: {
          DEFAULT: "#E8943A",
          light: "#F5B56A",
        },
        deep: "#1A1A2E",
        sand: "#F5EFE0",
        cream: "#FFFBF4",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#0A7C6E",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#E8943A",
              foreground: "#ffffff",
            },
            focus: "#0A7C6E",
          },
        },
      },
    }),
  ],
};
