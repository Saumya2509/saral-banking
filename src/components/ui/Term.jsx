import React, { useState } from 'react';
import Sheet from './Sheet';
import { findTerm } from '../../data/glossary.js';
import { useI18n } from '../../i18n/index.js';

/**
 * Term component
 * Renders banking terms with a dotted underline.
 * Tapping opens a bottom Sheet with the plain meaning.
 */
export default function Term({ id, children, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useI18n();

  const termData = findTerm(id);
  const termTitle = termData?.term?.[lang] || termData?.term?.en || children;
  const meaning = termData?.meaning?.[lang] || termData?.meaning?.en || 'Plain banking term definition.';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`glossary-term ${className}`}
        style={{
          background: 'none',
          border: 'none',
          borderBottom: '1.5px dotted var(--info, #2563eb)',
          color: 'inherit',
          padding: 0,
          font: 'inherit',
          cursor: 'pointer',
          display: 'inline',
        }}
      >
        {children}
      </button>

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={termTitle}
      >
        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            padding: '8px 0',
          }}
        >
          {meaning}
        </p>
      </Sheet>
    </>
  );
}
