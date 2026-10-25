import React from 'react';

/**
 * Official Saral Bank Ribbon Logo
 * Matches the geometric dual-ribbon 'S' emblem from the visual mockups.
 */
export default function SaralLogo({
  size = 56,
  variant = 'color', // 'color' | 'white' | 'dark'
  showText = false,
  tagline = false,
  className = '',
  style = {},
}) {
  const isWhite = variant === 'white';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: showText ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showText ? '8px' : '0px',
        ...style,
      }}
      className={className}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Top Ribbon Gradient */}
          <linearGradient id="saralRibbonTop" x1="15" y1="15" x2="85" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#38bdf8'} />
            <stop offset="100%" stopColor={isWhite ? '#e0f2fe' : '#1d4ed8'} />
          </linearGradient>

          {/* Bottom Ribbon Gradient */}
          <linearGradient id="saralRibbonBottom" x1="85" y1="85" x2="15" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isWhite ? '#f8fafc' : '#1e40af'} />
            <stop offset="100%" stopColor={isWhite ? '#bae6fd' : '#0284c7'} />
          </linearGradient>

          {/* Subtle Glow */}
          <filter id="saralGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={isWhite ? 'rgba(255,255,255,0.3)' : 'rgba(29, 78, 216, 0.25)'} />
          </filter>
        </defs>

        <g filter="url(#saralGlow)">
          {/* Top Fold Ribbon */}
          <path
            d="M 28 22 C 28 17 33 14 38 15 L 72 26 C 78 28 82 34 80 40 L 76 50 C 74 55 68 57 63 55 L 42 47 C 36 45 33 39 35 33 L 36 29 C 36 25 32 22 28 22 Z"
            fill="url(#saralRibbonTop)"
          />

          {/* Bottom Fold Ribbon */}
          <path
            d="M 72 78 C 72 83 67 86 62 85 L 28 74 C 22 72 18 66 20 60 L 24 50 C 26 45 32 43 37 45 L 58 53 C 64 55 67 61 65 67 L 64 71 C 64 75 68 78 72 78 Z"
            fill="url(#saralRibbonBottom)"
          />

          {/* Center Interlocking Prism Accent */}
          <polygon
            points="42,47 63,55 58,53 37,45"
            fill={isWhite ? '#ffffff' : '#1e3a8a'}
            opacity="0.25"
          />
        </g>
      </svg>

      {showText && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: `${Math.max(18, size * 0.45)}px`,
              fontWeight: 800,
              color: isWhite ? '#ffffff' : '#0f172a',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
            }}
          >
            Saral Bank
          </div>
          {tagline && (
            <div
              style={{
                fontSize: `${Math.max(11, size * 0.22)}px`,
                color: isWhite ? 'rgba(255, 255, 255, 0.85)' : '#64748b',
                marginTop: '3px',
                fontWeight: 500,
              }}
            >
              Simple Banking. Better Tomorrow.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
