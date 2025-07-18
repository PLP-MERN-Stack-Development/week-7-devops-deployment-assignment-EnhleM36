// frontend/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0d6efd',
          dark: '#0047b3'
        },
        secondary: {
          light: '#f39e58',
          DEFAULT: '#ed7d2b',
          dark: '#c45e16'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}