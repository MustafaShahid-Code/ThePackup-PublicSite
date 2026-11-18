/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme tokens — edited from the admin (Theme tab); defaults live in index.css / shared/theme.js
        charcoal: 'rgb(var(--c-charcoal) / <alpha-value>)',
        ivory: 'rgb(var(--c-ivory) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        deep: 'rgb(var(--c-deep) / <alpha-value>)',
        ember: 'rgb(var(--c-ember) / <alpha-value>)',
        // Packaging illustration tones (not themeable)
        beige: '#E4D7C1',
        kraft: '#C6A171',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'Poppins', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 38s linear infinite' },
    },
  },
  plugins: [],
}
