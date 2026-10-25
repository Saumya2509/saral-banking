import React, { useState, useEffect } from 'react';
import { useT } from '../../i18n/index.js';
import { playTapTone, playErrorTone } from '../../utils/audio.js';
import { LockIcon, AlertCircleIcon } from '../icons/Icons';

/**
 * PinPad component
 * Accessible, secure 4-digit PIN pad with audio tap feedback, error shake animation,
 * and strict privacy guards (never captures PIN via voice).
 */
export default function PinPad({
  onSubmit,
  title = null,
  error = null,
  disabled = false,
  className = '',
}) {
  const t = useT();
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  const displayTitle = title || t('core.signin.enterPin') || 'Enter your 4-digit PIN';

  // Trigger shake animation and error tone when error prop changes
  useEffect(() => {
    if (error) {
      playErrorTone();
      setIsShaking(true);
      setPin(''); // Reset entered PIN on error
      setAriaAnnouncement('Incorrect PIN. Keypad reset. Please enter your 4-digit PIN again.');
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDigit = (digit) => {
    if (disabled || pin.length >= 4) return;

    playTapTone();
    const nextPin = pin + digit;
    setPin(nextPin);
    setAriaAnnouncement(`${nextPin.length} of 4 digits entered`);

    if (nextPin.length === 4) {
      setAriaAnnouncement('4 digits entered. Verifying PIN...');
      setTimeout(() => {
        onSubmit(nextPin);
      }, 100);
    }
  };

  const handleBackspace = () => {
    if (disabled || pin.length === 0) return;
    playTapTone();
    setPin((prev) => {
      const updated = prev.slice(0, -1);
      setAriaAnnouncement(updated.length > 0 ? `${updated.length} digits entered` : 'PIN cleared');
      return updated;
    });
  };

  const handleClear = () => {
    if (disabled) return;
    playTapTone();
    setPin('');
    setAriaAnnouncement('PIN cleared');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
      }}
      className={`pin-pad-container animate-fade-in ${className}`}
    >
      {/* Title with Security Shield */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <LockIcon size={20} className="text-slate-500" />
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {displayTitle}
        </h2>
      </div>

      {/* Screen reader live status announcement */}
      <div className="visually-hidden" aria-live="polite" role="status">
        {ariaAnnouncement}
      </div>

      {/* Security Privacy Notice */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span>Keep PIN private · Never speak your PIN aloud</span>
      </div>

      {/* 4 Dots Indicator with optional Shake Animation */}
      <div
        style={{
          display: 'flex',
          gap: '18px',
          marginBottom: '24px',
          justifyContent: 'center',
          padding: '8px',
        }}
        className={isShaking ? 'animate-shake' : ''}
        aria-label={`${pin.length} of 4 digits entered`}
      >
        {[0, 1, 2, 3].map((index) => {
          const filled = index < pin.length;
          return (
            <div
              key={index}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: filled ? 'var(--brand)' : 'var(--surface-alt)',
                border: `2px solid ${filled ? 'var(--brand)' : 'var(--border)'}`,
                transform: filled ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: filled ? '0 0 10px rgba(26, 86, 219, 0.35)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--danger)',
            fontSize: '0.875rem',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 600,
            backgroundColor: '#fee2e2',
            padding: '8px 12px',
            borderRadius: '8px',
          }}
          className="animate-fade-in"
        >
          <AlertCircleIcon size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Number Pad Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          width: '100%',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            type="button"
            disabled={disabled}
            aria-label={`Digit ${num}`}
            onClick={() => handleDigit(String(num))}
            style={{
              height: '58px',
              borderRadius: '16px',
              border: '1.5px solid var(--border)',
              backgroundColor: 'var(--surface-alt)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
            className="interactive-tap hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {num}
          </button>
        ))}

        {/* Bottom row: Clear, 0, Backspace */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleClear}
          aria-label="Clear all entered digits"
          style={{
            height: '58px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          className="interactive-tap hover:text-slate-800"
        >
          {t('core.btn.cancel') || 'Clear'}
        </button>

        <button
          type="button"
          disabled={disabled}
          aria-label="Digit 0"
          onClick={() => handleDigit('0')}
          style={{
            height: '58px',
            borderRadius: '16px',
            border: '1.5px solid var(--border)',
            backgroundColor: 'var(--surface-alt)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          className="interactive-tap hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={handleBackspace}
          aria-label="Backspace: delete last digit"
          style={{
            height: '58px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '1.35rem',
            color: 'var(--text-muted)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="interactive-tap hover:text-slate-800"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
