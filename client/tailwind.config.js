/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rye: ["Rye", "sans-serif"]
      },
      colors: {
        beige: "#F8CDAA",
        darkBeige: "#e3ad81",
      }

    },
    theme: {
    }
  },
  plugins: [],
}