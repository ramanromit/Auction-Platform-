/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*/.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#111827",
        secondary: "#1a0505",
        crimson: "#DC2626",
      }
    },
  },
  plugins: [],
}