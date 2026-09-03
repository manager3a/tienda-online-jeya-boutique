import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#151716',
          soft: '#232625',
        },
        accent: {
          DEFAULT: '#38c2bc',
          dark: '#2a9a95',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f4f3f0',
        },
        bg: '#faf9f7',
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-montserrat)', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 10px 30px rgba(21, 23, 22, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
