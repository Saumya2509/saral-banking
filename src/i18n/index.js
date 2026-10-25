// Saral Banking — i18n Engine
// Dev 1 owns this file

import React, { createContext, useContext, useMemo } from 'react';
import en from './en.js';
import hi from './hi.js';
import ta from './ta.js';

export const translations = { en, hi, ta };

export const I18nContext = createContext({
  lang: 'en',
  t: (key, params) => (en[key] !== undefined ? interpolate(en[key], params) : (typeof params === 'string' ? params : null)),
});

/**
 * Replace {{param}} tokens in string with params[key]
 */
function interpolate(template, params) {
  if (typeof template !== 'string') return template ?? '';
  if (!params || typeof params !== 'object') return template;

  return template.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (match, key) => {
    return key in params && params[key] !== undefined && params[key] !== null
      ? String(params[key])
      : match;
  });
}

/**
 * Direct translation helper outside React components
 */
export function translate(lang, key, params) {
  const dict = translations[lang] || translations.en;
  const raw = dict?.[key] ?? translations.en?.[key];
  if (raw === undefined || raw === null) {
    return typeof params === 'string' ? params : null;
  }
  return interpolate(raw, params);
}

/**
 * I18nProvider component wrapping the app shell
 */
export function I18nProvider({ lang = 'en', children }) {
  const currentLang = translations[lang] ? lang : 'en';

  const t = useMemo(() => {
    return (key, params) => {
      const dict = translations[currentLang] || translations.en;
      const raw = dict?.[key] ?? translations.en?.[key];
      if (raw === undefined || raw === null) {
        return typeof params === 'string' ? params : null;
      }
      return interpolate(raw, params);
    };
  }, [currentLang]);

  const value = useMemo(
    () => ({
      lang: currentLang,
      t,
    }),
    [currentLang, t]
  );

  return React.createElement(I18nContext.Provider, { value }, children);
}

/**
 * useT hook returning the t(key, params) function
 * Example:
 *   const t = useT();
 *   t('pay.review.titleTo', { name: 'Ramesh' }) -> 'Review payment to Ramesh'
 */
export function useT() {
  const context = useContext(I18nContext);
  if (!context || !context.t) {
    return (key, params) => (en[key] !== undefined ? interpolate(en[key], params) : (typeof params === 'string' ? params : null));
  }
  return context.t;
}

/**
 * useI18n hook returning both current language and t function
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      lang: 'en',
      t: (key, params) => (en[key] !== undefined ? interpolate(en[key], params) : (typeof params === 'string' ? params : null)),
    };
  }
  return context;
}

export { en, hi, ta };
export default I18nContext;
