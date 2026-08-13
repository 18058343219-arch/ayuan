/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'pink-light': '#FFF0F5',
        'pink-primary': '#FFB6C1',
        'pink-dark': '#DB7093',
        'pink-shadow': '#FF69B4',
        'pink-bg': '#FFF5F7',
      }
    },
  },
  plugins: [],
}