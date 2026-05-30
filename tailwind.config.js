/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        gold: {
          light: '#F4EBD3',
          mid: '#C9A961',
          dark: '#8A6E2F',
        },
        ink: '#1A1A1A',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        caveat: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}
