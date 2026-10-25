import React from 'react';

/**
 * Segmented control for choosing between options
 * e.g. English / Hindi or Normal / Large / Largest
 */
export default function Segmented({ options = [], value, onChange, className = '', style = {} }) {
  return (
    <div
      role="group"
      style={{
        display: 'flex',
        backgroundColor: 'var(--surface-alt)',
        padding: '3px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        boxSizing: 'border-box',
        gap: '2px',
        ...style,
      }}
      className={`hide-scrollbar ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            style={{
              flex: '1 0 auto',
              minHeight: '36px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap',
              backgroundColor: isSelected ? 'var(--brand)' : 'transparent',
              color: isSelected ? 'var(--brand-contrast, #ffffff)' : 'var(--text-primary)',
              boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'center',
            }}
            className="interactive-tap"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
