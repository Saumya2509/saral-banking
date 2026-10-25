// biometric/BiometricEnrollModal.jsx
import React, { useState } from 'react';
import { enableFingerprint } from './biometric.js';

export default function BiometricEnrollModal({ isOpen, profile, onClose, onEnrolled, lang = 'en' }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !profile) return null;

  const labels = {
    title: {
      en: 'Turn on Fingerprint Unlock?',
      hi: 'क्या फ़िंगरप्रिंट अनलॉक चालू करें?',
      ta: 'கைரேகை மூலம் திறப்பதை இயக்கவா?',
    },
    desc: {
      en: 'Next time you sign in, simply touch your fingerprint sensor for instant 1-tap access.',
      hi: 'अगली बार लॉगिन करते समय, तुरंत 1-टैप एक्सेस के लिए बस अपने फ़िंगरप्रिंट सेंसर को स्पर्श करें।',
      ta: 'அடுத்த முறை நீங்கள் உள்நுழையும்போது, உடனடியாக 1-தொடுதலில் திறக்க உங்கள் கைரேகை சென்சாரைத் தொடுங்கள்.',
    },
    yes: {
      en: 'Yes, Turn On',
      hi: 'हाँ, चालू करें',
      ta: 'ஆம், இயக்கு',
    },
    notNow: {
      en: 'Not Now',
      hi: 'अभी नहीं',
      ta: 'இப்போது வேண்டாம்',
    },
    enrolling: {
      en: 'Enrolling sensor...',
      hi: 'सेंसर चालू हो रहा है...',
      ta: 'இயக்கப்படுகிறது...',
    },
    failed: {
      en: 'Could not enable fingerprint. You can try again later from Settings.',
      hi: 'फ़िंगरप्रिंट चालू नहीं हो सका। आप बाद में सेटिंग्स से फिर से प्रयास कर सकते हैं।',
      ta: 'கைரேகையை இயக்க முடியவில்லை. நீங்கள் அமைப்புகளிலிருந்து மீண்டும் முயற்சி செய்யலாம்.',
    },
  };

  const t = (key) => labels[key]?.[lang] || labels[key]?.en || '';

  const handleEnroll = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await enableFingerprint(profile);
      if (onEnrolled) onEnrolled();
      onClose();
    } catch (err) {
      if (err.code !== 'cancelled') {
        setErrorMsg(t('failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        {/* Fingerprint Icon Container */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dbeafe',
            color: 'var(--brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 11c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3z" />
            <path d="M12 7c-3.87 0-7 3.13-7 7v2c0 2.22.9 4.23 2.35 5.68" />
            <path d="M19 16v-2c0-3.87-3.13-7-7-7" />
            <path d="M12 3C6.48 3 2 7.48 2 13v3" />
            <path d="M22 16v-3c0-5.52-4.48-10-10-10" />
          </svg>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {t('title')}
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
          {t('desc')}
        </p>

        {errorMsg && (
          <div style={{ color: 'var(--danger)', fontSize: '0.8125rem', marginBottom: '16px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={handleEnroll}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              backgroundColor: 'var(--brand)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
            className="interactive-tap"
          >
            {loading ? t('enrolling') : t('yes')}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '14px',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            {t('notNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
