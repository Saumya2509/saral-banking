import React from 'react';
import { CheckIcon } from '../icons/Icons';

export default function StatusTimeline({ steps = [], className = '', style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '8px 0',
        ...style,
      }}
      className={className}
    >
      {steps.map((step, idx) => {
        const isDone = step.status === 'done';
        const isCurrent = step.status === 'current';
        const isLast = idx === steps.length - 1;

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '16px',
              position: 'relative',
              paddingBottom: isLast ? '0' : '24px',
            }}
          >
            {/* Connecting vertical line */}
            {!isLast && (
              <div
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '24px',
                  bottom: 0,
                  width: '2px',
                  backgroundColor: isDone ? 'var(--success)' : 'var(--border)',
                }}
              />
            )}

            {/* Node Circle */}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: isDone
                  ? 'var(--success)'
                  : isCurrent
                  ? 'var(--brand)'
                  : 'var(--surface)',
                border: isDone
                  ? 'none'
                  : isCurrent
                  ? 'none'
                  : '2px solid var(--border)',
                color: '#ffffff',
                zIndex: 1,
              }}
            >
              {isDone && <CheckIcon size={14} />}
              {isCurrent && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingTop: '1px' }}>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: isCurrent || isDone ? 600 : 500,
                  color: isCurrent ? 'var(--brand)' : 'var(--text-primary)',
                }}
              >
                {step.label}
              </div>
              {step.date && (
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}
                >
                  {step.date}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
