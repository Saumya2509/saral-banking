import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SaralLogo from '../../components/ui/SaralLogo';

export default function SplashScreen({ onStart, autoAdvance = true, durationMs = 2400 }) {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleProceed = () => {
    sessionStorage.setItem('saral_has_seen_splash', 'true');
    setIsFadingOut(true);
    setTimeout(() => {
      if (onStart) {
        onStart();
      } else {
        navigate('/signin', { replace: true });
      }
    }, 300);
  };

  // Automatic transition after animated intro
  useEffect(() => {
    if (!autoAdvance) return;
    const timer = setTimeout(() => {
      handleProceed();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [autoAdvance, durationMs]);

  return (
    <div
      onClick={handleProceed}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, #1042b5 0%, #0d3494 45%, #08216b 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 24px 44px 24px',
        maxWidth: '480px',
        margin: '0 auto',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Dynamic Animated Gradient Aura */}
      <div
        className="animate-splash-glow"
        style={{
          position: 'absolute',
          top: '25%',
          left: '20%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 1: Floating Liquid Wave */}
      <div
        className="animate-splash-wave-1"
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-60px',
          right: '-60px',
          height: '240px',
          borderRadius: '50% 50% 0 0',
          background: 'linear-gradient(180deg, rgba(29, 78, 216, 0.35) 0%, rgba(15, 23, 42, 0.75) 100%)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 2: Secondary Counter Wave */}
      <div
        className="animate-splash-wave-2"
        style={{
          position: 'absolute',
          bottom: '-70px',
          left: '-40px',
          right: '-40px',
          height: '210px',
          borderRadius: '45% 55% 0 0',
          background: 'radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top spacer */}
      <div />

      {/* Center Brand Identity with Staggered Starting Animation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        {/* Animated Glowing Ribbon S Logo */}
        <div className="animate-splash-logo" style={{ marginBottom: '22px' }}>
          <SaralLogo size={96} variant="white" />
        </div>

        {/* Animated Brand Title */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: '0 0 8px 0',
            letterSpacing: '-0.75px',
            color: '#ffffff',
            textShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
          className="animate-slide-up"
        >
          Saral Bank
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '1.0625rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 28px 0',
            fontWeight: 500,
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
          className="animate-fade-in"
        >
          Simple Banking. Better Tomorrow.
        </p>

        {/* Interactive "Get Started →" Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleProceed();
          }}
          style={{
            padding: '12px 32px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="interactive-tap hover:bg-white hover:text-blue-900"
        >
          <span>Get Started</span>
          <span>→</span>
        </button>

        {/* Subtle Progress Bar */}
        <div
          style={{
            width: '160px',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '28px',
          }}
        >
          <div
            className="animate-splash-bar"
            style={{
              height: '100%',
              backgroundColor: '#38bdf8',
              borderRadius: '2px',
              boxShadow: '0 0 8px #38bdf8',
            }}
          />
        </div>
      </div>

      {/* Footer Trusted Label */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'rgba(255, 255, 255, 0.65)',
          zIndex: 2,
          letterSpacing: '0.5px',
        }}
        className="animate-fade-in"
      >
        Your Trusted Banking Partner
      </div>
    </div>
  );
}
