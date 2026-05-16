import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#050816',
        accent: '#00f5ff',
        secondary: '#7928ca',
        'card-glass': 'rgba(255,255,255,0.05)',
        'border-glass': 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        md: '12px',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #00f5ff, #7928ca)',
        'gradient-radial': 'radial-gradient(ellipse at center, #0a0f2c 0%, #050816 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 20s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
