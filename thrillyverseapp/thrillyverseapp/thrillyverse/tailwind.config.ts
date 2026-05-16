import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
      "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        ticker:  'ticker 25s linear infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      colors: {
        brand: {
          DEFAULT: '#6d28d9',
          dark:    '#4c1d95',
          light:   '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
}

export default config