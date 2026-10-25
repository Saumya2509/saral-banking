import React from 'react';
import { useT } from '../../i18n/index.js';

/**
 * StepHeader component
 * Renders modern progress stepper e.g. "Step 1 of 3 · Fill in"
 */
export default function StepHeader({ current = 1, total = 3, name = '', className = '', style = {} }) {
  const t = useT();

  const stepText = t('core.label.step', {
    current,
    total,
    name,
  }) || `Step ${current} of ${total} · ${name}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '16px',
        ...style,
      }}
      className={className}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--brand)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {stepText}
        </span>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {current === 1 ? 'Enter Details' : current === 2 ? 'Verify Details' : 'Authentication'}
        </span>
      </div>

      {/* Visual Stepper Progress Bar */}
      <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '999px',
              backgroundColor: idx + 1 <= current ? 'var(--brand)' : 'rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
