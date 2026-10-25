import React from 'react';

/**
 * Card component
 * Surface-alt background, 12px radius, 16px padding, card shadow
 */
export default function Card({ heading, children, className = '', style = {}, ...props }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        ...style,
      }}
      className={`card card-interactive ${className}`}
      {...props}
    >
      {heading && (
        <h2
          style={{
            fontSize: 'var(--font-size-heading, 1.25rem)',
            fontWeight: 600,
            marginBottom: '12px',
            color: 'var(--text-primary)',
          }}
        >
          {heading}
        </h2>
      )}
      {children}
    </div>
  );
}
