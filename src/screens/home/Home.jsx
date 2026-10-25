import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import Amount from '../../components/ui/Amount';
import BigButton from '../../components/ui/BigButton';
import ReadAloud from '../../components/ui/ReadAloud';
import VoiceControl from '../../components/voice/VoiceControl';
import QrScanner from '../../components/ui/QrScanner';
import Sheet from '../../components/ui/Sheet';
import Field from '../../components/ui/Field';
import {
  EyeIcon,
  EyeOffIcon,
  SendIcon,
  ClockIcon,
  FileTextIcon,
  HelpCircleIcon,
  MicIcon,
  UserIcon,
  QrCodeIcon,
  BellIcon,
  ZapIcon,
  SmartphoneIcon,
  CreditCardIcon,
  CheckIcon,
  ShieldIcon,
  PlusIcon,
  BookIcon,
  SparklesIcon,
} from '../../components/icons/Icons';
import { getBalances, getTransactions, addTransaction } from '../../utils/ledger.js';
import { getCustomer, maskAccountNumber } from '../../data/customers.js';
import banks from '../../data/banks.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { amountToSpeech, formatINR } from '../../utils/money.js';
import { speak } from '../../utils/speech.js';
import { playSuccessChime, playTapTone } from '../../utils/audio.js';

export default function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'priya';
  const customer = getCustomer(customerId) || {
    id: customerId,
    name: { en: 'Priya Sharma', hi: 'प्रिया शर्मा' },
    accountNumber: '3072 5610 9384',
  };
  const bank = banks[state.settings.bankId] || banks.saral;
  const isSimple = state.settings.mode === 'simple';
  const isYoung = state.settings.mode === 'young' || customerId === 'aarav';

  const [hideBalanceLocal, setHideBalanceLocal] = useState(state.settings.hideBalance);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(isYoung ? '500' : '5000');
  const [aaravNote, setAaravNote] = useState('School books & stationery');
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [familyToast, setFamilyToast] = useState('');

  const balances = getBalances(customerId);
  const recentTransactions = getTransactions(customerId).slice(0, 5);

  // Check guardian requests
  const guardianRequests = state.pay?.guardianRequests || [];
  const pendingAaravRequests = guardianRequests.filter(
    (r) => r.status === 'pending' && (r.guardianId === 'priya' || r.childId === 'aarav' || r.customerId === 'aarav')
  );

  const handleQrScanSuccess = (scannedPayee) => {
    navigate('/pay/amount', {
      state: {
        payee: scannedPayee,
        amountPaise: scannedPayee.amountPaise,
      },
    });
  };

  const toggleHideBalance = () => {
    const next = !hideBalanceLocal;
    setHideBalanceLocal(next);
    dispatch({ type: 'SET_HIDE_BALANCE', payload: next });
  };

  // Aarav requests money from Mom Priya, or Priya/Shankar adds money directly
  const handleQuickDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    const amountPaise = Math.round(amt * 100);

    if (isYoung) {
      // Aarav sends money request to Mom Priya Sharma!
      const reqId = `greq_${Date.now()}`;
      dispatch({
        type: 'ADD_GUARDIAN_REQUEST',
        payload: {
          id: reqId,
          type: 'add_money',
          childId: 'aarav',
          childName: 'Aarav Mehta',
          guardianId: 'priya',
          amountPaise,
          note: aaravNote || 'Pocket money for school',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      });

      playSuccessChime();
      setDepositSuccess(true);
      setTimeout(() => {
        setIsDepositOpen(false);
        setDepositSuccess(false);
      }, 2000);
    } else {
      // Standard top-up for Priya / Shankar
      addTransaction({
        id: `tx_dep_${Date.now()}`,
        customerId,
        date: new Date().toISOString(),
        direction: 'in',
        amountPaise,
        type: 'DEPOSIT',
        counterparty: 'Instant UPI Top-up',
        raw: `DEP/UPI/TOPUP/${customerId}`,
        ref: `DEP${Date.now().toString().slice(-8)}`,
        plain: {
          en: 'Money added to account',
          hi: 'खाते में पैसे जोड़े गए',
        },
      });

      playSuccessChime();
      setDepositSuccess(true);
      setTimeout(() => {
        setIsDepositOpen(false);
        setDepositSuccess(false);
      }, 1200);
    }
  };

  // Mom Priya Sharma approves Aarav's request (payment, add_money, or upi_limit)
  const handleApproveAaravRequest = (req) => {
    dispatch({ type: 'APPROVE_GUARDIAN_REQUEST', payload: req.id });

    // Handle payment approval (> ₹5,000 sent by Aarav)
    if (req.type === 'payment') {
      const txRef = String(Math.floor(100000000000 + Math.random() * 900000000000));
      const counterparty = req.counterparty || 'Merchant';
      addTransaction({
        id: `tx_aarav_${Date.now()}`,
        customerId: 'aarav',
        date: new Date().toISOString(),
        direction: 'out',
        amountPaise: req.amountPaise,
        type: 'UPI',
        counterparty,
        raw: `UPI/DR/${txRef}/${counterparty.toUpperCase().replace(/\s+/g, '')}/BANK`,
        ref: txRef,
        plain: {
          en: `Approved payment to ${counterparty}`,
          hi: `${counterparty} को स्वीकृत भुगतान`,
        },
        parts: [
          { token: 'UPI', key: 'upi' },
          { token: 'DR', key: 'dr' },
          { token: txRef, key: 'ref' },
        ],
        note: req.note,
      });

      playSuccessChime();
      setFamilyToast(`✓ Approved! Payment of ₹${(req.amountPaise / 100).toLocaleString('en-IN')} to ${counterparty} processed.`);
      setTimeout(() => setFamilyToast(''), 4500);
      return;
    }

    // Handle UPI limit increase approval
    if (req.type === 'upi_limit') {
      dispatch({ type: 'SET_DAILY_LIMIT', payload: req.requestedLimitPaise });
      playSuccessChime();
      setFamilyToast(`✓ Approved! Aarav's daily UPI limit updated to ₹${(req.requestedLimitPaise / 100).toLocaleString('en-IN')}.`);
      setTimeout(() => setFamilyToast(''), 4500);
      return;
    }

    // Handle add_money (pocket money)
    // 1. Debit from Mom Priya
    addTransaction({
      id: `tx_priya_${Date.now()}`,
      customerId: 'priya',
      date: new Date().toISOString(),
      direction: 'out',
      amountPaise: req.amountPaise,
      type: 'TRANSFER',
      counterparty: 'Aarav Mehta (Son)',
      raw: `UPI/DR/FAMILY/AARAV_MEHTA`,
      ref: `FAM${Date.now().toString().slice(-8)}`,
      plain: {
        en: `Pocket money sent to Aarav (${req.note})`,
        hi: `आरव को पॉकेट मनी भेजी (${req.note})`,
      },
    });

    // 2. Credit to Son Aarav
    addTransaction({
      id: `tx_aarav_${Date.now()}`,
      customerId: 'aarav',
      date: new Date().toISOString(),
      direction: 'in',
      amountPaise: req.amountPaise,
      type: 'DEPOSIT',
      counterparty: 'Priya Sharma (Mom)',
      raw: `DEP/CR/FAMILY/PRIYA_SHARMA`,
      ref: `FAM${Date.now().toString().slice(-8)}`,
      plain: {
        en: `Received from Mom (${req.note})`,
        hi: `माँ से प्राप्त हुए (${req.note})`,
      },
    });

    playSuccessChime();
    setFamilyToast(`✓ Approved! ₹${(req.amountPaise / 100).toLocaleString('en-IN')} has been sent and added to Aarav's account.`);
    setTimeout(() => setFamilyToast(''), 4500);
  };

  // Mom Priya Sharma declines Aarav's request
  const handleDeclineAaravRequest = (req) => {
    dispatch({ type: 'DECLINE_GUARDIAN_REQUEST', payload: req.id });
    playTapTone();
    setFamilyToast(
      req.type === 'payment'
        ? 'Payment request declined. No money was deducted.'
        : 'Request declined.'
    );
    setTimeout(() => setFamilyToast(''), 3000);
  };

  const balanceSpoken =
    lang === 'ta'
      ? `இருப்புத் தொகை: ${amountToSpeech(balances.totalPaise, 'ta')}`
      : lang === 'hi'
      ? `उपलब्ध शेष राशि: ${amountToSpeech(balances.totalPaise, 'hi')}`
      : `Available balance: ${amountToSpeech(balances.totalPaise, 'en')}`;

  const customerName = customer?.name?.[lang] || customer?.name?.en || 'Customer';
  const initial = (customerName || 'U').charAt(0).toUpperCase();

  // Greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? (lang === 'hi' ? 'शुभ प्रभात' : lang === 'ta' ? 'காலை வணக்கம்' : 'Good Morning')
      : currentHour < 17
      ? (lang === 'hi' ? 'शुभ दोपहर' : lang === 'ta' ? 'மதிய வணக்கம்' : 'Good Afternoon')
      : (lang === 'hi' ? 'शुभ संध्या' : lang === 'ta' ? 'மாலை வணக்கம்' : 'Good Evening');

  // Auto read-aloud in Tamil for Shankar Prasad (Simple Mode) when Tamil is selected
  React.useEffect(() => {
    if ((isSimple || customerId === 'shankar') && lang === 'ta') {
      const speech = `${greeting} ${customerName}. இருப்புத் தொகை: ${amountToSpeech(balances.totalPaise, 'ta')}.`;
      const timer = setTimeout(() => {
        speak(speech, 'ta');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [lang, customerId, isSimple]);

  return (
    <Screen showBack={false}>
      {/* Top Header: Avatar + Greeting + Notifications Bell */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 0 12px 0',
        }}
      >
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          className="interactive-tap"
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)',
              border: '2px solid #ffffff',
            }}
          >
            {initial}
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {greeting},
            </div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>
              {customerName}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Quick Language Toggle with Spoken Confirmation */}
          <div
            style={{
              display: 'flex',
              gap: '2px',
              backgroundColor: 'var(--surface-alt, #f1f5f9)',
              padding: '2px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हि' },
              { code: 'ta', label: 'தமிழ்' },
            ].map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_LANG', payload: code });
                  if (code === 'ta') {
                    speak(`வணக்கம் ${customerName}. தமிழ் தேர்ந்தெடுக்கப்பட்டது. இருப்புத் தொகை: ${amountToSpeech(balances.totalPaise, 'ta')}`, 'ta');
                  } else if (code === 'hi') {
                    speak(`नमस्ते ${customerName}. हिंदी चुनी गई। उपलब्ध शेष राशि: ${amountToSpeech(balances.totalPaise, 'hi')}`, 'hi');
                  } else {
                    speak(`Hello ${customerName}. English selected. Available balance: ${amountToSpeech(balances.totalPaise, 'en')}`, 'en');
                  }
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: lang === code ? 'var(--brand)' : 'transparent',
                  color: lang === code ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                className="interactive-tap"
                title={`Switch to ${label}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Notification Bell with alert dot if there are pending family requests */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              position: 'relative',
              cursor: 'pointer',
            }}
            className="interactive-tap hover:bg-slate-100"
            aria-label="Notifications"
          >
            <BellIcon size={20} />
            {(pendingAaravRequests.length > 0 || customerId === 'priya') && (
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '9px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: '1.5px solid #ffffff',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* FAMILY SUCCESS TOAST BANNER */}
      {familyToast && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1.5px solid #16a34a',
            color: '#15803d',
            borderRadius: '14px',
            padding: '12px 14px',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="animate-fade-in"
        >
          <CheckIcon size={18} />
          <span>{familyToast}</span>
        </div>
      )}

      {/* MOM PRIYA VIEW: Pending Requests from Son Aarav Mehta */}
      {customerId === 'priya' && pendingAaravRequests.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {pendingAaravRequests.map((req) => (
            <div
              key={req.id}
              style={{
                backgroundColor: req.type === 'payment' ? '#fff7ed' : '#eff6ff',
                border: `2px solid ${req.type === 'payment' ? '#f97316' : '#3b82f6'}`,
                borderRadius: '18px',
                padding: '16px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                marginBottom: '10px',
              }}
              className="animate-fade-in"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: req.type === 'payment' ? '#ffedd5' : '#dbeafe',
                    color: req.type === 'payment' ? '#c2410c' : '#1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  {req.type === 'payment' ? '💳' : req.type === 'upi_limit' ? '🛡️' : '👨‍👦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: req.type === 'payment' ? '#9a3412' : '#1e3a8a' }}>
                    {req.type === 'payment'
                      ? 'Payment Approval Request (> ₹5,000)'
                      : req.type === 'upi_limit'
                      ? 'UPI Daily Limit Increase Request'
                      : 'Money Request from Son (Aarav Mehta)'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: req.type === 'payment' ? '#c2410c' : '#1e40af', marginTop: '2px' }}>
                    {req.type === 'payment' ? (
                      <>
                        Aarav is trying to pay <strong>₹{(req.amountPaise / 100).toLocaleString('en-IN')}</strong> to <strong>{req.counterparty}</strong>. Approve or reject this payment.
                      </>
                    ) : req.type === 'upi_limit' ? (
                      <>
                        Aarav wants to increase his daily UPI limit to <strong>₹{(req.requestedLimitPaise / 100).toLocaleString('en-IN')}</strong>.
                      </>
                    ) : (
                      <>
                        Aarav is asking for <strong>₹{(req.amountPaise / 100).toLocaleString('en-IN')}</strong> for "{req.note}".
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleApproveAaravRequest(req)}
                  style={{
                    flex: 1,
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                  }}
                  className="interactive-tap hover:bg-green-700"
                >
                  <span>✓</span>
                  <span>
                    {req.type === 'payment'
                      ? `Approve Payment ₹${(req.amountPaise / 100).toLocaleString('en-IN')}`
                      : req.type === 'upi_limit'
                      ? 'Approve Limit'
                      : `Approve & Send ₹${(req.amountPaise / 100).toLocaleString('en-IN')}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeclineAaravRequest(req)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    border: '1.5px solid #fca5a5',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap hover:bg-red-50"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AARAV VIEW: Notice of Pending Request to Mom */}
      {customerId === 'aarav' && pendingAaravRequests.length > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '16px',
            padding: '12px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          className="animate-fade-in"
        >
          <span style={{ fontSize: '1.3rem' }}>⏳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#92400e' }}>
              Request Sent to Mom (Priya Sharma)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
              {pendingAaravRequests[0].type === 'payment'
                ? `Waiting for Mom's approval for payment of ₹${(pendingAaravRequests[0].amountPaise / 100).toLocaleString('en-IN')} to ${pendingAaravRequests[0].counterparty}. Once approved, it will be processed.`
                : pendingAaravRequests[0].type === 'upi_limit'
                ? `Waiting for Mom's approval for new daily UPI limit of ₹${(pendingAaravRequests[0].requestedLimitPaise / 100).toLocaleString('en-IN')}.`
                : `Waiting for approval of ₹${(pendingAaravRequests[0].amountPaise / 100).toLocaleString('en-IN')}. Once accepted, it will be added to your balance!`}
            </div>
          </div>
        </div>
      )}

      {/* Primary Savings Account Card (Screen 3 in mockup) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #0f2e82 100%)',
          color: '#ffffff',
          borderRadius: '22px',
          padding: '22px 20px',
          boxShadow: '0 10px 28px rgba(29, 78, 216, 0.32)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        {/* Subtle curved background pattern */}
        <div
          style={{
            position: 'absolute',
            right: '-30px',
            top: '-30px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Card Header: Savings Account label & Eye toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
              {lang === 'hi' ? 'बचत खाता' : lang === 'ta' ? 'சேமிப்புக் கணக்கு' : 'Savings Account'}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
              {maskAccountNumber(customer.accountNumber || '2048 1023 4589')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isSimple && !hideBalanceLocal && (
              <ReadAloud text={balanceSpoken} />
            )}
            <button
              type="button"
              onClick={toggleHideBalance}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="interactive-tap"
              aria-label={hideBalanceLocal ? 'Show balance' : 'Hide balance'}
            >
              {hideBalanceLocal ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {lang === 'hi' ? 'उपलब्ध शेष राशि' : lang === 'ta' ? 'இருப்புத் தொகை' : 'Available Balance'}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '2px' }}>
            {hideBalanceLocal ? '••••••••' : formatINR(balances.totalPaise)}
          </div>
        </div>

        {/* 3 Circular Actions on Card matching Screen 3 in mockup */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* Action 1: Add Money (or Request Money for Aarav) */}
          <button
            type="button"
            onClick={() => setIsDepositOpen(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              +
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {isYoung
                ? (lang === 'hi' ? 'पैसे मांगें' : 'Request Money')
                : (lang === 'hi' ? 'पैसे जोड़ें' : 'Add Money')}
            </span>
          </button>

          {/* Action 2: Send Money */}
          <button
            type="button"
            onClick={() => navigate('/pay')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SendIcon size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'पैसे भेजें' : 'Send Money'}
            </span>
          </button>

          {/* Action 3: More / Accounts */}
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '1px',
              }}
            >
              •••
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {lang === 'hi' ? 'अन्य' : 'More'}
            </span>
          </button>
        </div>
      </div>

      {/* SIMPLE MODE: 4 Big Accessible Buttons (for Shankar 68 yrs) */}
      {isSimple ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
          <BigButton
            variant="primary"
            onClick={() => {
              if (hideBalanceLocal) toggleHideBalance();
              if (lang === 'ta') {
                speak(`உங்கள் கணக்கு இருப்புத் தொகை: ${amountToSpeech(balances.totalPaise, 'ta')}`, 'ta');
              }
            }}
          >
            {t('core.home.simple.seeMoney') || 'See my money'}
          </BigButton>

          <BigButton
            variant="primary"
            onClick={() => setIsQrOpen(true)}
          >
            {lang === 'hi' ? '📷 QR कोड स्कैन करें' : lang === 'ta' ? '📷 QR குறியீட்டை ஸ்கேன் செய்க' : '📷 Scan QR code'}
          </BigButton>

          <BigButton
            variant="primary"
            onClick={() => navigate('/pay')}
          >
            {t('core.home.simple.sendMoney') || 'Send money'}
          </BigButton>

          <BigButton
            variant="secondary"
            onClick={() => navigate('/history')}
          >
            {t('core.home.simple.recentPayments') || 'Recent payments'}
          </BigButton>

          <BigButton
            variant="secondary"
            onClick={() => navigate('/help')}
          >
            {t('core.home.simple.help') || 'Help & Support'}
          </BigButton>
        </div>
      ) : (
        /* STANDARD / YOUNG SAVER MODE */
        <>
          {/* Young Saver Banner if mode is young */}
          {isYoung && (
            <Card heading={t('young.goals.title') || 'Savings Goals'}>
              <BigButton variant="secondary" onClick={() => navigate('/goals')}>
                {t('young.goals.viewAll') || 'View my savings goals'}
              </BigButton>
            </Card>
          )}

          {/* 4 Circular Quick Actions Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              margin: '14px 0 18px 0',
            }}
          >
            {isYoung ? (
              /* Young Saver: No Bill Pay, No Recharge (per diff.md and user instruction) */
              <>
                {/* 1. Transfer */}
                <button
                  type="button"
                  onClick={() => navigate('/pay')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(29, 78, 216, 0.15)',
                    }}
                  >
                    <SendIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'ट्रांसफर' : 'Transfer'}
                  </span>
                </button>

                {/* 2. Goals (replacing bills for Young Saver) */}
                <button
                  type="button"
                  onClick={() => navigate('/goals')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(217, 119, 6, 0.15)',
                    }}
                  >
                    <SparklesIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'बचत लक्ष्य' : 'Goals'}
                  </span>
                </button>

                {/* 3. Learn (replacing recharge for Young Saver) */}
                <button
                  type="button"
                  onClick={() => navigate('/learn')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.15)',
                    }}
                  >
                    <BookIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'सीखें' : 'Learn'}
                  </span>
                </button>

                {/* 4. Scan & Pay */}
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#f3e8ff',
                      color: '#7e22ce',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(126, 34, 206, 0.15)',
                    }}
                  >
                    <QrCodeIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'स्कैन व पे' : 'Scan & Pay'}
                  </span>
                </button>
              </>
            ) : (
              /* Standard Mode Quick Actions */
              <>
                {/* 1. Transfer */}
                <button
                  type="button"
                  onClick={() => navigate('/pay')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(29, 78, 216, 0.15)',
                    }}
                  >
                    <SendIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'ट्रांसफर' : 'Transfer'}
                  </span>
                </button>

                {/* 2. Statements / Passbook */}
                <button
                  type="button"
                  onClick={() => navigate('/statements')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(21, 128, 61, 0.15)',
                    }}
                  >
                    <FileTextIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'विवरण' : lang === 'ta' ? 'அறிக்கை' : 'Statements'}
                  </span>
                </button>

                {/* 3. Services */}
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#ffedd5',
                      color: '#c2410c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(194, 65, 12, 0.15)',
                    }}
                  >
                    <ShieldIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'सेवाएं' : lang === 'ta' ? 'சேவைகள்' : 'Services'}
                  </span>
                </button>

                {/* 4. Scan & Pay */}
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="interactive-tap"
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#f3e8ff',
                      color: '#7e22ce',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(126, 34, 206, 0.15)',
                    }}
                  >
                    <QrCodeIcon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lang === 'hi' ? 'स्कैन व पे' : 'Scan & Pay'}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Voice Banking Assistant Interactive Card */}
          <div
            onClick={() => setIsVoiceOpen(true)}
            style={{
              background: 'linear-gradient(135deg, var(--brand-soft) 0%, var(--surface-alt) 100%)',
              border: '1.5px solid var(--border)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '18px',
            }}
            className="interactive-tap"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MicIcon size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {lang === 'hi' ? 'वॉइस बैंकिंग सहायक' : 'Voice Banking Assistant'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {lang === 'hi' ? 'बोलें: "रमेश को 500 रुपये भेजो"' : lang === 'ta' ? 'கூறுங்கள்: "ரமேஷிற்கு 500 ரூபாய் அனுப்புக"' : 'Say: "Pay 500 to Ramesh" or "Check balance"'}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand)' }}>
              {lang === 'hi' ? 'बोलें →' : lang === 'ta' ? 'பேசுக →' : 'Speak →'}
            </span>
          </div>

          {/* Recent Transactions Section */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {t('core.home.recentTransactions') || 'Recent Transactions'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/history')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                className="interactive-tap"
              >
                {t('core.home.viewAll') || 'View All'}
              </button>
            </div>

            <div
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                backgroundColor: 'var(--surface)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              {recentTransactions.map((tx) => (
                <ListRow
                  key={tx.id}
                  title={tx.counterparty}
                  subtitle={tx.plain[lang] || tx.plain.en}
                  trailing={
                    <Amount paise={tx.amountPaise} direction={tx.direction} />
                  }
                  chevron
                  onClick={() => navigate(`/history/${tx.id}`)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal: Add Money (for Priya/Shankar) OR Request Money from Mom (for Aarav) */}
      <Sheet
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        title={
          isYoung
            ? (lang === 'hi' ? 'माँ (प्रिया शर्मा) से पैसे मांगें' : 'Request Money from Mom (Priya)')
            : (lang === 'hi' ? 'पैसे जोड़ें (Top-up)' : 'Add Money to Account')
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {depositSuccess ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}
              >
                <CheckIcon size={28} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                {isYoung ? 'Request Sent to Mom!' : `${formatINR(Math.round(parseFloat(depositAmount) * 100))} Added!`}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                {isYoung
                  ? 'Request sent to Priya Sharma (Mom). When she approves, the money will be instantly added to your account.'
                  : 'Funds added to your primary Savings Account.'}
              </p>
            </div>
          ) : isYoung ? (
            /* Aarav Young Saver Request Form */
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '10px 14px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  P
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#1e3a8a' }}>
                    Priya Sharma (Mom & Guardian)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#1e40af' }}>
                    Request goes to Mom for instant review and approval.
                  </div>
                </div>
              </div>

              <Field
                label={lang === 'hi' ? 'राशि (₹)' : 'Requested Amount (₹)'}
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                {['200', '500', '1000', '2000'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setDepositAmount(chip)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: depositAmount === chip ? 'var(--brand-soft)' : 'var(--surface)',
                      color: depositAmount === chip ? 'var(--brand)' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    +₹{chip}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {lang === 'hi' ? 'कारण / नोट' : 'What is this for? (Note for Mom)'}
                </label>
                <select
                  value={aaravNote}
                  onChange={(e) => setAaravNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1.5px solid var(--border)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  <option value="School books & stationery">📚 School books & stationery</option>
                  <option value="School science project supplies">🎒 School science project supplies</option>
                  <option value="Lunch & canteen snacks">🥪 Lunch & canteen snacks</option>
                  <option value="Deposit to savings goal">🎯 Deposit to savings goal</option>
                  <option value="Pocket money">🪙 General pocket money</option>
                </select>
              </div>

              <BigButton variant="primary" onClick={handleQuickDeposit}>
                {lang === 'hi' ? 'माँ को अनुरोध भेजें' : 'Send Request to Mom (Priya)'}
              </BigButton>
            </>
          ) : (
            /* Standard User Deposit Form */
            <>
              <Field
                label={lang === 'hi' ? 'राशि (₹)' : 'Enter Amount (₹)'}
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                {['1000', '2000', '5000', '10000'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setDepositAmount(chip)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: depositAmount === chip ? 'var(--brand-soft)' : 'var(--surface)',
                      color: depositAmount === chip ? 'var(--brand)' : 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    +₹{chip}
                  </button>
                ))}
              </div>

              <BigButton variant="primary" onClick={handleQuickDeposit}>
                {lang === 'hi' ? 'खाते में जोड़ें' : 'Add to Savings Account'}
              </BigButton>
            </>
          )}
        </div>
      </Sheet>

      {/* Notifications Drawer */}
      <Sheet
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title={lang === 'hi' ? 'सूचनाएं' : 'Notifications'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* If Mom has pending requests from Aarav */}
          {customerId === 'priya' && pendingAaravRequests.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingAaravRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: req.type === 'payment' ? '#fff7ed' : '#eff6ff',
                    border: `1.5px solid ${req.type === 'payment' ? '#fb923c' : '#3b82f6'}`,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: req.type === 'payment' ? '#9a3412' : '#1e3a8a' }}>
                    {req.type === 'payment'
                      ? '💳 Payment Approval Request'
                      : req.type === 'upi_limit'
                      ? '🛡️ UPI Limit Increase Request'
                      : '👨‍👦 Aarav Mehta: Pocket Money Request'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: req.type === 'payment' ? '#c2410c' : '#1e40af', marginTop: '3px' }}>
                    {req.type === 'payment'
                      ? `Requested to pay ₹${(req.amountPaise / 100).toLocaleString('en-IN')} to ${req.counterparty}.`
                      : req.type === 'upi_limit'
                      ? `Requested daily limit: ₹${(req.requestedLimitPaise / 100).toLocaleString('en-IN')}.`
                      : `Requested ₹${(req.amountPaise / 100).toLocaleString('en-IN')} for "${req.note}".`}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleApproveAaravRequest(req);
                        setIsNotificationsOpen(false);
                      }}
                      style={{
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDeclineAaravRequest(req);
                        setIsNotificationsOpen(false);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#065f46' }}>
              ✓ Monthly Interest Credited
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '2px' }}>
              ₹248.50 has been credited to your Savings Account.
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400e' }}>
              ⚡ Electricity Bill Due in 3 Days
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '2px' }}>
              Your JPDCL bill of ₹1,450.00 is due on 27th Oct. Tap to pay now.
            </div>
          </div>
        </div>
      </Sheet>

      {/* Voice Assistant Modal */}
      <VoiceControl isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* QR Code Scanner Modal */}
      <QrScanner
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />
    </Screen>
  );
}
