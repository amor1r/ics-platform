import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary (Neon Green)
        primary: {
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00ff41', // Main Neon Green
          600: '#00cc33',
          700: '#009926',
          800: '#006619',
          900: '#00330c',
        },
        // Secondary (Neon Red)
        secondary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff0040', // Main Neon Red
          600: '#cc0033',
          700: '#990026',
          800: '#66001a',
          900: '#33000d',
        },
        // Accent (Neon Cyan)
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00ffff', // Main Neon Cyan
          600: '#00cccc',
          700: '#009999',
          800: '#006666',
          900: '#003333',
        },
        // Background
        background: {
          primary: '#0a0a0a',
          secondary: '#111111',
          tertiary: '#1a1a1a',
          elevated: '#222222',
        },
        // Text
        text: {
          primary: '#ffffff',
          secondary: '#e0e0e0',
          tertiary: '#b0b0b0',
          inverse: '#0a0a0a',
        },
        // Status
        success: '#00ff41',
        error: '#ff0040',
        warning: '#ffaa00',
        info: '#00ffff',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'Courier New', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(0, 255, 65, 0.5), 0 0 20px rgba(0, 255, 65, 0.3), 0 0 30px rgba(0, 255, 65, 0.1)',
        'neon-red': '0 0 10px rgba(255, 0, 64, 0.5), 0 0 20px rgba(255, 0, 64, 0.3), 0 0 30px rgba(255, 0, 64, 0.1)',
        'neon-cyan': '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3), 0 0 30px rgba(0, 255, 255, 0.1)',
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'typing': 'typing 3s steps(40, end)',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(0, 255, 65, 0.8)' },
        },
        'slide-in': {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
