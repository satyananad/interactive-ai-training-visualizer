/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        panel: "rgba(15,23,42,0.8)",
        accent: "#06b6d4",
        accent2: "#a855f7"
      },
      boxShadow: {
        neon: "0 0 25px rgba(6,182,212,0.5)"
      }
    }
  },
  plugins: []
};

