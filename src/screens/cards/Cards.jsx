import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Sheet from '../../components/ui/Sheet';
import Field from '../../components/ui/Field';
import BigButton from '../../components/ui/BigButton';
import Toggle from '../../components/ui/Toggle';
import {
  CreditCardIcon,
  ShieldIcon,
  CheckIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  CopyIcon,
} from '../../components/icons/Icons';
import { getCustomer } from '../../data/customers.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { playSuccessChime } from '../../utils/audio.js';

export default function Cards() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const isYoung = state?.settings?.mode === 'young';
  const customer = getCustomer(customerId) || { name: { en: 'Priya Sharma', hi: 'प्रिया शर्मा' } };
  const customerName = customer.name?.[lang] || customer.name?.en || 'Customer';

  const [isCardBlocked, setIsCardBlocked] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Limits state
  const [atmLimit, setAtmLimit] = useState('25000');
  const [onlineLimit, setOnlineLimit] = useState('50000');
  const [intlEnabled, setIntlEnabled] = useState(false);
  const [contactlessEnabled, setContactlessEnabled] = useState(true);

  // Reveal CVV toggle
  const [revealCvv, setRevealCvv] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const fullCardNumber = '4532 9018 3491 4567';
  const cvv = '842';
  const expiry = '12/28';

  const handleCopyCard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullCardNumber.replace(/\s/g, ''));
      setCopyFeedback(lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!');
      setTimeout(() => setCopyFeedback(''), 1800);
    }
  };

  const handleToggleBlock = () => {
    setIsCardBlocked(!isCardBlocked);
    playSuccessChime();
  };

  return (
    <Screen title={lang === 'hi' ? 'कार्ड प्रबंधन' : 'Cards Management'}>
      {/* Visual Navy Blue Visa Card matching Screen 7 */}
      <div
        style={{
          background: isCardBlocked
            ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #091e42 0%, #0c2d6b 50%, #1e3a8a 100%)',
          borderRadius: '20px',
          padding: '24px 22px',
          color: '#ffffff',
          boxShadow: isCardBlocked
            ? '0 6px 20px rgba(0,0,0,0.18)'
            : '0 12px 28px rgba(12, 45, 107, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '20px',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Holographic metallic background arc overlay */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-60px',
            bottom: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Card Top Row: Bank name & Contactless wave */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: '1.125rem',
                letterSpacing: '1px',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              Saral Bank
            </div>
            <span
              style={{
                fontSize: '0.625rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '6px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              {isYoung ? 'JUNIOR DEBIT' : 'DEBIT PLATINUM'}
            </span>
          </div>

          {/* Contactless Wi-Fi wave icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isCardBlocked && (
              <span
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                BLOCKED
              </span>
            )}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeLinecap="round" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeLinecap="round" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeLinecap="round" />
              <circle cx="12" cy="20" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* EMV Chip graphic */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              width: '44px',
              height: '34px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #fde047 100%)',
              border: '1px solid rgba(0,0,0,0.15)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Chip circuit lines */}
            <div style={{ position: 'absolute', top: '11px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', top: '22px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '21px', width: '1px', backgroundColor: 'rgba(0,0,0,0.3)' }} />
          </div>
        </div>

        {/* Masked Card Number */}
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '3px',
            fontFamily: 'monospace',
            marginBottom: '20px',
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        >
          {revealCvv ? fullCardNumber : '••••  ••••  ••••  4567'}
        </div>

        {/* Cardholder name, Expiry, Visa Logo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              CARD HOLDER
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {customerName}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              EXPIRES
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, letterSpacing: '1px', fontFamily: 'monospace' }}>
              {expiry}
            </div>
          </div>

          {/* VISA Platinum Logo */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '1px', lineHeight: 1 }}>
              VISA
            </div>
            <div style={{ fontSize: '0.5625rem', letterSpacing: '2px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>
              PLATINUM
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Grid of Actions matching Screen 7 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* 1. View Details */}
        <button
          type="button"
          onClick={() => setShowDetailsModal(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          className="interactive-tap hover:border-blue-400"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EyeIcon size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {lang === 'hi' ? 'विवरण देखें' : 'View Details'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              CVV & Full Number
            </div>
          </div>
        </button>

        {/* 2. Block Card */}
        <button
          type="button"
          onClick={handleToggleBlock}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: isCardBlocked ? '#fee2e2' : 'var(--surface)',
            border: isCardBlocked ? '1.5px solid #ef4444' : '1.5px solid var(--border)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          className="interactive-tap hover:border-red-400"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isCardBlocked ? '#ef4444' : '#fee2e2',
              color: isCardBlocked ? '#ffffff' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: isCardBlocked ? '#dc2626' : 'var(--text-primary)' }}>
              {isCardBlocked
                ? (lang === 'hi' ? 'कार्ड अनब्लॉक करें' : 'Unblock Card')
                : (lang === 'hi' ? 'कार्ड ब्लॉक करें' : 'Block Card')}
            </div>
            <div style={{ fontSize: '0.75rem', color: isCardBlocked ? '#991b1b' : 'var(--text-muted)' }}>
              {isCardBlocked ? 'Card is Inactive' : 'Instant Security'}
            </div>
          </div>
        </button>

        {/* 3. Set Limits - Not for young saver Aarav */}
        {!isYoung && (
          <button
            type="button"
            onClick={() => setShowLimitsModal(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface)',
              border: '1.5px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            className="interactive-tap hover:border-purple-400"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldIcon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                {lang === 'hi' ? 'सीमाएं सेट करें' : 'Set Limits'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ATM & Online Spends
              </div>
            </div>
          </button>
        )}

        {/* 4. Manage Card */}
        <button
          type="button"
          onClick={() => setShowManageModal(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          className="interactive-tap hover:border-emerald-400"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CreditCardIcon size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {lang === 'hi' ? 'कार्ड प्रबंधन' : 'Manage Card'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              PIN & Replacement
            </div>
          </div>
        </button>
      </div>

      {/* Promotional Banner: Hide for Young Saver per diff.md */}
      {!isYoung ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1.5px solid #bfdbfe',
            borderRadius: '18px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.1rem' }}>✨</span>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#1e3a8a' }}>
                {lang === 'hi' ? 'नया कार्ड प्राप्त करें' : 'Get a New Card'}
              </div>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#1e40af', lineHeight: '1.3' }}>
              {lang === 'hi'
                ? 'सरल प्लेटिनम क्रेडिट कार्ड पर सभी खर्चों पर 5% कैशबैक पाएं।'
                : 'Apply for Saral Platinum Credit Card with 5% flat cashback on all shopping.'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowApplyModal(true)}
            style={{
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            className="interactive-tap hover:bg-blue-700"
          >
            {lang === 'hi' ? 'आवेदन करें' : 'Apply Now'}
          </button>
        </div>
      ) : (
        <div
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '18px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🌱</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#065f46' }}>
              {lang === 'hi' ? 'सुरक्षित युवा बचतकर्ता खाता' : 'Protected Young Saver Card'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>
              {lang === 'hi'
                ? 'दैनिक सीमा ₹5,000 सक्रिय है। कार्ड सुरक्षा आपकी माँ प्रिया शर्मा द्वारा प्रबंधित है।'
                : 'Daily spending limit is ₹5,000. Card security is monitored by your mother Priya Sharma.'}
            </div>
          </div>
        </div>
      )}

      {/* Sheet 1: Card Details Sheet */}
      <Sheet
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={lang === 'hi' ? 'कार्ड विवरण' : 'Card Confidential Details'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Full Card Number:
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'monospace',
              }}
            >
              <span>{fullCardNumber}</span>
              <button
                type="button"
                onClick={handleCopyCard}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                {copyFeedback || 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Expiry Date:
              </label>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  fontWeight: 700,
                }}
              >
                {expiry}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                CVV Code:
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  fontWeight: 700,
                }}
              >
                <span>{revealCvv ? cvv : '•••'}</span>
                <button
                  type="button"
                  onClick={() => setRevealCvv(!revealCvv)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {revealCvv ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0' }}>
            🔒 Never share your card PIN or CVV with anyone. Saral Bank executives will never call to request these details.
          </p>

          <BigButton variant="primary" onClick={() => setShowDetailsModal(false)}>
            Close Details
          </BigButton>
        </div>
      </Sheet>

      {/* Sheet 2: Limits Sheet */}
      <Sheet
        isOpen={showLimitsModal}
        onClose={() => setShowLimitsModal(false)}
        title={lang === 'hi' ? 'खर्च सीमाएं' : 'Set Transaction Limits'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field
            label="Daily ATM Cash Withdrawal Limit (₹)"
            type="number"
            value={atmLimit}
            onChange={(e) => setAtmLimit(e.target.value)}
          />

          <Field
            label="Daily Online / E-Commerce Limit (₹)"
            type="number"
            value={onlineLimit}
            onChange={(e) => setOnlineLimit(e.target.value)}
          />

          <Toggle
            label="Enable Contactless Tap & Pay"
            checked={contactlessEnabled}
            onChange={setContactlessEnabled}
          />

          <Toggle
            label="Enable International Transactions"
            checked={intlEnabled}
            onChange={setIntlEnabled}
          />

          <BigButton
            variant="primary"
            onClick={() => {
              playSuccessChime();
              setShowLimitsModal(false);
            }}
          >
            Save Card Limits
          </BigButton>
        </div>
      </Sheet>

      {/* Sheet 3: Manage Card Sheet */}
      <Sheet
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        title="Card Security & Management"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              alert('ATM PIN reset link sent to registered mobile number!');
              setShowManageModal(false);
            }}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            🔑 Change ATM PIN
          </button>

          <button
            type="button"
            onClick={() => {
              alert('New physical card ordered. Tracking details sent to SMS!');
              setShowManageModal(false);
            }}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            📦 Request Card Replacement
          </button>
        </div>
      </Sheet>

      {/* Sheet 4: Apply for New Card */}
      <Sheet
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for Saral Platinum Card"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '2.5rem' }}>💳</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Instant Pre-Approved Offer!</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Congratulations {customerName}! You are eligible for the Saral Platinum Credit Card with a limit of ₹1,50,000. Zero annual fees for life.
          </p>
          <BigButton
            variant="primary"
            onClick={() => {
              playSuccessChime();
              alert('Credit Card approved! Digital card ready in 5 minutes.');
              setShowApplyModal(false);
            }}
          >
            Accept Pre-Approved Card
          </BigButton>
        </div>
      </Sheet>
    </Screen>
  );
}
