/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#020617",
        accent: "#38bdf8",
        secondary: "#818cf8",
      }
    },
  },
  plugins: [],
}
