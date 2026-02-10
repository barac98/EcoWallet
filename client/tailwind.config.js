/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#13ec5b', 
        'primary-dark': '#0fa842',
        background: {
            light: '#f6f8f6',
            dark: '#0a1610', // Deepened for contrast
            card: '#112218', // Card background from image
        },
        surface: {
            light: '#ffffff',
            dark: '#15281e',
        }
      }
    },
  },
  plugins: [],
}