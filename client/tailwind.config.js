/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          50: '#FBF9F5',
          100: '#F5F0E8',
          200: '#E9E0D2',
          300: '#D5C4AC',
          400: '#BFA482',
          500: '#A9875C',
          600: '#8E6E45',
          700: '#6E5434',
          800: '#4E3C27',
          900: '#2C2216',
          950: '#18120B',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#2B2B2B',
          850: '#1F1F1F',
          900: '#151515',
          950: '#0C0C0C',
        },
        gold: {
          DEFAULT: '#C2A676',
          light: '#DFCBB2',
          dark: '#9A7D4D',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
