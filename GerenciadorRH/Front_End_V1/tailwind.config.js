/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1B231D", 2: "#242E26" },
        paper: "#F4F3EE",
        line: "#DEDBD1",
        muted: "#6E7468",
        accent: { DEFAULT: "#2F6F4E", dark: "#234F39", soft: "#E7F0EA" },
        amber: { DEFAULT: "#C98A2C", soft: "#FBF1DF" },
        danger: { DEFAULT: "#B23B32", soft: "#FBEAE8" },
        info: { DEFAULT: "#2E5C8A", soft: "#E9F1F9" },
        violet: { DEFAULT: "#6B5CA5", soft: "#EFEBF7" },
        teal: { DEFAULT: "#2E7C77", soft: "#E6F1F0" },
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "3px",
      },
    },
  },
  plugins: [],
};
