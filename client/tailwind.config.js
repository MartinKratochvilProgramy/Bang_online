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
      }

    },
    theme: {
    }
  },
  plugins: [],
}