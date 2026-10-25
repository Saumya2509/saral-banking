import React from 'react';

/**
 * ReviewList component
 * Clean list of key-value rows for review screens and receipts
 */
export default function ReviewList({ items = [], className = '', style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        backgroundColor: 'var(--surface-alt)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        marginBottom: '20px',
        ...style,
      }}
      className={className}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: index < items.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: '0.9375rem',
            gap: '12px',
          }}
        >
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            {item.label}
          </span>
          <span
            style={{
              fontWeight: 600,
              color: 'var(--text-primary)',
              textAlign: 'right',
            }}
            className="no-truncate"
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
