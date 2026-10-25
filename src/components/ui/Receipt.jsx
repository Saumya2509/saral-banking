import React, { useState } from 'react';
import { CheckIcon, CopyIcon, ShareIcon } from '../icons/Icons';
import ReviewList from './ReviewList';
import BigButton from './BigButton';
import { useT } from '../../i18n/index.js';

/**
 * Receipt component
 * Shows confirmation tick, reference number with Copy/Share, key-value review list, and Done button
 */
export default function Receipt({
  title,
  subtitle = null,
  items = [],
  reference = '',
  onDone,
  className = '',
  style = {},
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (reference && navigator.clipboard) {
      navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Saral Banking Reference: ${reference}`,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        width: '100%',
        ...style,
      }}
      className={className}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <CheckIcon size={36} />
      </div>

      <h2
        style={{
          fontSize: 'var(--font-size-title, 1.5rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '4px',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {subtitle}
        </p>
      )}

      {reference && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '24px',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Ref:</span>
          <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{reference}</span>

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied' : t('core.btn.copy') || 'Copy'}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? 'var(--success)' : 'var(--brand)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          </button>

          <button
            type="button"
            onClick={handleShare}
            title={t('core.btn.share') || 'Share'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--brand)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            <ShareIcon size={16} />
          </button>
        </div>
      )}

      <div style={{ width: '100%' }}>
        <ReviewList items={items} />
      </div>

      {onDone && (
        <div style={{ width: '100%', marginTop: '16px' }}>
          <BigButton variant="primary" onClick={onDone}>
            {t('core.btn.done') || 'Done'}
          </BigButton>
        </div>
      )}
    </div>
  );
}
