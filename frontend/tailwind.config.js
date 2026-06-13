/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        ink: '#13201c',
        mint: '#5eead4',
        lagoon: '#0891b2',
        coral: '#fb7185'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(8, 145, 178, 0.18)'
      }
    }
  },
  plugins: []
};
