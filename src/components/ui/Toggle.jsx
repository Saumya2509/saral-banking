import React, { useId } from 'react';

/**
 * Toggle switch component
 * Accessible, 48px tap target
 */
export default function Toggle({ label, checked, onChange, disabled = false, className = '' }) {
  const id = useId();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 'var(--size-tap-target, 48px)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
      className={className}
      onClick={() => {
        if (!disabled && onChange) {
          onChange(!checked);
        }
      }}
    >
      <label
        htmlFor={id}
        style={{
          fontSize: 'var(--font-size-label, 1rem)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          cursor: 'inherit',
          userSelect: 'none',
        }}
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && onChange) {
            onChange(!checked);
          }
        }}
        style={{
          width: '52px',
          height: '32px',
          borderRadius: '9999px',
          backgroundColor: checked ? 'var(--brand)' : 'var(--border)',
          position: 'relative',
          border: 'none',
          padding: '2px',
          cursor: 'inherit',
          transition: 'background-color 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}
