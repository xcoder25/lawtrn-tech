import React from 'react';

export default function LoadingSpinner({ size = 120 }: { size?: number }) {
  return (
    <div className="blue-fire-container" style={{ width: size, height: size }}>
      {/* Invisible SVG filter definition that warps the CSS rings into fire licking shapes */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="blue-fire-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Rotating and flickering fire rings */}
      <div className="blue-fire-ring" />
      <div className="blue-fire-ring-secondary" />

      {/* Center logo mask */}
      <div className="absolute w-[76%] h-[76%] rounded-full overflow-hidden border border-line bg-void flex items-center justify-center p-0.5 z-10 shadow-[0_0_24px_rgba(26,159,255,0.45)]">
        <img
          src="/logo.jpg"
          alt="Lawtronic Logo"
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Deep blue backdrop glow */}
      <div className="absolute inset-0 rounded-full bg-logo-glow blur-xl opacity-60 scale-125 pointer-events-none" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void text-center animate-fade-in">
      <div className="mb-8">
        <LoadingSpinner size={130} />
      </div>
      <p className="font-display text-lg font-semibold tracking-wide text-ink uppercase">
        LAW<span className="text-circuit">TRONIC</span>
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-ink-muted animate-pulse">
        Initializing Core System...
      </p>
    </div>
  );
}
