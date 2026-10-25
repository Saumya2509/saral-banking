import React from 'react';
import { formatDate, getToday, getDaysAgo, isSameDay } from '../../utils/dates.js';

/**
 * DayGroupHeader component
 * Clean sticky day header with relative label (Today/Yesterday) and count badge
 */
export default function DayGroupHeader({
  date,
  lang = 'en',
  count = 0,
  className = '',
  style = {},
}) {
  const formattedDate = formatDate(date, lang);
  const today = getToday();
  const yesterday = getDaysAgo(1);

  let relativePrefix = '';
  if (isSameDay(date, today)) {
    relativePrefix = lang === 'hi' ? 'आज · ' : 'Today · ';
  } else if (isSameDay(date, yesterday)) {
    relativePrefix = lang === 'hi' ? 'कल · ' : 'Yesterday · ';
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-alt)',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        borderBottom: '1px solid var(--border)',
        ...style,
      }}
      className={`day-group-header ${className}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: relativePrefix ? 'var(--brand)' : 'inherit', fontWeight: relativePrefix ? 700 : 600 }}>
          {relativePrefix}
        </span>
        <span>{formattedDate}</span>
      </div>

      {count > 0 && (
        <span
          style={{
            fontSize: '0.6875rem',
            padding: '2px 8px',
            borderRadius: '10px',
            backgroundColor: 'var(--border)',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          {count} {lang === 'hi' ? 'लेन-देन' : (count === 1 ? 'transaction' : 'transactions')}
        </span>
      )}
    </div>
  );
}
