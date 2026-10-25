import React from 'react';
import BigButton from './BigButton';
import Card from './Card';

/**
 * ChoicePrompt component
 * One calm sentence + two stacked buttons for critical choices / safety checks
 */
export default function ChoicePrompt({
  title = null,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  variant = 'primary',
  className = '',
  style = {},
}) {
  return (
    <Card
      style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--border)',
        ...style,
      }}
      className={className}
    >
      {title && (
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
      )}
      <p
        style={{
          fontSize: '1rem',
          lineHeight: 1.5,
          color: 'var(--text-primary)',
          marginBottom: '20px',
        }}
      >
        {message}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <BigButton variant={variant} onClick={onPrimary}>
          {primaryLabel}
        </BigButton>
        {secondaryLabel && (
          <BigButton variant="secondary" onClick={onSecondary}>
            {secondaryLabel}
          </BigButton>
        )}
      </div>
    </Card>
  );
}
