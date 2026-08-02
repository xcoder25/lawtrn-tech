/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Logo-aligned: deep navy, electric blue, chrome silver
        void: '#050B16',
        panel: '#0A1220',
        panel2: '#0F1A2C',
        panel3: '#162236',
        line: '#1A2A40',
        'line-bright': '#2A3F5C',
        circuit: '#1A9FFF',       // electric blue from logo
        'circuit-bright': '#4DB8FF',
        'circuit-dim': '#0D6BB5',
        chrome: '#C5CDD8',        // silver from logo
        'chrome-bright': '#E8EEF6',
        signal: '#2DD4BF',
        'signal-dim': '#1A8A7A',
        ink: '#E8EEF6',
        'ink-dim': '#8B9BB0',
        'ink-muted': '#5A6A80',
        alert: '#FF5D5D',
        success: '#34D399',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'circuit-grid':
          "linear-gradient(rgba(26,159,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,159,255,0.05) 1px, transparent 1px)",
        'hero-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(26,159,255,0.18), transparent), radial-gradient(ellipse 50% 40% at 85% 40%, rgba(45,212,191,0.06), transparent)',
        'card-shine':
          'linear-gradient(135deg, rgba(26,159,255,0.04) 0%, transparent 45%, rgba(197,205,216,0.02) 100%)',
        'logo-glow':
          'radial-gradient(circle at center, rgba(26,159,255,0.15), transparent 70%)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      boxShadow: {
        glow: '0 0 28px -4px rgba(26,159,255,0.35)',
        'glow-sm': '0 0 14px -2px rgba(26,159,255,0.25)',
        'glow-signal': '0 0 20px -4px rgba(45,212,191,0.3)',
        card: '0 4px 24px -8px rgba(0,0,0,0.55)',
        elevated: '0 12px 40px -12px rgba(0,0,0,0.65)',
      },
      keyframes: {
        traceIn: {
          '0%': { strokeDashoffset: '1200', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        drawRing: {
          '0%': { strokeDashoffset: '600' },
          '100%': { strokeDashoffset: '0' },
        },
        nodePulse: {
          '0%, 100%': { r: '4', opacity: '0.6' },
          '50%': { r: '6', opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(26,159,255,0.2)' },
          '50%': { borderColor: 'rgba(26,159,255,0.55)' },
        },
      },
      animation: {
        trace: 'traceIn 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        glow: 'pulseGlow 2.8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.45s ease-out forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'spin-slow': 'spinSlow 28s linear infinite',
        'draw-ring': 'drawRing 2s ease-out forwards',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animationDelay: {
        100: '100ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },
    },
  },
  plugins: [],
};
