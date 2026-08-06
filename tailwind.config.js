/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Logo-aligned: deep navy, electric blue, chrome silver
        void: 'rgb(var(--color-void-rgb) / <alpha-value>)',
        panel: 'rgb(var(--color-panel-rgb) / <alpha-value>)',
        panel2: 'rgb(var(--color-panel2-rgb) / <alpha-value>)',
        panel3: 'rgb(var(--color-panel3-rgb) / <alpha-value>)',
        line: 'rgb(var(--color-line-rgb) / <alpha-value>)',
        'line-bright': 'rgb(var(--color-line-bright-rgb) / <alpha-value>)',
        circuit: 'rgb(var(--color-circuit-rgb) / <alpha-value>)',       // electric blue from logo
        'circuit-bright': 'rgb(var(--color-circuit-bright-rgb) / <alpha-value>)',
        'circuit-dim': 'rgb(var(--color-circuit-dim-rgb) / <alpha-value>)',
        chrome: 'rgb(var(--color-chrome-rgb) / <alpha-value>)',        // silver from logo
        'chrome-bright': 'rgb(var(--color-chrome-bright-rgb) / <alpha-value>)',
        signal: 'rgb(var(--color-signal-rgb) / <alpha-value>)',
        'signal-dim': 'rgb(var(--color-signal-dim-rgb) / <alpha-value>)',
        ink: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
        'ink-dim': 'rgb(var(--color-ink-dim-rgb) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted-rgb) / <alpha-value>)',
        alert: 'rgb(var(--color-alert-rgb) / <alpha-value>)',
        success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'circuit-grid':
          "linear-gradient(rgb(var(--color-circuit-rgb) / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-circuit-rgb) / 0.05) 1px, transparent 1px)",
        'hero-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgb(var(--color-circuit-rgb) / 0.18), transparent), radial-gradient(ellipse 50% 40% at 85% 40%, rgb(var(--color-signal-rgb) / 0.06), transparent)',
        'card-shine':
          'linear-gradient(135deg, rgb(var(--color-circuit-rgb) / 0.04) 0%, transparent 45%, rgb(var(--color-chrome-rgb) / 0.02) 100%)',
        'logo-glow':
          'radial-gradient(circle at center, rgb(var(--color-circuit-rgb) / 0.15), transparent 70%)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      boxShadow: {
        glow: '0 0 28px -4px rgb(var(--color-circuit-rgb) / 0.35)',
        'glow-sm': '0 0 14px -2px rgb(var(--color-circuit-rgb) / 0.25)',
        'glow-signal': '0 0 20px -4px rgb(var(--color-signal-rgb) / 0.3)',
        card: '0 4px 24px -8px rgba(0,0,0,0.12)',
        elevated: '0 12px 40px -12px rgba(0,0,0,0.18)',
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
          '0%, 100%': { borderColor: 'rgb(var(--color-circuit-rgb) / 0.2)' },
          '50%': { borderColor: 'rgb(var(--color-circuit-rgb) / 0.55)' },
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
