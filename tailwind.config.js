/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pp': '#F47933', // People's Party Orange
        'pt': '#E3000F', // Phuea Thai Red
        'utn': '#2D427D', // UTN Blue
        'bjt': '#0B1F4F', // BJT Dark Blue
        'dem': '#40C0F0', // Democrat Light Blue
      }
    },
  },
  plugins: [],
}
