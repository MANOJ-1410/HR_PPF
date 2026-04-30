/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mv-navy': '#2B2A64',
        'mv-red': '#C41E24',
      },
      boxShadow: {
        intense: '0 20px 50px -10px rgba(0, 0, 0, 0.15)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

