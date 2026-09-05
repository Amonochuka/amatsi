/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: 'rgb(var(--stone-50) / <alpha-value>)',
          100: 'rgb(var(--stone-100) / <alpha-value>)',
          200: 'rgb(var(--stone-200) / <alpha-value>)',
          300: 'rgb(var(--stone-300) / <alpha-value>)',
          400: 'rgb(var(--stone-400) / <alpha-value>)',
          500: 'rgb(var(--stone-500) / <alpha-value>)',
          600: 'rgb(var(--stone-600) / <alpha-value>)',
          700: 'rgb(var(--stone-700) / <alpha-value>)',
          800: 'rgb(var(--stone-800) / <alpha-value>)',
          900: 'rgb(var(--stone-900) / <alpha-value>)',
          950: 'rgb(var(--stone-950) / <alpha-value>)',
        },
        brand: {
          bg: 'rgb(var(--brand-bg) / <alpha-value>)',
          card: 'rgb(var(--brand-card) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
          orange: 'rgb(var(--brand-orange) / <alpha-value>)',
          sidebar: 'rgb(var(--brand-accent) / <alpha-value>)',
          sidebarActive: 'rgb(var(--brand-orange) / <alpha-value>)',
          brightGreen: '#34D399',
        },
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};