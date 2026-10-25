import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, SettingsIcon, MicIcon, QrCodeIcon, SaralMarkIcon, ShieldIcon } from '../icons/Icons';
import VoiceControl from '../voice/VoiceControl';
import QrScanner from '../ui/QrScanner';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import banks from '../../data/banks.js';
import { getCustomer } from '../../data/customers.js';

export default function Header({
  title = null,
  showBack = true,
  onBack = null,
  className = '',
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isPayFlow = location.pathname.startsWith('/pay');
  const isPinScreen = location.pathname.includes('/pin');
  const isReceiptScreen = location.pathname.includes('/receipt');
  const bank = banks[state.settings.bankId] || banks.saral;

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const customerName = customer?.name?.[lang] || customer?.name?.en || 'User';
  const initial = (customerName || 'U').charAt(0).toUpperCase();

  const handleQrScanSuccess = (scannedPayee) => {
    navigate('/pay/amount', {
      state: {
        payee: scannedPayee,
        amountPaise: scannedPayee.amountPaise,
      },
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <header
        style={{
          height: 'var(--size-header, 56px)',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
        className={`header no-print ${className}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '70px' }}>
          {!isHome && showBack ? (
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 0',
              }}
              aria-label="Back"
              className="interactive-tap"
            >
              <ArrowLeft size={20} />
              <span>{t('core.btn.back') || 'Back'}</span>
            </button>
          ) : isHome ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/salar.svg"
                alt="Saral Bank Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(18, 59, 103, 0.25)',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--brand)', letterSpacing: '-0.02em' }}>
                {bank.name[lang] || bank.name.en}
              </span>
            </div>
          ) : null}
        </div>

        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            textAlign: 'center',
            flex: 1,
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 8px',
          }}
        >
          {title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', minWidth: '70px' }}>
          {isPayFlow ? (
            /* Clean Security Badge for Payment Funnel */
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#065f46',
                letterSpacing: '0.02em',
              }}
            >
              <ShieldIcon size={12} />
              <span>UPI 2.0</span>
            </div>
          ) : (
            <>
              {/* Quick QR Scanner Button */}
              {!isPinScreen && !isReceiptScreen && (
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand)',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                  aria-label={lang === 'hi' ? 'QR कोड स्कैन करें' : lang === 'ta' ? 'QR குறியீட்டை ஸ்கேன் செய்' : 'Scan QR code'}
                  title={lang === 'hi' ? 'QR कोड स्कैन करें' : lang === 'ta' ? 'QR குறியீட்டை ஸ்கேன் செய்' : 'Scan QR code'}
                  className="interactive-tap hover:bg-slate-100"
                >
                  <QrCodeIcon size={22} />
                </button>
              )}

              {/* Accessible Voice Assistant Button */}
              {!isPinScreen && !isReceiptScreen && (
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand)',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                  aria-label="Voice banking assistant"
                  title="Speak a banking command"
                  className="interactive-tap hover:bg-slate-100"
                >
                  <MicIcon size={22} />
                </button>
              )}

              {/* Profile Avatar Button */}
              <button
                type="button"
                onClick={() => navigate('/profile')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
                aria-label={lang === 'hi' ? 'उपभोक्ता प्रोफ़ाइल' : lang === 'ta' ? 'பயனர் சுயவிவரம்' : 'User Profile'}
                title={customerName}
                className="interactive-tap hover:bg-slate-100"
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {initial}
                </div>
              </button>

              {/* Settings Button */}
              <button
                type="button"
                onClick={() => navigate('/settings')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
                aria-label={t('core.settings.title') || 'Settings'}
                className="interactive-tap hover:bg-slate-100"
              >
                <SettingsIcon size={22} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Global Voice Assistant Dialog */}
      <VoiceControl isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Global QR Code Scanner */}
      <QrScanner
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />
    </>
  );
}
