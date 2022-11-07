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
        beige: "rgba(248, 205, 170, 0.8)",
        darkBeige: "#e3ad81",
        transparentBlack: "rgba(0, 0, 0, 0.6)"
      }
    },
    screens: {
      'xs': '1300px'
    },
    theme: {
    }
  },
  plugins: [],
}