import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Amount from '../../components/ui/Amount';
import BigButton from '../../components/ui/BigButton';
import PaymentScreenshotModal from '../../components/ui/PaymentScreenshotModal';
import {
  CheckIcon,
  ShareIcon,
  CopyIcon,
  CameraIcon,
  HomeIcon,
  ShieldIcon,
} from '../../components/icons/Icons';
import { formatDate, formatTime } from '../../utils/dates.js';
import { getCustomer, maskAccountNumber } from '../../data/customers.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';

export default function PayReceipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const [copied, setCopied] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const receipt = location.state?.receipt || {
    id: 'tx_demo',
    reference: '412345678901',
    payee: { name: 'Recipient' },
    amountPaise: 50000,
    date: new Date().toISOString(),
  };

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const payeeName = receipt.payee?.name || 'Recipient';
  const formattedDate = `${formatDate(receipt.date, lang)} at ${formatTime(receipt.date)}`;

  const handleShare = () => {
    const shareText =
      lang === 'hi'
        ? `सरल बैंकिंग — भुगतान सफल\n${payeeName} को ${formatINR(receipt.amountPaise)} भेजे गए\nसंदर्भ: ${receipt.reference}\n${formattedDate}`
        : `Saral Banking — Payment Successful\n${formatINR(receipt.amountPaise)} sent to ${payeeName}\nRef: ${receipt.reference}\n${formattedDate}`;

    if (navigator.share) {
      navigator
        .share({
          title: lang === 'hi' ? 'भुगतान रसीद' : 'Payment Receipt',
          text: shareText,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyRef = () => {
    if (receipt.reference && navigator.clipboard) {
      navigator.clipboard.writeText(receipt.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Screen title={lang === 'hi' ? 'भुगतान सफल' : 'Payment Successful'} showBack={false} hideTabBar>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto',
          padding: '4px 8px 12px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* ONE UNIFIED RECEIPT FRAME */}
        <div
          className="receipt-frame animate-fade-in"
          style={{
            width: '100%',
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            border: '1.5px solid var(--border)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)',
            padding: '14px 14px 14px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Decorative Bank Accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #059669 100%)',
            }}
          />

          {/* 1. Success Animation Badge */}
          <div
            className="receipt-success-badge animate-spring-pop"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              border: '3px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              boxShadow: '0 0 18px rgba(5, 150, 105, 0.22)',
              marginBottom: '6px',
            }}
          >
            <CheckIcon size={28} />
          </div>

          <div className="receipt-status-pill">
            <span className="receipt-status-dot" />
            <span>{lang === 'hi' ? 'सुरक्षित रूप से पूरा हुआ' : 'Securely completed'}</span>
          </div>

          {/* 2. Headline & Big Amount */}
          <h2
            style={{
              fontSize: '1.0625rem',
              fontWeight: 800,
              color: '#065f46',
              margin: '0 0 2px 0',
            }}
            className="animate-slide-up"
          >
            {lang === 'hi' ? 'भुगतान सफल!' : 'Payment Sent!'}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#0f172a',
              margin: '2px 0 2px 0',
            }}
            className="receipt-amount"
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)' }}>↑</span>
            <span style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {formatINR(receipt.amountPaise)}
            </span>
          </div>

          <div className="receipt-payee" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 700 }}>
            {lang === 'hi' ? `${payeeName} को भेजे गए` : `Sent to ${payeeName}`}
          </div>

          <div className="receipt-date" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {formattedDate}
          </div>

          {/* 3. Perforated Receipt Notch Divider */}
          <div
            style={{
              width: 'calc(100% + 28px)',
              margin: '10px -14px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Left Notch */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-alt)',
                borderRight: '1.5px solid var(--border)',
                marginLeft: '-9px',
                zIndex: 2,
              }}
            />
            {/* Dashed line */}
            <div
              style={{
                flex: 1,
                borderTop: '1.5px dashed var(--border)',
                height: '0',
              }}
            />
            {/* Right Notch */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-alt)',
                borderLeft: '1.5px solid var(--border)',
                marginRight: '-9px',
                zIndex: 2,
              }}
            />
          </div>

          {/* 4. Details Rows inside Same Frame */}
          <div className="receipt-details" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            {[
              { label: lang === 'hi' ? 'प्राप्तकर्ता' : 'Paid to', value: payeeName },
              { label: lang === 'hi' ? 'राशि' : 'Amount', value: formatINR(receipt.amountPaise) },
              { label: lang === 'hi' ? 'तारीख और समय' : 'Date & Time', value: formattedDate },
              {
                label: lang === 'hi' ? 'खाते से' : 'From account',
                value: maskAccountNumber(customer?.accountNumber || '2048 1023 4821'),
              },
              ...(receipt.note ? [{ label: lang === 'hi' ? 'नोट' : 'Note', value: receipt.note }] : []),
            ].map((item, i, arr) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 0',
                  borderBottom: '1px solid var(--border-soft, #f1f5f9)',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.label}</span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textAlign: 'right',
                    maxWidth: '60%',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}

            {/* Reference row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 0',
              }}
              className="receipt-reference"
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {lang === 'hi' ? 'संदर्भ संख्या (Ref)' : 'Ref. No.'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    color: 'var(--text-primary)',
                  }}
                >
                  {receipt.reference?.slice(-6).padStart(receipt.reference?.length || 6, '·')}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: copied ? 'var(--success)' : 'var(--brand)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                  className="interactive-tap"
                  title="Copy Reference ID"
                  aria-label={copied ? 'Reference copied' : 'Copy reference ID'}
                >
                  {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                  <span>{copied ? (lang === 'hi' ? 'कॉपी!' : 'Copied!') : (lang === 'hi' ? 'कॉपी' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Integrated Action Buttons inside Frame */}
          <div className="receipt-actions" style={{ width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Primary Action: Send Screenshot to Merchant */}
            <BigButton
              variant="primary"
              icon={<CameraIcon size={19} />}
              onClick={() => setShowScreenshot(true)}
            >
              {lang === 'hi' ? 'दुकानदार को स्क्रीनशॉट भेजें' : 'Share Screenshot'}
            </BigButton>

            {/* 2 Secondary Buttons with Perfect Horizontal Alignment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <BigButton
                variant="secondary"
                icon={<ShareIcon size={16} />}
                onClick={handleShare}
              >
                {lang === 'hi' ? 'शेयर करें' : 'Share Text'}
              </BigButton>
              <BigButton
                variant="secondary"
                icon={<HomeIcon size={16} />}
                onClick={() => navigate('/')}
              >
                {lang === 'hi' ? 'होम पर जाएं' : 'Back to Home'}
              </BigButton>
            </div>

            <div className="receipt-action-hint" aria-live="polite">
              {copied
                ? (lang === 'hi' ? 'संदर्भ संख्या कॉपी हो गई' : 'Reference number copied')
                : (lang === 'hi' ? 'रसीद सुरक्षित रखें या तुरंत साझा करें' : 'Save your receipt or share it instantly')}
            </div>

            {/* Security Guarantee Note */}
            <div
              style={{
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldIcon size={12} className="text-emerald-600" />
              <span>{lang === 'hi' ? 'सत्यापित भारत UPI रसीद' : 'Verified Bharat UPI Receipt'}</span>
            </div>
          </div>
        </div>

        {/* Payment Screenshot Modal */}
        <PaymentScreenshotModal
          isOpen={showScreenshot}
          onClose={() => setShowScreenshot(false)}
          receiptData={{
            amountPaise: receipt.amountPaise,
            payee: receipt.payee,
            date: receipt.date,
            reference: receipt.reference,
            fromAccount: maskAccountNumber(customer?.accountNumber || '2048 1023 4821'),
            fromName: customer?.name?.[lang] || customer?.name?.en || 'Shankar Prasad',
            note: receipt.note,
          }}
        />
      </div>
    </Screen>
  );
}
