import React from 'react';
import { formatINR, amountToSpeech } from '../../utils/money.js';
import { useI18n } from '../../i18n/index.js';

/**
 * Amount component
 * Formats paise with Intl.NumberFormat('en-IN')
 * Direction indicator: 'in' = green + down arrow, 'out' = dark + up arrow
 * Spoken description for screen readers via aria-label
 */
export default function Amount({
  paise = 0,
  direction = null,
  showSign = false,
  size = 'normal',
  className = '',
  style = {},
}) {
  const { lang, t } = useI18n();

  const formatted = formatINR(paise, { showPaise: true });
  const spoken = amountToSpeech(paise, lang);

  let directionText = '';
  if (direction === 'in') {
    directionText = lang === 'hi' ? 'प्राप्त: ' : 'Money in: ';
  } else if (direction === 'out') {
    directionText = lang === 'hi' ? 'भुगतान: ' : 'Money out: ';
  }

  const ariaLabel = `${directionText}${spoken}`;

  let fontSize = '1rem';
  let fontWeight = 600;

  if (size === 'display') {
    fontSize = 'var(--font-size-display, 2rem)';
    fontWeight = 700;
  } else if (size === 'large') {
    fontSize = 'var(--font-size-title, 1.5rem)';
    fontWeight = 700;
  }

  const isGreen = direction === 'in';
  const color = isGreen ? 'var(--success)' : 'var(--text-primary)';

  return (
    <span
      aria-label={ariaLabel}
      style={{
        fontSize,
        fontWeight,
        color,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        ...style,
      }}
      className={className}
    >
      {direction === 'in' && <span aria-hidden="true">↓ </span>}
      {direction === 'out' && <span aria-hidden="true">↑ </span>}
      {showSign && !direction && paise > 0 ? '+ ' : ''}
      <span>{formatted}</span>
    </span>
  );
}
