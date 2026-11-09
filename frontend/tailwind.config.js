/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0B1220',
        primary: '#2563EB',
        cyan: '#22D3EE',
        teal: '#14B8A6',
        lightbg: '#F5F7FB',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
