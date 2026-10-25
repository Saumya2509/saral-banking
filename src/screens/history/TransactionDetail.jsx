import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Amount from '../../components/ui/Amount';
import Term from '../../components/ui/Term';
import Sheet from '../../components/ui/Sheet';
import Field from '../../components/ui/Field';
import BigButton from '../../components/ui/BigButton';
import PaymentScreenshotModal from '../../components/ui/PaymentScreenshotModal';
import { CopyIcon, CheckIcon, AlertCircleIcon, CameraIcon, ShareIcon } from '../../components/icons/Icons';
import { getTransactions } from '../../utils/ledger.js';
import { formatDate, formatTime } from '../../utils/dates.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

const EXPLANATIONS = {
  upi: { en: 'Paid through Unified Payments Interface (UPI)', hi: 'यूपीआई के माध्यम से भुगतान' },
  neft: { en: 'Sent through National Electronic Funds Transfer (NEFT)', hi: 'एनईएफटी के जरिए भेजा गया' },
  imps: { en: 'Sent instantly through IMPS', hi: 'आईएमपीएस के जरिए तुरंत भेजा गया' },
  dr: { en: 'Money went OUT of your account (Debit)', hi: 'खाते से पैसा कटा (डेबिट)' },
  cr: { en: 'Money came INTO your account (Credit)', hi: 'खाते में पैसा आया (क्रेडिट)' },
  ref: { en: 'Unique reference number for tracking this payment', hi: 'इस भुगतान की विशिष्ट संदर्भ संख्या' },
  counterparty: { en: 'The recipient or sender of the money', hi: 'पैसा पाने या भेजने वाला व्यक्ति/व्यापारी' },
  bank: { en: 'The recipient bank or branch', hi: 'संबंधित बैंक' },
  wdl: { en: 'Cash withdrawal from ATM', hi: 'एटीएम से नकदी निकासी' },
  atm: { en: 'Cash machine transaction', hi: 'एटीएम मशीन से लेन-देन' },
  pos: { en: 'Card swipe at merchant shop', hi: 'दुकान पर कार्ड द्वारा भुगतान' },
  int: { en: 'Interest credited by bank on your balance', hi: 'बैंक द्वारा दिया गया ब्याज' },
  chg: { en: 'Bank service charge or fee', hi: 'बैंक सेवा शुल्क' },
  pension: { en: 'Monthly pension deposit', hi: 'मासिक पेंशन जमा' },
};

export default function TransactionDetail() {
  const { txId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const tx = getTransactions(customerId).find((t) => t.id === txId);

  const [copied, setCopied] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [problemSheetOpen, setProblemSheetOpen] = useState(false);
  const [problemType, setProblemType] = useState('wrong-amount');
  const [problemNote, setProblemNote] = useState('');

  if (!tx) {
    return (
      <Screen title="Transaction details">
        <p>Transaction not found.</p>
      </Screen>
    );
  }

  const handleCopyRef = () => {
    if (tx.ref && navigator.clipboard) {
      navigator.clipboard.writeText(tx.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReportProblem = () => {
    dispatch({
      type: 'ADD_PROBLEM_REPORT',
      payload: {
        id: `pr_${Date.now()}`,
        txId: tx.id,
        txRef: tx.ref,
        type: problemType,
        note: problemNote,
        reportedAt: new Date().toISOString(),
      },
    });
    alert('Problem report submitted. Our support team will review this within 24 hours.');
    setProblemSheetOpen(false);
  };

  return (
    <Screen
      title="Transaction detail"
      mainAction={{
        label: t('core.btn.reportProblem') || 'Report a problem with this',
        variant: 'secondary',
        onClick: () => setProblemSheetOpen(true),
      }}
    >
      {/* Top Amount & Counterparty Card */}
      <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
        <Amount paise={tx.amountPaise} direction={tx.direction} size="display" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '8px' }}>
          {tx.counterparty}
        </h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {formatDate(tx.date, lang)} at {formatTime(tx.date)}
        </div>

        {/* Reference Number */}
        {tx.ref && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '4px 10px',
              backgroundColor: 'var(--surface)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '0.8125rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Ref:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.ref}</span>
            <button
              type="button"
              onClick={handleCopyRef}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--brand)' }}
              title="Copy reference"
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            </button>
          </div>
        )}

        {/* Screenshot Share Button */}
        {tx.direction === 'out' && (
          <div style={{ marginTop: '16px', width: '100%' }}>
            <button
              type="button"
              onClick={() => setShowScreenshot(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--brand-soft)',
                color: 'var(--brand)',
                border: '1px solid var(--brand)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              className="interactive-tap"
            >
              <CameraIcon size={18} />
              <span>{lang === 'hi' ? 'दुकानदार को स्क्रीनशॉट भेजें' : 'Share Screenshot'}</span>
            </button>
          </div>
        )}
      </Card>

      {/* Raw Bank Description Card */}
      <Card heading={t('rec.history.detail.rawDescription') || 'Raw bank entry'}>
        <div
          style={{
            fontFamily: 'monospace',
            backgroundColor: 'var(--surface)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            border: '1px solid var(--border)',
            wordBreak: 'break-all',
          }}
        >
          {tx.raw}
        </div>
      </Card>

      {/* Decoded & Explained Card */}
      <Card heading={t('rec.history.detail.explained') || 'What this means'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tx.parts?.map((part, idx) => {
            const explanation =
              EXPLANATIONS[part.key]?.[lang] ||
              EXPLANATIONS[part.key]?.en ||
              'Banking transaction identifier';

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  fontSize: '0.9375rem',
                  borderBottom: idx < tx.parts.length - 1 ? '1px solid var(--border)' : 'none',
                  paddingBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    backgroundColor: 'var(--surface)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Term id={part.key}>{part.token}</Term>
                </span>
                <span style={{ color: 'var(--text-primary)', flex: 1 }}>{explanation}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Report Problem Sheet */}
      <Sheet
        isOpen={problemSheetOpen}
        onClose={() => setProblemSheetOpen(false)}
        title="Report a Problem"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9375rem', marginBottom: '6px' }}>
              What is the issue?
            </label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                padding: '0 12px',
                backgroundColor: 'var(--surface)',
                fontSize: '1rem',
              }}
            >
              <option value="wrong-amount">Amount is incorrect</option>
              <option value="unrecognized">I do not recognize this payee</option>
              <option value="double-charge">Deducted twice</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <Field
            label="Provide additional details"
            type="textarea"
            placeholder="Tell us what happened..."
            value={problemNote}
            onChange={(e) => setProblemNote(e.target.value)}
          />

          <div style={{ marginTop: '12px' }}>
            <BigButton variant="primary" onClick={handleReportProblem}>
              Submit report
            </BigButton>
          </div>
        </div>
      </Sheet>

      {/* Payment Screenshot Modal */}
      <PaymentScreenshotModal
        isOpen={showScreenshot}
        onClose={() => setShowScreenshot(false)}
        receiptData={{
          amountPaise: tx.amountPaise,
          payee: { name: tx.counterparty },
          date: tx.date,
          reference: tx.ref,
          note: tx.note,
        }}
      />
    </Screen>
  );
}
