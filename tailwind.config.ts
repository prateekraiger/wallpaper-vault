import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          canvas: "#fbfaf9",
        },
        stone: {
          surface: "#f2f0ed",
          border: "#e5d5c3",
        },
        sand: "#f6f4ef",
        ink: {
          black: "#121212",
        },
        heading: {
          charcoal: "#343433",
        },
        body: {
          brown: "#474645",
        },
        muted: {
          gray: "#7e7e7d",
        },
        link: {
          blue: "#0086fc",
        },
        sky: {
          blue: "#64c6ff",
        },
        alt: {
          blue: "#00b2ff",
        },
        grass: {
          green: "#00c978",
        },
        mint: "#00ca48",
        ember: {
          orange: "#ff3e00",
        },
        sun: {
          yellow: "#ffcd6c",
        },
        gold: "#d48f00",
        honey: "#ffbb26",
        coral: {
          pink: "#ff58ae",
        },
        plum: {
          violet: "#9f4fff",
        },
        alert: {
          red: "#ff2b3a",
        },
        primary: {
          50: "#fdf8f6",
          100: "#f2f0ed",
          200: "#e5d5c3",
          300: "#ffbb26",
          400: "#ff3e00",
          500: "#121212",
          600: "#121212",
          700: "#121212",
          800: "#121212",
          900: "#000000",
        },
      },
      borderRadius: {
        nav: "10px",
        cards: "10px",
        icons: "40px",
        pills: "9999px",
        badges: "6px",
        buttons: "32px",
        illustration: "72px",
      },
      boxShadow: {
        insetHairline: "inset 0 0 0 1px #f2f0ed",
        insetBorder: "inset 0 0 0 1px #e5d5c3",
        familySubtle: "0 1px 6px 0 rgba(0, 0, 0, 0.04), 0 0 24px 0 rgba(0, 0, 0, 0.05)",
        familyDark: "0 0 24px 0 rgba(0, 0, 0, 0.15)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        family: ["var(--font-family)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
