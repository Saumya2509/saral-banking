import React from 'react';
import { useStore } from '../../store/index.js';
import { speak } from '../../utils/speech.js';

/**
 * BigButton component
 * Variants: primary, secondary, danger, text
 * Verb-first label, 48px min height (72px in Simple mode), WCAG AA contrast
 */
export default function BigButton({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  disabledReason = '',
  icon = null,
  type = 'button',
  className = '',
  fullWidth = true,
  ...props
}) {
  const { state } = useStore();
  const handleClick = (e) => {
    // Speak label on click if readAloud or simple mode enabled
    if ((state.settings.readAloud || state.settings.mode === 'simple') && typeof children === 'string') {
      speak(children, state.settings.lang || 'en');
    }
    if (onClick) onClick(e);
  };

  const handleFocus = (e) => {
    if ((state.settings.readAloud || state.settings.mode === 'simple') && typeof children === 'string') {
      speak(children, state.settings.lang || 'en');
    }
    if (props.onFocus) props.onFocus(e);
  };

  let baseStyle = {
    minHeight: 'var(--control-h, 48px)',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '0 20px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    width: fullWidth ? '100%' : 'auto',
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
  };

  let variantStyle = {};

  if (variant === 'primary') {
    variantStyle = {
      background: 'linear-gradient(135deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 78%, #2d7da8) 100%)',
      color: 'var(--brand-contrast, #ffffff)',
      boxShadow: '0 8px 18px rgba(18, 59, 103, 0.18)',
    };
  } else if (variant === 'secondary') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--brand)',
      border: '2px solid var(--brand)',
    };
  } else if (variant === 'danger') {
    variantStyle = {
      backgroundColor: 'var(--danger)',
      color: '#ffffff',
    };
  } else if (variant === 'text') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--brand)',
      textDecoration: 'underline',
      minHeight: 'auto',
      padding: '8px',
    };
  }

  return (
    <button
      type={type}
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
      aria-disabled={disabled}
      onClick={disabled ? undefined : handleClick}
      onFocus={disabled ? undefined : handleFocus}
      style={{ ...baseStyle, ...variantStyle }}
      className={`interactive-tap focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        {icon && (
          <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {children}
        </span>
      </span>
    </button>
  );
}
