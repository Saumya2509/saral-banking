import React from 'react';
import BigButton from './BigButton';

/**
 * EmptyState component
 * Centered icon, one clear sentence, optional action
 */
export default function EmptyState({
  icon = null,
  message,
  action = null,
  className = '',
  style = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        textAlign: 'center',
        ...style,
      }}
      className={className}
    >
      {icon && (
        <div
          style={{
            color: 'var(--text-muted)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      )}

      <p
        style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: '320px',
          lineHeight: 1.5,
          marginBottom: action ? '20px' : 0,
        }}
      >
        {message}
      </p>

      {action && (
        <BigButton variant="primary" onClick={action.onClick} fullWidth={false}>
          {action.label}
        </BigButton>
      )}
    </div>
  );
}
