/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          950: '#2a1a4a',
          900: '#3d2565',
          600: '#a855f7',
          500: '#d946ef',
          400: '#c084fc', // added for completeness if used
          300: '#d8b4fe',
          200: '#e9d5ff',
          100: '#f3e8ff',
        },
        purple: {
          950: '#2a1a4a',
          900: '#3d2565',
          600: '#a855f7',
          500: '#d946ef',
        }
      }
    },
  },
  plugins: [],
}
