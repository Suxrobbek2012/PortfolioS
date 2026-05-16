import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        'accent-secondary': 'var(--accent-secondary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'glitch': 'glitch 4s ease-in-out infinite',
        'border-rotate': 'borderRotate 8s linear infinite',
        'progress-fill': 'progressFill 1.5s ease-in-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'draw-line': 'drawLine 2s ease-in-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px var(--accent), 0 0 10px var(--accent)' },
          '50%': { boxShadow: '0 0 20px var(--accent), 0 0 40px var(--accent)' },
        },
        glitch: {
          '0%, 90%, 100%': { textShadow: 'none', transform: 'none' },
          '92%': { textShadow: '-2px 0 #ff00ff, 2px 0 #00ffff', transform: 'skewX(-1deg)' },
          '94%': { textShadow: '2px 0 #ff00ff, -2px 0 #00ffff', transform: 'skewX(1deg)' },
          '96%': { textShadow: '-2px 0 #ff00ff, 2px 0 #00ffff', transform: 'skewX(0deg)' },
          '98%': { textShadow: 'none', transform: 'none' },
        },
        borderRotate: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '60%': { transform: 'translateX(-10px)' },
          '80%': { transform: 'translateX(10px)' },
        },
        drawLine: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
