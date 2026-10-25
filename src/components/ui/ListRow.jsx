import React from 'react';
import { ChevronRightIcon } from '../icons/Icons';

/**
 * ListRow component
 * Min 56px height, optional icon, title, subtitle, trailing element, click handler, chevron
 */
export default function ListRow({
  icon = null,
  title,
  subtitle = null,
  trailing = null,
  onClick = null,
  chevron = false,
  className = '',
  style = {},
  ...props
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      style={{
        minHeight: 'var(--size-list-row, 56px)',
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        ...style,
      }}
      className={`list-row ${isClickable ? 'hover:bg-slate-50 active:bg-slate-100' : ''} ${className}`}
      {...props}
    >
      {icon && (
        <div
          style={{
            marginRight: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
        <div
          style={{
            fontSize: 'var(--font-size-label, 1rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
          className="no-truncate"
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 'var(--font-size-small, 0.875rem)',
              color: 'var(--text-muted)',
              marginTop: '2px',
              lineHeight: 1.3,
            }}
            className="no-truncate"
          >
            {subtitle}
          </div>
        )}
      </div>

      {trailing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        >
          {trailing}
        </div>
      )}

      {chevron && (
        <div
          style={{
            marginLeft: '8px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <ChevronRightIcon size={20} />
        </div>
      )}
    </div>
  );
}
