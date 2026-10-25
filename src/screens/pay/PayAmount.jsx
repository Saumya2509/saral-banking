import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import StepHeader from '../../components/ui/StepHeader';
import Notice from '../../components/ui/Notice';
import BigButton from '../../components/ui/BigButton';
import { rupeesToPaise, formatINR } from '../../utils/money.js';
import { getBalances } from '../../utils/ledger.js';
import { playSuccessChime } from '../../utils/audio.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { getCustomer } from '../../data/customers.js';

export default function PayAmount() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const payee = location.state?.payee || { name: 'Recipient', bank: 'Bank', accountNumber: '••••' };
  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const balances = getBalances(customerId);

  const initialAmount = location.state?.amountPaise || location.state?.payee?.amountPaise || 0;
  const [rupeesInput, setRupeesInput] = useState(
    initialAmount > 0 ? String(initialAmount / 100) : ''
  );
  const [note, setNote] = useState(location.state?.note || '');
  const [showOverLimitPrompt, setShowOverLimitPrompt] = useState(false);
  const [limitErrorMessage, setLimitErrorMessage] = useState('');

  const amountPaise = rupeesToPaise(rupeesInput);
  const isYoung = state.settings.mode === 'young' || customer?.isMinor || customerId === 'aarav';
  const upiDailyLimit = state.records?.upiLimits?.dailyPaise || 10000000;

  const payeeInitial = (payee.name || 'P')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleReview = () => {
    if (amountPaise <= 0) return;

    // Check 1: UPI Daily Limit set by user in Services
    if (amountPaise > upiDailyLimit) {
      setLimitErrorMessage(
        `Amount ${formatINR(amountPaise)} exceeds daily UPI limit of ${formatINR(upiDailyLimit)}.`
      );
      return;
    }

    // Check 2: Minor / Young Saver guardian limit (> ₹5,000 needs Mom's approval)
    if (isYoung && amountPaise > 500000) {
      setShowOverLimitPrompt(true);
      return;
    }

    setLimitErrorMessage('');

    navigate('/pay/review', {
      state: {
        payee,
        amountPaise,
        note,
      },
    });
  };

  const handleAskGuardian = () => {
    const req = {
      id: `greq_pay_${Date.now()}`,
      type: 'payment',
      customerId: 'aarav',
      childId: 'aarav',
      childName: 'Aarav Mehta',
      guardianId: 'priya',
      counterparty: payee.name,
      amountPaise,
      note: note || `Payment to ${payee.name}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GUARDIAN_REQUEST', payload: req });
    playSuccessChime();
    alert(
      lang === 'hi'
        ? 'भुगतान स्वीकृति अनुरोध आपकी माँ (प्रिया शर्मा) को भेज दिया गया है।'
        : 'Payment approval request sent to your mother (Priya Sharma).'
    );
    navigate('/');
  };

  return (
    <Screen
      title={lang === 'hi' ? 'भुगतान करें' : 'Pay'}
      showBack={true}
      hideTabBar={true}
      mainAction={{
        label:
          amountPaise > 0
            ? `${lang === 'hi' ? 'आगे बढ़ें · ' : 'Proceed to Review · '}${formatINR(amountPaise)}`
            : lang === 'hi'
            ? 'समीक्षा करें'
            : 'Review',
        disabled: amountPaise <= 0,
        onClick: handleReview,
      }}
    >
      <StepHeader current={1} total={3} name={lang === 'hi' ? 'राशि दर्ज करें' : 'Enter Amount'} />

      {/* 1. Verified Merchant / Recipient Card */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '16px',
          border: '1.5px solid var(--border)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.125rem',
            letterSpacing: '0.5px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
          }}
        >
          {payeeInitial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {lang === 'hi' ? 'प्राप्तकर्ता:' : 'Paying to:'}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                padding: '1px 6px',
                borderRadius: '6px',
              }}
            >
              ✓ Verified
            </span>
          </div>

          <div
            style={{
              fontSize: '1.0625rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {payee.name}
          </div>

          <div
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginTop: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {payee.bank} · {payee.accountNumber || payee.vpa || 'UPI'}
          </div>
        </div>
      </div>

      {/* 2. Hero Amount Input Card */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          border: '1.5px solid var(--border)',
          padding: '20px 18px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {lang === 'hi' ? 'भुगतान राशि' : 'Amount to send'}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)' }}>
            {isYoung ? 'Approval over ₹5,000' : `Daily Cap: ${formatINR(upiDailyLimit)}`}
          </span>
        </div>

        {/* Currency Symbol + Large Display Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '2.5px solid var(--brand)',
            paddingBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--brand)',
              lineHeight: 1,
            }}
          >
            ₹
          </span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={rupeesInput}
            onChange={(e) => {
              setRupeesInput(e.target.value);
              if (limitErrorMessage) setLimitErrorMessage('');
            }}
            style={{
              width: '100%',
              fontSize: '2.75rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              letterSpacing: '-1px',
            }}
          />
        </div>

        {/* Calculated Amount or Error */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '18px' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: amountPaise > 0 ? '#059669' : 'var(--text-muted)',
            }}
          >
            {amountPaise > 0 ? `Calculated: ${formatINR(amountPaise)}` : 'Enter amount in rupees'}
          </span>
          {limitErrorMessage && (
            <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
              {limitErrorMessage}
            </span>
          )}
        </div>

        {/* Quick Amount Increment Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
          {['100', '200', '500', '1000', '2000'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                const current = parseFloat(rupeesInput) || 0;
                setRupeesInput(String(current + parseFloat(chip)));
                if (limitErrorMessage) setLimitErrorMessage('');
              }}
              style={{
                flex: 1,
                minWidth: '55px',
                padding: '8px 0',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                backgroundColor: 'var(--surface-alt)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              className="interactive-tap hover:border-blue-400"
            >
              +{chip}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Debiting Account Source Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: '16px',
          backgroundColor: 'var(--surface)',
          border: '1.5px solid var(--border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--brand-soft)',
              color: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Saral Savings Account (•••• {customer?.accountNumber ? customer.accountNumber.slice(-4) : '9384'})
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Available: <strong>{formatINR(balances.availablePaise)}</strong>
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#15803d',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '2px 8px',
            borderRadius: '999px',
          }}
        >
          Primary
        </span>
      </div>

      {/* 4. Note Input Card */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1.5px solid var(--border)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>📝</span>
        <input
          type="text"
          placeholder={lang === 'hi' ? 'टिप्पणी जोड़ें (वैकल्पिक)' : 'Add a note (e.g. groceries, medicine, gifts)'}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: '100%',
            fontSize: '0.9375rem',
            color: 'var(--text-primary)',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Minor Limit Warning shown before the footer button */}
      {isYoung && (
        <Notice type="info">
          {lang === 'hi'
            ? '₹5,000 से अधिक के भुगतान के लिए आपकी माँ (प्रिया शर्मा) की स्वीकृति आवश्यक है।'
            : 'Payments above ₹5,000 require approval from your mother (Priya Sharma).'}
        </Notice>
      )}

      {/* Front-and-Center Popup Modal for Aarav Payment > ₹5,000 */}
      {showOverLimitPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="animate-spring-pop"
            style={{
              backgroundColor: 'var(--surface, #ffffff)',
              borderRadius: '24px',
              padding: '28px 22px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                border: '3px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              🛡️
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {lang === 'hi' ? 'माँ (प्रिया शर्मा) से स्वीकृति आवश्यक' : 'Approval Needed from Mom (Priya Sharma)'}
            </h3>

            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              {lang === 'hi' ? (
                <>
                  <strong style={{ color: 'var(--text-primary)' }}>{payee.name}</strong> को{' '}
                  <strong style={{ color: 'var(--brand)' }}>{formatINR(amountPaise)}</strong> का भुगतान ₹5,000 की सीमा से अधिक है। भुगतान पूरा करने के लिए आपकी माँ <strong style={{ color: 'var(--brand)' }}>प्रिया शर्मा</strong> की मंज़ूरी चाहिए।
                </>
              ) : (
                <>
                  Payment of <strong style={{ color: 'var(--brand)' }}>{formatINR(amountPaise)}</strong> to{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{payee.name}</strong> exceeds ₹5,000. It requires approval from your mother <strong style={{ color: 'var(--brand)' }}>Priya Sharma</strong>.
                </>
              )}
            </p>

            <div
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                fontSize: '0.8125rem',
                color: '#92400e',
                fontWeight: 600,
              }}
            >
              {lang === 'hi'
                ? 'अनुरोध आपकी माँ को भेजा जाएगा। उनके स्वीकार करने पर ही पैसे कटेंगे।'
                : "Request will be sent to Mom (Priya Sharma). Money will only be paid once she approves."}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '6px' }}>
              <BigButton
                variant="primary"
                onClick={handleAskGuardian}
              >
                {lang === 'hi' ? 'माँ (प्रिया शर्मा) से स्वीकृति माँगें' : 'Ask Mom (Priya Sharma) to Approve'}
              </BigButton>
              <BigButton
                variant="secondary"
                onClick={() => setShowOverLimitPrompt(false)}
              >
                {lang === 'hi' ? 'राशि बदलें / वापस जाएँ' : 'Change Amount / Go Back'}
              </BigButton>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
