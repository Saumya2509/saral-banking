import React from 'react';
import Term from './Term';
import { findTermsByText } from '../../data/glossary.js';
import { useI18n } from '../../i18n/index.js';

/**
 * Rich component
 * Scans string for known glossary terms and replaces them with interactive Term components
 */
export default function Rich({ text, className = '', style = {} }) {
  const { lang } = useI18n();

  if (!text || typeof text !== 'string') {
    return <span className={className} style={style}>{text}</span>;
  }

  const matchingTerms = findTermsByText(text, lang);
  if (!matchingTerms || matchingTerms.length === 0) {
    return <span className={className} style={style}>{text}</span>;
  }

  // Sort matched patterns by descending length to avoid partial replacements
  const patterns = [];
  for (const term of matchingTerms) {
    const list = term.match?.[lang] || term.match?.en || [];
    for (const p of list) {
      if (p) {
        patterns.push({ pattern: p, id: term.id });
      }
    }
  }
  patterns.sort((a, b) => b.pattern.length - a.pattern.length);

  // Build regex
  const escaped = patterns.map((p) => p.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, lang === 'hi' ? 'g' : 'gi');

  const parts = text.split(regex);

  return (
    <span className={className} style={style}>
      {parts.map((part, index) => {
        if (!part) return null;
        const matched = patterns.find(
          (p) => p.pattern.toLowerCase() === part.toLowerCase()
        );
        if (matched) {
          return (
            <Term key={index} id={matched.id}>
              {part}
            </Term>
          );
        }
        return part;
      })}
    </span>
  );
}
