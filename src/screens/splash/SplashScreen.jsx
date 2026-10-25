import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SaralLogo from '../../components/ui/SaralLogo';
import { ShieldIcon, ArrowRight, ZapIcon, CheckIcon } from '../../components/icons/Icons';

export default function SplashScreen({ onStart, autoAdvance = true, durationMs = 2800 }) {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProceed = () => {
    try {
      sessionStorage.setItem('saral_has_seen_splash', 'true');
    } catch {}
    setIsFadingOut(true);
    setTimeout(() => {
      if (onStart) {
        onStart();
      } else {
        navigate('/signin', { replace: true });
      }
    }, 240);
  };

  // Smooth progress calculation & auto-advance timer
  useEffect(() => {
    if (!autoAdvance) return;

    const interval = 20; // update every 20ms
    const step = (interval / durationMs) * 100;
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const timer = setTimeout(() => {
      handleProceed();
    }, durationMs);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(timer);
    };
  }, [autoAdvance, durationMs]);

  return (
    <div
      onClick={handleProceed}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#071224',
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(26, 86, 219, 0.35) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 50% 110%, rgba(14, 116, 144, 0.25) 0%, transparent 60%)
        `,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px 32px 20px',
        maxWidth: '480px',
        margin: '0 auto',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.24s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background Architectural Fine Grid (Financial Security Motif) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.07,
          pointerEvents: 'none',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="securityGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ffffff" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#securityGrid)" />
        {/* Subtle Watermark Concentric Circles */}
        <circle cx="50%" cy="38%" r="140" fill="none" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="4 8" />
        <circle cx="50%" cy="38%" r="200" fill="none" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="2 6" />
      </svg>

      {/* Top Header: Trust Tag & Skip Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
          paddingTop: '8px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'rgba(255, 255, 255, 0.85)',
            textTransform: 'uppercase',
          }}
        >
          <ShieldIcon size={12} color="#38bdf8" />
          <span>Universal Digital Banking</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleProceed();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            padding: '6px 12px',
            cursor: 'pointer',
            borderRadius: '6px',
          }}
          className="interactive-tap hover:text-white"
        >
          Skip
        </button>
      </div>

      {/* Main Centerpiece: Clean Institutional Emblem & Typography */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 2,
          marginTop: '-24px',
        }}
      >
        {/* Emblem Badge Container with Crisp Precision Border */}
        <div
          style={{
            width: '104px',
            height: '104px',
            borderRadius: '26px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
          }}
        >
          <img
            src="/salar.svg"
            alt="Saral Bank Emblem"
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              objectFit: 'contain',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          Saral Bank
        </h1>

        {/* Authentic Multi-Script Subtitle */}
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#93c5fd',
            letterSpacing: '0.02em',
            marginBottom: '8px',
          }}
        >
          सरल बैंकिंग · Simple & Secure Banking
        </div>

        {/* Mission Statement */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 24px 0',
            maxWidth: '280px',
            lineHeight: 1.45,
          }}
        >
          Standardized, jargon-free digital accounts designed for every citizen.
        </p>

        {/* Feature Highlights Pills (Clean, Flat, Professional) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            maxWidth: '320px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <CheckIcon size={13} color="#4ade80" />
            <span>Safe Simulated Mode</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <ZapIcon size={13} color="#facc15" />
            <span>Instant UPI 2.0</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <span>🇮🇳 EN · हिन्दी · தமிழ்</span>
          </div>
        </div>

        {/* Primary CTA Button: High-Contrast Modern Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleProceed();
          }}
          style={{
            padding: '13px 28px',
            borderRadius: '999px',
            backgroundColor: '#ffffff',
            color: '#071224',
            fontWeight: 700,
            fontSize: '0.9375rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          className="interactive-tap hover:scale-102"
        >
          <span>Continue to Sign In</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Bottom Section: Progress Bar & Trust Footnote */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 2,
        }}
      >
        {/* Subtle Horizontal Loading Line */}
        <div
          style={{
            width: '140px',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: '#38bdf8',
              borderRadius: '999px',
              transition: 'width 20ms linear',
            }}
          />
        </div>

        {/* Institutional Trust Disclaimer */}
        <div
          style={{
            fontSize: '0.6875rem',
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          Cyber Fraud Protocol 1930 Enabled · Standard Architecture
        </div>
      </div>
    </div>
  );
}
