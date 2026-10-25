import React, { useEffect } from 'react';
import { XIcon } from '../icons/Icons';

/**
 * Bottom Sheet modal component
 * Slides up from bottom, accessible backdrop and close button
 */
export default function Sheet({ isOpen, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Sheet Content */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '20px 16px 32px 16px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
          zIndex: 1,
        }}
        className={className}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
            }}
          >
            <XIcon size={24} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
