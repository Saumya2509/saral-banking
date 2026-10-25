import React, { useState, useEffect } from 'react';
import { Volume2Icon } from '../icons/Icons';
import { speak, stopSpeaking, isSpeaking as checkIsSpeaking } from '../../utils/speech.js';
import { useI18n } from '../../i18n/index.js';

/**
 * Hook for reading aloud text in English or Hindi
 */
export function useReadAloud() {
  const { lang } = useI18n();
  const [reading, setReading] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const readAloud = (text) => {
    if (!text) return;
    setReading(true);
    speak(text, lang);
    const interval = setInterval(() => {
      if (!checkIsSpeaking()) {
        setReading(false);
        clearInterval(interval);
      }
    }, 300);
  };

  const stop = () => {
    stopSpeaking();
    setReading(false);
  };

  return {
    readAloud,
    stopReading: stop,
    isReading: reading,
  };
}

/**
 * ReadAloud button component
 */
export default function ReadAloud({ text, label = null, className = '', style = {} }) {
  const { lang } = useI18n();
  const { readAloud, stopReading, isReading } = useReadAloud();

  const handleToggle = () => {
    if (isReading) {
      stopReading();
    } else {
      readAloud(text);
    }
  };

  const defaultLabel =
    lang === 'ta'
      ? 'உரக்கப் படிக்கவும்'
      : lang === 'hi'
      ? 'बोलकर सुनाएं'
      : 'Read aloud';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label || defaultLabel}
      title={label || defaultLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        backgroundColor: isReading ? 'var(--brand-soft)' : 'var(--surface-alt)',
        color: isReading ? 'var(--brand)' : 'var(--text-primary)',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        ...style,
      }}
      className={className}
    >
      <Volume2Icon size={18} />
      {label && <span>{label}</span>}
    </button>
  );
}
