import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import StepHeader from '../../components/ui/StepHeader';
import ChoicePrompt from '../../components/ui/ChoicePrompt';
import Notice from '../../components/ui/Notice';
import ReadAloud from '../../components/ui/ReadAloud';
import { formatINR, amountToSpeech } from '../../utils/money.js';
import { getTodaysUpiSpending, getBalances } from '../../utils/ledger.js';
import { speak } from '../../utils/speech.js';
import config from '../../data/config.js';
import { getCustomer } from '../../data/customers.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

export default function PayReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const payee = location.state?.payee || { name: 'Recipient', bank: 'Bank', accountNumber: '••••' };
  const amountPaise = location.state?.amountPaise || 0;
  const note = location.state?.note || '';

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const balances = getBalances(customerId);

  const [safetyCheckPassed, setSafetyCheckPassed] = useState(
    amountPaise <= config.limits.safetyCheckAbovePaise
  );
  const [simpleConfirmPassed, setSimpleConfirmPassed] = useState(
    state.settings.mode !== 'simple' || amountPaise <= config.limits.simpleConfirmAbovePaise
  );

  const isNewPayee = payee.isNew || false;
  const upiDailyLimit = state.records?.upiLimits?.dailyPaise || 10000000;
  const todaySpent = getTodaysUpiSpending(customerId);
  const exceedsDailyLimit = todaySpent + amountPaise > upiDailyLimit;

  const payeeInitial = (payee.name || 'P')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const spokenAmount = amountToSpeech(amountPaise, lang);
  const reviewSpeechText =
    lang === 'ta'
      ? `பணம் செலுத்துதல் சரிபார்ப்பு. நீங்கள் ${payee.name} என்பவருக்கு ${spokenAmount} அனுப்புகிறீர்கள். உங்கள் கணக்கின் கடைசி நான்கு எண்கள் ${customer.accountNumber.slice(-4)}.`
      : lang === 'hi'
      ? `भुगतान समीक्षा। आप ${payee.name} को ${spokenAmount} भेज रहे हैं। आपके खाते के अंतिम चार अंक ${customer.accountNumber.slice(-4)} हैं।`
      : `Payment review. You are sending ${spokenAmount} to ${payee.name} from account ending in ${customer.accountNumber.slice(-4)}.`;

  useEffect(() => {
    if (state.settings.readAloud || state.settings.mode === 'simple') {
      speak(reviewSpeechText, lang);
    }
  }, [state.settings.readAloud, state.settings.mode, reviewSpeechText, lang]);

  const handleProceedToPin = () => {
    navigate('/pay/pin', {
      state: {
        payee,
        amountPaise,
        note,
      },
    });
  };

  const handleSomeoneAskedMe = () => {
    navigate('/pay/stopped', {
      state: {
        reason: 'someone-asked',
        amountPaise,
        payee,
      },
    });
  };

  return (
    <Screen
      title={lang === 'hi' ? 'समीक्षा और पुष्टि' : 'Review Payment'}
      showBack={true}
      hideTabBar={true}
      mainAction={
        safetyCheckPassed && simpleConfirmPassed && !exceedsDailyLimit
          ? {
              label: `${lang === 'hi' ? 'पुष्टि करें और PIN डालें · ' : 'Confirm with PIN · '}${formatINR(amountPaise)}`,
              onClick: handleProceedToPin,
            }
          : null
      }
      secondaryAction={{
        label: lang === 'hi' ? '← विवरण बदलें' : '← Change Details',
        onClick: () => navigate(-1),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StepHeader current={2} total={3} name={lang === 'hi' ? 'विवरण की पुष्टि' : 'Review Details'} />
        <ReadAloud text={reviewSpeechText} label="Listen" />
      </div>

      {/* Daily limit block notice */}
      {exceedsDailyLimit && (
        <Notice type="error" title="Daily UPI Limit Exceeded">
          This payment of {formatINR(amountPaise)} plus today's spending of {formatINR(todaySpent)} exceeds your daily limit of {formatINR(upiDailyLimit)}. Remaining today: {formatINR(Math.max(0, upiDailyLimit - todaySpent))}. Lower the amount or change your limit in Services.
        </Notice>
      )}

      {/* New payee 24h safety limit warning */}
      {isNewPayee && (
        <Notice type="safety" title="New Payee Rule">
          {config.newPayeeRule[lang] || config.newPayeeRule.en}
        </Notice>
      )}

      {/* 1. Hero Transfer Card matching top fintech design */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          border: '1.5px solid var(--border)',
          padding: '24px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1d4ed8 0%, #38bdf8 50%, #1d4ed8 100%)',
          }}
        />

        {/* Sender -> Receiver Flow Visualizer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            width: '100%',
            marginBottom: '16px',
          }}
        >
          {/* Sender Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: 'var(--brand-soft)',
                color: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              {customer?.name?.en?.charAt(0) || 'U'}
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              You
            </span>
          </div>

          {/* Transfer Line */}
          <div style={{ flex: 1, maxWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#15803d', letterSpacing: '0.04em' }}>
              ⚡ INSTANT
            </span>
            <div
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#cbd5e1',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: '-2px',
                  top: '-4px',
                  width: '0',
                  height: '0',
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '7px solid #64748b',
                }}
              />
            </div>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>UPI 2.0</span>
          </div>

          {/* Receiver Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
              }}
            >
              {payeeInitial}
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                maxWidth: '75px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {payee.name}
            </span>
          </div>
        </div>

        {/* Hero Amount */}
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {lang === 'hi' ? 'कुल भुगतान राशि' : 'Total Payable Amount'}
        </div>
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            margin: '4px 0 8px 0',
          }}
        >
          {formatINR(amountPaise)}
        </div>

        {/* Verified Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#065f46',
          }}
        >
          <span>✓ Zero Transfer Fees</span>
          <span>·</span>
          <span>Instant Settlement</span>
        </div>
      </div>

      {/* 2. Structured Payment Breakdown Card */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          border: '1.5px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'hi' ? 'प्राप्तकर्ता (To)' : 'Sending to'}
          </span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {payee.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {payee.accountNumber || payee.vpa || 'UPI'}
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'hi' ? 'प्राप्तकर्ता बैंक' : 'Recipient bank'}
          </span>
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {payee.bank || 'Punjab National Bank'}
          </span>
        </div>

        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'hi' ? 'कटौती खाता (From)' : 'Deducting from'}
          </span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Saral Savings (•••• {customer?.accountNumber ? customer.accountNumber.slice(-4) : '9384'})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
              {customer?.name?.[lang] || customer?.name?.en}
            </div>
          </div>
        </div>

        {note && (
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {lang === 'hi' ? 'टिप्पणी (Note)' : 'Note'}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              "{note}"
            </span>
          </div>
        )}

        <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            🛡️ NPCI Unified Payments Interface (UPI 2.0 Encrypted)
          </span>
        </div>
      </div>

      {/* Large Payment Safety Check Prompt */}
      {!safetyCheckPassed && (
        <ChoicePrompt
          title={t('pay.safetyCheck.title') || 'Safety Check'}
          message={
            t('pay.safetyCheck.question') ||
            'Did someone call, message, or ask you to send this money?'
          }
          primaryLabel={t('core.safety.decidedMyself') || 'No, I decided this myself'}
          secondaryLabel={t('core.safety.someoneAsked') || 'Yes, someone asked me'}
          onPrimary={() => setSafetyCheckPassed(true)}
          onSecondary={handleSomeoneAskedMe}
        />
      )}

      {/* Simple mode extra confirmation for > ₹5,000 */}
      {safetyCheckPassed && !simpleConfirmPassed && (
        <ChoicePrompt
          title={t('pay.simpleConfirm.title') || 'Confirm Large Payment'}
          message={`This is a payment of ${formatINR(amountPaise)}. Are you sure you want to proceed?`}
          primaryLabel="Yes, I am sure"
          secondaryLabel="No, go back"
          onPrimary={() => setSimpleConfirmPassed(true)}
          onSecondary={() => navigate(-1)}
        />
      )}
    </Screen>
  );
}
