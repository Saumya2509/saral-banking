import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/shell/Header';
import StepHeader from '../../components/ui/StepHeader';
import PinPad from '../../components/ui/PinPad';
import Notice from '../../components/ui/Notice';
import Amount from '../../components/ui/Amount';
import BigButton from '../../components/ui/BigButton';
import { CheckIcon, ShieldIcon } from '../../components/icons/Icons';
import { addTransaction, getTodaysUpiSpending } from '../../utils/ledger.js';
import { playSuccessChime, playErrorTone } from '../../utils/audio.js';
import { speak } from '../../utils/speech.js';
import { formatINR, amountToSpeech } from '../../utils/money.js';
import config from '../../data/config.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

const YOUNG_APPROVAL_THRESHOLD_PAISE = 500000; // ₹5,000

export default function PayPin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const payee = location.state?.payee || { name: 'Recipient', bank: 'Bank' };
  const amountPaise = location.state?.amountPaise || 0;
  const note = location.state?.note || '';
  const customerId = state.session.customerId || 'shankar';
  const isYoung = state.settings?.mode === 'young' || customerId === 'aarav';

  // Flow states: 'input' | 'verifying' | 'success' | 'young_approval'
  const [flowState, setFlowState] = useState('input');
  const [error, setError] = useState('');
  const [createdReceipt, setCreatedReceipt] = useState(null);

  // Announce security warning on mount for screen readers & blind users
  useEffect(() => {
    const speechText =
      lang === 'ta'
        ? `பின் உள்ளீட்டு திரை. உங்கள் பாதுகாப்பிற்காக, பின்னை வாய்விட்டுச் சொல்ல வேண்டாம். திரையில் உங்கள் 4 இலக்க பின்னை உள்ளிடவும்.`
        : lang === 'hi'
        ? `पिन स्क्रीन। अपनी सुरक्षा के लिए, पिन बोलकर न बताएं। कृपया स्क्रीन पर अपना 4 अंकों का पिन दर्ज करें।`
        : `PIN entry screen. For your security, please enter your 4-digit PIN on the screen.`;

    if (state.settings.readAloud || state.settings.mode === 'simple') {
      speak(speechText, lang);
    }
  }, [lang, state.settings.readAloud, state.settings.mode]);

  const handlePinSubmit = (enteredPin) => {
    setError('');

    if (enteredPin === config.demoPin) {
      // ── Young Saver: payments > ₹5,000 need Mom's approval ──
      if (isYoung && amountPaise > 500000) {
        // Dispatch guardian request
        dispatch({
          type: 'ADD_GUARDIAN_REQUEST',
          payload: {
            id: `greq_pay_${Date.now()}`,
            type: 'payment',
            childId: 'aarav',
            childName: 'Aarav Mehta',
            guardianId: 'priya',
            amountPaise,
            counterparty: payee.name,
            note: note || `Payment to ${payee.name}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        });
        setFlowState('young_approval');
        speak('Payment request sent to Mom for approval.', lang);
        return;
      }

      // ── Enforce global UPI daily limit ──
      const upiDailyLimit = Math.min(
        state.records?.upiLimits?.dailyPaise || config.limits.globalMaxUpiLimitPaise,
        config.limits.globalMaxUpiLimitPaise
      );
      const todaySpent = getTodaysUpiSpending(customerId);
      const totalAfterPayment = todaySpent + amountPaise;

      if (totalAfterPayment > upiDailyLimit) {
        const remaining = Math.max(0, upiDailyLimit - todaySpent);
        playErrorTone();
        const limitMsg = lang === 'hi'
          ? `दैनिक UPI सीमा पार! आज ${formatINR(todaySpent)} खर्च हो चुके हैं। सीमा ${formatINR(upiDailyLimit)} है। शेष: ${formatINR(remaining)}`
          : `Daily UPI limit exceeded! You've spent ${formatINR(todaySpent)} today. Limit is ${formatINR(upiDailyLimit)}. Remaining: ${formatINR(remaining)}`;
        setError(limitMsg);
        if (state.settings.readAloud) {
          speak(
            lang === 'ta'
              ? 'தினசரி UPI வரம்பை தாண்டியது. தொகையைக் குறைக்கவும் அல்லது நாளை மீண்டும் முயற்சிக்கவும்.'
              : lang === 'hi'
              ? 'दैनिक UPI सीमा पार हो गई। कृपया राशि कम करें या कल प्रयास करें।'
              : 'Daily UPI limit exceeded. Please reduce the amount or try again tomorrow.',
            lang
          );
        }
        return;
      }

      setFlowState('verifying');

      setTimeout(() => {
        const txRef = String(Math.floor(100000000000 + Math.random() * 900000000000));
        const txId = `tx_${customerId}_${Date.now()}`;
        const now = new Date().toISOString();

        const newTx = {
          id: txId,
          customerId,
          date: now,
          direction: 'out',
          amountPaise,
          type: 'UPI',
          counterparty: payee.name,
          raw: `UPI/DR/${txRef}/${payee.name.toUpperCase().replace(/\s+/g, '')}/BANK`,
          ref: txRef,
          plain: {
            en: `You paid ${payee.name}`,
            hi: `आपने ${payee.name} को भुगतान किया`,
          },
          parts: [
            { token: 'UPI', key: 'upi' },
            { token: 'DR', key: 'dr' },
            { token: txRef, key: 'ref' },
          ],
          note,
        };

        addTransaction(newTx);

        const receiptData = {
          id: txId,
          reference: txRef,
          title: `Sent to ${payee.name}`,
          amountPaise,
          payee,
          date: now,
          note,
        };

        dispatch({ type: 'ADD_RECEIPT', payload: receiptData });
        setCreatedReceipt(receiptData);
        setFlowState('success');

        // Only announce name & amount — NO reference number in voice
        playSuccessChime();
        const successSpeech =
          lang === 'ta'
            ? `${payee.name}க்கு ${amountToSpeech(amountPaise, 'ta')} செலுத்தியது வெற்றிகரமானது.`
            : lang === 'hi'
            ? `${payee.name} को ${amountToSpeech(amountPaise, 'hi')} का भुगतान सफल रहा।`
            : `Payment of ${amountToSpeech(amountPaise, 'en')} to ${payee.name} was successful.`;
        speak(successSpeech, lang);

        setTimeout(() => {
          navigate(`/pay/receipt/${txId}`, {
            state: { receipt: receiptData },
            replace: true,
          });
        }, 1800);
      }, 1000);
    } else {
      playErrorTone();
      setError(t('core.signin.wrongPin') || `Wrong PIN. Demo PIN is ${config.demoPin}`);
      if (state.settings.readAloud) {
        speak(
          lang === 'ta'
            ? 'தவறான பின். மீண்டும் முயற்சிக்கவும்.'
            : lang === 'hi'
            ? 'गलत पिन। कृपया पुनः प्रयास करें।'
            : 'Incorrect PIN. Please try again.',
          lang
        );
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    /* Full-screen fixed layout — no scroll */
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--surface)',
      maxWidth: '480px',
      margin: '0 auto',
      zIndex: 10,
    }}>
      {/* Header */}
      <Header title={lang === 'hi' ? 'पिन से पुष्टि करें' : 'Confirm with PIN'} />

      {/* Step indicator */}
      <div style={{ padding: '8px 16px 0 16px', flexShrink: 0 }}>
        <StepHeader current={3} total={3} name={lang === 'hi' ? 'पिन दर्ज करें' : 'Enter PIN'} />
      </div>

      {/* Recipient + Amount chip (compact) */}
      <div style={{
        margin: '8px 16px',
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface-alt)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {lang === 'hi' ? 'भुगतान:' : 'Paying to:'}
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
            {payee.name}
          </div>
        </div>
        <Amount paise={amountPaise} size="large" />
      </div>

      {/* Main content area — flex 1 so it fills remaining space */}
      <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px 8px 16px' }}>

        {/* INPUT STATE */}
        {flowState === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Compact security notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}>
              <ShieldIcon size={13} />
              <span>
                {lang === 'hi'
                  ? 'पिन कभी न बोलें · डेमो PIN:'
                  : `Never speak your PIN · Demo PIN:`}
              </span>
              <code style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '0.8125rem' }}>
                {config.demoPin}
              </code>
            </div>

            <PinPad
              onSubmit={handlePinSubmit}
              error={error}
              title={lang === 'hi' ? '4 अंकों का PIN डालें' : 'Enter your 4-digit PIN'}
            />

            <button
              type="button"
              onClick={handleCancel}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
              className="interactive-tap"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel Payment'}
            </button>
          </div>
        )}

        {/* VERIFYING STATE */}
        {flowState === 'verifying' && (
          <div
            role="status"
            aria-live="assertive"
            className="animate-fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '4px solid var(--border)',
                  borderTopColor: 'var(--brand)',
                }}
                className="animate-spin-smooth"
              />
              <ShieldIcon size={32} style={{ color: 'var(--brand)' }} />
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'hi' ? 'भुगतान प्राधिकृत हो रहा है...' : 'Authorizing Payment...'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              {lang === 'hi' ? 'सुरक्षित बैंक प्रमाणीकरण' : 'Secured bank authentication in progress'}
            </p>
          </div>
        )}

        {/* YOUNG APPROVAL STATE — fullscreen overlay popup */}
        {flowState === 'young_approval' && (
          <div
            className="animate-fade-in"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '24px',
                padding: '28px 24px',
                width: '100%',
                maxWidth: '380px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
              }}
            >
              {/* Icon */}
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
                ⏳
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Approval Needed!
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', margin: 0 }}>
                Payment of{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{formatINR(amountPaise)}</strong>{' '}
                to <strong style={{ color: 'var(--text-primary)' }}>{payee.name}</strong> exceeds
                ₹5,000. A request has been sent to{' '}
                <strong style={{ color: 'var(--brand)' }}>Mom (Priya Sharma)</strong> for approval.
              </p>

              <div
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#fff7ed',
                  border: '1.5px solid #fed7aa',
                  fontSize: '0.8125rem',
                  color: '#92400e',
                  fontWeight: 600,
                }}
              >
                ⏱ Waiting for Mom's approval — the payment will process only after she approves.
              </div>

              <BigButton
                variant="primary"
                onClick={() => navigate('/')}
              >
                OK, Go to Home
              </BigButton>
              <BigButton
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel & Go Back
              </BigButton>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {flowState === 'success' && createdReceipt && (
          <div
            role="status"
            aria-live="assertive"
            className="animate-fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '12px',
            }}
          >
            <div
              className="animate-spring-pop"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                border: '3px solid #059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                boxShadow: '0 0 24px rgba(5, 150, 105, 0.2)',
              }}
            >
              <CheckIcon size={40} />
            </div>

            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#065f46', margin: 0 }} className="animate-slide-up">
              {lang === 'hi' ? 'भुगतान सफल!' : 'Payment Verified!'}
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
              {lang === 'hi'
                ? `${formatINR(amountPaise)} — ${payee.name} को`
                : `${formatINR(amountPaise)} sent to ${payee.name}`}
            </p>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              {lang === 'hi' ? 'रसीद खुल रही है...' : 'Redirecting to receipt...'}
            </p>

            <BigButton
              variant="primary"
              onClick={() => navigate(`/pay/receipt/${createdReceipt.id}`, {
                state: { receipt: createdReceipt },
                replace: true,
              })}
            >
              {lang === 'hi' ? 'रसीद देखें' : 'View Receipt Now'}
            </BigButton>
          </div>
        )}
      </div>
    </div>
  );
}
