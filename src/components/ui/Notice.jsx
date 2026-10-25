import React from 'react';
import { InfoIcon, AlertTriangleIcon, CheckIcon, AlertCircleIcon } from '../icons/Icons';

/**
 * Notice banner component
 * Always uses both icon and color
 */
export default function Notice({ type = 'info', title = null, children, className = '', style = {} }) {
  let icon = <InfoIcon size={20} />;
  let bgColor = 'var(--brand-soft)';
  let borderColor = 'var(--info)';
  let textColor = 'var(--text-primary)';

  if (type === 'safety' || type === 'warning') {
    icon = <AlertTriangleIcon size={20} />;
    bgColor = '#fffbeb';
    borderColor = 'var(--warning)';
  } else if (type === 'success') {
    icon = <CheckIcon size={20} />;
    bgColor = '#ecfdf5';
    borderColor = 'var(--success)';
  } else if (type === 'error' || type === 'danger') {
    icon = <AlertCircleIcon size={20} />;
    bgColor = '#fef2f2';
    borderColor = 'var(--danger)';
  }

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        color: textColor,
        marginBottom: '16px',
        ...style,
      }}
      className={className}
    >
      <div style={{ flexShrink: 0, marginTop: '2px', color: borderColor }}>
        {icon}
      </div>
      <div style={{ flex: 1, fontSize: '0.9375rem', lineHeight: 1.4 }}>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: '2px', color: 'var(--text-primary)' }}>
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
