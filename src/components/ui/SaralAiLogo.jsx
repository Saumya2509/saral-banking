import React from 'react';
import { AssistantChatIcon } from '../icons/Icons';

/**
 * Institutional AI Banking Assistant Mark
 * Clean, professional, stroke-based fintech iconography.
 */
export default function SaralAiLogo({ size = 24, className = '', style = {} }) {
  const iconSize = typeof size === 'number' ? Math.round(size * 0.65) : 18;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: 'var(--brand)',
        color: 'var(--brand-contrast, #ffffff)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
      aria-label="Saral Banking AI Assistant"
    >
      <AssistantChatIcon size={iconSize} />
    </div>
  );
}
