import React, { useId } from 'react';
import { AlertCircleIcon } from '../icons/Icons';

/**
 * Field component
 * Label above input, 48px height, accessible hint & error
 */
export default function Field({
  label,
  value,
  onChange,
  type = 'text',
  hint = null,
  error = null,
  placeholder = '',
  disabled = false,
  required = false,
  className = '',
  rows = 3,
  ...props
}) {
  const generatedId = useId();
  const id = props.id || generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const isTextarea = type === 'textarea';

  return (
    <div style={{ marginBottom: '16px', width: '100%' }} className={className}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: 'var(--font-size-label, 1rem)',
            fontWeight: 600,
            marginBottom: '6px',
            color: 'var(--text-primary)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      {isTextarea ? (
        <textarea
          id={id}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={Boolean(error)}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            backgroundColor: disabled ? 'var(--surface-alt)' : 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontFamily: 'inherit',
            outline: 'none',
          }}
          className="focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={Boolean(error)}
          style={{
            width: '100%',
            height: 'var(--size-field, 48px)',
            padding: '0 14px',
            borderRadius: '12px',
            border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            backgroundColor: disabled ? 'var(--surface-alt)' : 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontFamily: 'inherit',
            outline: 'none',
          }}
          className="focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          {...props}
        />
      )}

      {error ? (
        <div
          id={errorId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--danger)',
            fontSize: 'var(--font-size-small, 0.875rem)',
            marginTop: '6px',
          }}
          role="alert"
        >
          <AlertCircleIcon size={16} />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <div
          id={hintId}
          style={{
            color: 'var(--text-muted)',
            fontSize: 'var(--font-size-small, 0.875rem)',
            marginTop: '6px',
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}
