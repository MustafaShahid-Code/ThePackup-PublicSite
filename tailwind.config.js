/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm espresso ink instead of neutral black
        charcoal: '#16110E',
        ivory: '#F8F3EA',
        cream: '#EDE3CF',
        gold: '#C9A96E',
        ember: '#D2582F',
        beige: '#E4D7C1',
        kraft: '#C6A171',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 38s linear infinite' },
    },
  },
  plugins: [],
}
