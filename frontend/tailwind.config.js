/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hacker: {
          bg: '#0a0a0a',
          green: '#00ff00',
          dim: '#003300',
          text: '#00ff00',
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}
