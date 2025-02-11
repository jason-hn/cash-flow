/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        'income-green': '#6AC259',
        'expense-red': '#E94F4F',
        bg: '#f5f7fa',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [],
} 