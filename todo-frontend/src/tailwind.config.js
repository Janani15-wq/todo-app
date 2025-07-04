/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed', // purple
          light: '#a78bfa',
          dark: '#4c1d95',
        },
        accent: {
          DEFAULT: '#06b6d4', // teal
          light: '#67e8f9',
          dark: '#0e7490',
        },
        orange: {
          DEFAULT: '#fb923c',
          light: '#fdba74',
          dark: '#c2410c',
        },
        pastel: {
          blue: '#bae6fd',
          pink: '#fbcfe8',
          yellow: '#fef9c3',
          green: '#bbf7d0',
        },
      },
      fontFamily: {
        sans: [
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
