import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SaralLogo from '../../components/ui/SaralLogo';
import {
  CheckIcon,
  ShieldIcon,
  SparklesIcon,
} from '../../components/icons/Icons';
import { getAllCustomers } from '../../data/customers.js';
import config from '../../data/config.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { playSuccessChime, playErrorTone, playTapTone } from '../../utils/audio.js';
import { checkPin } from '../../auth.js';
import { speak } from '../../utils/speech.js';
import {
  fingerprintSupported,
  hasFingerprint,
  unlockWithFingerprint,
  BiometricEnrollModal,
} from '../../biometric/index.js';

export default function SignIn() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const allCustomers = getAllCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    state.session.customerId || 'priya'
  );
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [biometricState, setBiometricState] = useState('idle'); // 'idle' | 'scanning' | 'verified' | 'failed'
  const [isSupported, setIsSupported] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);
  const [bioRev, setBioRev] = useState(0); // revision trigger to force re-evaluation of hasFingerprint

  const selectedCustomer = allCustomers.find((c) => c.id === selectedCustomerId) || allCustomers[0];
  const isEnrolled = hasFingerprint(selectedCustomerId);

  useEffect(() => {
    fingerprintSupported().then(setIsSupported);
  }, [bioRev]);

  // Auto-countdown timer for 30s lock after 3 failed attempts
  useEffect(() => {
    let timer;
    if (lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setWrongAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockCountdown]);

  // Support physical keyboard typing for PIN
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lockCountdown > 0) return;
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinValue, lockCountdown]);

  const processSignIn = (cust) => {
    playSuccessChime();
    try { sessionStorage.setItem('saral_active_customer', cust.id); } catch {}
    dispatch({ type: 'SET_CUSTOMER', payload: cust.id });
    if (cust.defaultMode) {
      dispatch({ type: 'SET_MODE', payload: cust.defaultMode });
    }
    dispatch({ type: 'UNLOCK' });

    // Mode-specific route redirection
    if (cust.defaultMode === 'young' && !state.young?.consent?.given) {
      navigate('/setup/consent');
    } else {
      navigate('/');
    }
  };

  const handleDigit = (digit) => {
    if (lockCountdown > 0 || pinValue.length >= 4) return;
    playTapTone();
    const nextPin = pinValue + digit;
    setPinValue(nextPin);
    if (error) setError('');

    if (nextPin.length === 4) {
      verifyPinSubmission(nextPin);
    }
  };

  const handleBackspace = () => {
    if (lockCountdown > 0 || pinValue.length === 0) return;
    playTapTone();
    setPinValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (lockCountdown > 0) return;
    playTapTone();
    setPinValue('');
  };

  const verifyPinSubmission = async (enteredPin) => {
    let isValid = false;
    try {
      isValid = await checkPin(enteredPin);
    } catch (e) {
      console.warn('PIN check fallback:', e);
    }
    if (isValid || enteredPin === config.demoPin || enteredPin === '1234') {
      setError('');
      setWrongAttempts(0);

      // Offer biometric enrollment once after successful PIN login if not already enrolled
      let dismissed = false;
      try {
        dismissed = sessionStorage.getItem(`bioDismissed:${selectedCustomer.id}`) === '1';
      } catch {}

      if (!hasFingerprint(selectedCustomer.id) && !dismissed) {
        setPendingCustomer(selectedCustomer);
        setShowEnrollModal(true);
      } else {
        processSignIn(selectedCustomer);
      }
    } else {
      playErrorTone();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPinValue('');

      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);

      if (nextWrong >= 3) {
        setLockCountdown(30);
        setError(
          lang === 'hi'
            ? '3 गलत प्रयास। कृपया 30 सेकंड प्रतीक्षा करें।'
            : lang === 'ta'
            ? '3 தவறான முயற்சிகள். 30 வினாடிகள் காத்திருக்கவும்.'
            : '3 wrong attempts. Locked for 30s.'
        );
      } else {
        setError(
          lang === 'hi'
            ? 'गलत PIN। कृपया 1234 दर्ज करें।'
            : lang === 'ta'
            ? 'தவறான PIN. மாதிரிக்கு 1234 உள்ளிடவும்.'
            : 'Incorrect PIN. Try 1234 for demo.'
        );
      }
    }
  };

  // Professional biometric fingerprint handler
  const handleFingerprintScan = async () => {
    if (lockCountdown > 0 || biometricState !== 'idle') return;

    if (!isSupported) {
      setError(
        lang === 'hi'
          ? 'इस डिवाइस पर फ़िंगरप्रिंट उपलब्ध नहीं है।'
          : lang === 'ta'
          ? 'இந்தச் சாதனத்தில் கைரேகை கிடைக்கவில்லை.'
          : 'Fingerprint is not available on this device.'
      );
      return;
    }

    if (!isEnrolled) {
      setError(
        lang === 'hi'
          ? 'चालू करने के लिए एक बार पिन से लॉगिन करें।'
          : lang === 'ta'
          ? 'முதலில் ரகசிய எண் (PIN) மூலம் உள்நுழைந்து இயக்குங்கள்.'
          : 'Log in with PIN once to turn on fingerprint.'
      );
      return;
    }

    playTapTone();
    setBiometricState('scanning');

    try {
      await unlockWithFingerprint(selectedCustomer);
      setBiometricState('verified');
      playSuccessChime();

      setTimeout(() => {
        processSignIn(selectedCustomer);
      }, 600);
    } catch (err) {
      playErrorTone();
      setBiometricState('idle');
      if (err.code !== 'cancelled') {
        setError(
          lang === 'hi'
            ? 'फ़िंगरप्रिंट काम नहीं किया। अपना पिन उपयोग करें।'
            : lang === 'ta'
            ? 'கைரேகை வேலை செய்யவில்லை. உங்கள் ரகசிய எண்ணை (PIN) பயன்படுத்துங்கள்.'
            : 'Fingerprint did not work. Use your PIN.'
        );
      }
    }
  };

  const handleSelectCustomer = (cust) => {
    setSelectedCustomerId(cust.id);
    setPinValue('');
    setError('');
    setBiometricState('idle');
    setPendingCustomer(null);
    playTapTone();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 16px 32px 16px',
        maxWidth: '460px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
      className="animate-fade-in"
    >
      {/* 1. Sleek Top Bar with Language Selector & Subtle Intro Link */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/splash')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--brand)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px',
          }}
          className="interactive-tap"
          title="Replay intro animation"
        >
          <span>←</span>
          <span>{lang === 'hi' ? 'एनिमेशन देखें' : lang === 'ta' ? 'அறிமுகம்' : 'Intro'}</span>
        </button>

        {/* Language switch */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: '#e2e8f0',
            padding: '3px',
            borderRadius: '10px',
          }}
        >
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_LANG', payload: 'en' })}
            style={{
              padding: '3px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: lang === 'en' ? '#ffffff' : 'transparent',
              color: lang === 'en' ? 'var(--brand)' : '#64748b',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: lang === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_LANG', payload: 'hi' })}
            style={{
              padding: '3px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: lang === 'hi' ? '#ffffff' : 'transparent',
              color: lang === 'hi' ? 'var(--brand)' : '#64748b',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: lang === 'hi' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'SET_LANG', payload: 'ta' });
              speak('தமிழ் தேர்ந்தெடுக்கப்பட்டது', 'ta');
            }}
            style={{
              padding: '3px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: lang === 'ta' ? '#ffffff' : 'transparent',
              color: lang === 'ta' ? 'var(--brand)' : '#64748b',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: lang === 'ta' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* 2. "Who is signing in?" Persona Selector */}
      <div style={{ width: '100%', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {lang === 'hi' ? 'खाता चुनें' : lang === 'ta' ? 'கணக்கைத் தேர்ந்தெடுக்கவும்' : 'Select Customer Account'}
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '8px' }}>
            {lang === 'hi' ? 'डेमो पिन: 1234' : lang === 'ta' ? 'மாதிரி PIN: 1234' : 'Demo PIN: 1234'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allCustomers.map((c) => {
            const isSelected = c.id === selectedCustomerId;
            const name = c.name?.[lang] || c.name?.en || c.id;
            const initial = name.charAt(0);
            const roleBadge =
              c.id === 'aarav'
                ? {
                    label: lang === 'hi' ? 'यंग सेवर (15 वर्ष)' : lang === 'ta' ? 'இளைய சேமிப்பாளர் (15 வயது)' : 'Young Saver (15y)',
                    bg: '#fef3c7',
                    color: '#b45309'
                  }
                : c.id === 'priya'
                ? {
                    label: lang === 'hi' ? 'साधारण (32 वर्ष)' : lang === 'ta' ? 'வழக்கமான முறை (32 வயது)' : 'Standard (32y)',
                    bg: '#dbeafe',
                    color: '#1d4ed8'
                  }
                : {
                    label: lang === 'hi' ? 'सरल मोड (68 वर्ष)' : lang === 'ta' ? 'எளிய முறை (68 வயது)' : 'Simple (68y)',
                    bg: '#dcfce7',
                    color: '#15803d'
                  };

            return (
              <div
                key={c.id}
                onClick={() => handleSelectCustomer(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid var(--brand)' : '1.5px solid var(--border)',
                  backgroundColor: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(29, 78, 216, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                }}
                className="interactive-tap"
              >
                {/* Initial circle */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--brand)' : '#cbd5e1',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    flexShrink: 0,
                    boxShadow: isSelected ? '0 2px 6px rgba(29, 78, 216, 0.25)' : 'none',
                  }}
                >
                  {initial}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'hi' ? 'खाता:' : lang === 'ta' ? 'கணக்கு:' : 'A/C:'} {c.accountNumber ? `•••• ${c.accountNumber.slice(-4)}` : '•••• 4589'}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: roleBadge.bg,
                    color: roleBadge.color,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    marginLeft: '8px',
                    flexShrink: 0,
                  }}
                >
                  {roleBadge.label}
                </span>

                {/* Radio check */}
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: isSelected ? '5px solid var(--brand)' : '2px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    marginLeft: '10px',
                    flexShrink: 0,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 4-Digit PIN Indicator Dots */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
          {lang === 'hi' ? '4 अंकों का PIN दर्ज करें' : lang === 'ta' ? '4 இலக்க ரகசிய எண்ணை உள்ளிடவும்' : 'Enter 4-Digit PIN'}
        </div>

        {/* 4 PIN Dots */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            transform: isShaking ? 'translateX(-6px)' : 'none',
            transition: 'transform 0.08s ease',
          }}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinValue.length > idx;
            return (
              <div
                key={idx}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: error ? '2px solid var(--danger)' : isFilled ? '2px solid var(--brand)' : '2px solid #94a3b8',
                  backgroundColor: error ? 'var(--danger)' : isFilled ? 'var(--brand)' : 'transparent',
                  transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isFilled ? '0 2px 8px rgba(29, 78, 216, 0.35)' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Error / Locked Warning */}
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: '0.8125rem', marginTop: '8px', fontWeight: 700 }}>
            {error} {lockCountdown > 0 ? `(${lockCountdown}s)` : ''}
          </div>
        )}
      </div>

      {/* 4. Professional Biometric Fingerprint Sensor (Instant 1-Tap Unlock) */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          type="button"
          onClick={handleFingerprintScan}
          disabled={lockCountdown > 0 || biometricState !== 'idle' || !isSupported}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 20px',
            borderRadius: '24px',
            backgroundColor: !isSupported
              ? '#f1f5f9'
              : biometricState === 'verified'
              ? '#dcfce7'
              : isEnrolled
              ? '#ffffff'
              : '#f8fafc',
            border: !isSupported
              ? '1.5px solid #cbd5e1'
              : biometricState === 'verified'
              ? '1.5px solid #16a34a'
              : isEnrolled
              ? '1.5px solid #bfdbfe'
              : '1.5px solid #e2e8f0',
            opacity: !isSupported ? 0.65 : 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            cursor: (lockCountdown > 0 || !isSupported) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="interactive-tap hover:border-blue-500"
          title="Authenticate with Fingerprint"
        >
          {/* Fingerprint SVG Icon */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: !isSupported
                ? '#94a3b8'
                : biometricState === 'verified'
                ? '#16a34a'
                : isEnrolled
                ? 'var(--brand)'
                : '#64748b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {biometricState === 'scanning' ? (
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  borderTopColor: 'transparent',
                }}
                className="animate-spin-smooth"
              />
            ) : biometricState === 'verified' ? (
              <CheckIcon size={20} color="#ffffff" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 11c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3z" />
                <path d="M12 7c-3.87 0-7 3.13-7 7v2c0 2.22.9 4.23 2.35 5.68" />
                <path d="M19 16v-2c0-3.87-3.13-7-7-7" />
                <path d="M12 3C6.48 3 2 7.48 2 13v3" />
                <path d="M22 16v-3c0-5.52-4.48-10-10-10" />
              </svg>
            )}
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: biometricState === 'verified' ? '#15803d' : 'var(--text-primary)' }}>
              {biometricState === 'scanning'
                ? (lang === 'hi' ? 'बायोमेट्रिक स्कैन जारी...' : lang === 'ta' ? 'கைரேகை ஸ்கேன் செய்யப்படுகிறது...' : 'Scanning Biometric...')
                : biometricState === 'verified'
                ? (lang === 'hi' ? 'सत्यापित!' : lang === 'ta' ? 'சரிபார்க்கப்பட்டது!' : 'Fingerprint Verified!')
                : (lang === 'hi' ? 'फिंगरप्रिंट से अनलॉक करें' : lang === 'ta' ? 'கைரேகை மூலம் திறக்கவும்' : 'Unlock with Fingerprint')}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {!isSupported
                ? (t('core.bio.notAvailable') || (lang === 'hi' ? 'इस डिवाइस पर उपलब्ध नहीं है' : lang === 'ta' ? 'இந்தச் சாதனத்தில் கிடைக்கவில்லை' : 'Not available on this device'))
                : biometricState === 'verified'
                ? (lang === 'hi' ? 'लॉग इन हो रहा है...' : lang === 'ta' ? 'உள்நுழைகிறது...' : 'Logging in...')
                : isEnrolled
                ? (t('core.bio.ready') || (lang === 'hi' ? '1-टैप त्वरित बायोमेट्रिक्स' : lang === 'ta' ? 'ஒரு தொடுதலில் கைரேகை' : '1-Tap instant biometrics'))
                : (t('core.bio.needPin') || (lang === 'hi' ? 'चालू करने के लिए एक बार पिन से लॉगिन करें' : lang === 'ta' ? 'முதலில் ரகசிய எண் (PIN) மூலம் உள்நுழைந்து இயக்குங்கள்' : 'Log in with PIN once to turn on'))}
            </div>
          </div>
        </button>
      </div>

      {/* 5. Modern Tactile Numeric PinPad */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          maxWidth: '320px',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(String(digit))}
            disabled={lockCountdown > 0}
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              fontWeight: 800,
              cursor: lockCountdown > 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              transition: 'transform 0.1s ease, background-color 0.1s ease',
            }}
            className="interactive-tap hover:bg-slate-50 active:scale-95"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={lockCountdown > 0}
          style={{
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: lockCountdown > 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="interactive-tap"
        >
          {lang === 'hi' ? 'हटाएं' : lang === 'ta' ? 'அழி' : 'Clear'}
        </button>

        {/* 0 Digit */}
        <button
          type="button"
          onClick={() => handleDigit('0')}
          disabled={lockCountdown > 0}
          style={{
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            fontWeight: 800,
            cursor: lockCountdown > 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
          className="interactive-tap hover:bg-slate-50 active:scale-95"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleBackspace}
          disabled={lockCountdown > 0}
          style={{
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.25rem',
            fontWeight: 700,
            cursor: lockCountdown > 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="interactive-tap"
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>

      {/* 6. Biometric Post-PIN Enrollment Modal */}
      <BiometricEnrollModal
        isOpen={showEnrollModal}
        profile={pendingCustomer || selectedCustomer}
        lang={lang}
        onClose={() => {
          const target = pendingCustomer || selectedCustomer;
          try {
            sessionStorage.setItem(`bioDismissed:${target.id}`, '1');
          } catch {}
          setShowEnrollModal(false);
          processSignIn(target);
        }}
        onEnrolled={() => {
          const target = pendingCustomer || selectedCustomer;
          try {
            sessionStorage.removeItem(`bioDismissed:${target.id}`);
          } catch {}
          setShowEnrollModal(false);
          setBioRev((r) => r + 1);
          processSignIn(target);
        }}
      />
    </div>
  );
}

