/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#86C232', // Un verde tipo agapornis
        'brand-dark': '#222629',
        'brand-gray': '#474B4F',
        'brand-light': '#6B6E70',
      }
    },
  },
  plugins: [],
}