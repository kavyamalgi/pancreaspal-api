/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#1e54b7',
        'medical-orange': '#ff6f00',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
