import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import BigButton from '../../components/ui/BigButton';
import Notice from '../../components/ui/Notice';
import Receipt from '../../components/ui/Receipt';
import { ShieldIcon, PhoneIcon } from '../../components/icons/Icons';
import config from '../../data/config.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

export default function ReportFraud() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const isBlocked = state.records?.cardState?.blocked || false;
  const [justBlocked, setJustBlocked] = useState(false);

  const handleBlockAll = () => {
    dispatch({ type: 'BLOCK_CARD' });
    dispatch({ type: 'BLOCK_UPI' });
    setJustBlocked(true);
  };

  const handleUnblock = () => {
    dispatch({ type: 'UNBLOCK_CARD' });
    dispatch({ type: 'UNBLOCK_UPI' });
    setJustBlocked(false);
  };

  if (justBlocked) {
    return (
      <Screen title={t('rec.help.fraud.title') || 'Emergency block'} hideTabBar>
        <Receipt
          title="Your card and UPI have been blocked"
          subtitle="All outgoing payments from your card and UPI are now halted immediately."
          reference={`BLOCK-${Math.floor(100000 + Math.random() * 900000)}`}
          items={[
            { label: 'Debit card status', value: 'Blocked' },
            { label: 'UPI payments status', value: 'Blocked' },
            { label: 'Next recommended step', value: 'Call 1930 to file cyber report' },
          ]}
          onDone={() => navigate('/')}
        />
      </Screen>
    );
  }

  return (
    <Screen title={t('rec.help.fraud.title') || 'Report fraud'}>
      {/* Calm reassurance */}
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <ShieldIcon size={32} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
          Stop Unauthorized Payments Immediately
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '360px', margin: '0 auto' }}>
          {lang === 'hi'
            ? 'यदि आपको लगता है कि किसी ने आपका खाता या फोन एक्सेस कर लिया है, तो एक टैप से अपने कार्ड और यूपीआई को ब्लॉक करें।'
            : 'If you suspect fraud or shared a PIN/OTP by mistake, blocking your card and UPI stops any further money from going out.'}
        </p>
      </div>

      {/* One-Tap Emergency Action */}
      {isBlocked ? (
        <Card style={{ backgroundColor: '#ecfdf5', border: '1.5px solid var(--success)' }}>
          <Notice type="success" title="Protection Active">
            Your debit card and UPI are currently blocked. No payments can be made.
          </Notice>
          <BigButton variant="secondary" onClick={handleUnblock}>
            Unblock card & UPI
          </BigButton>
        </Card>
      ) : (
        <BigButton variant="danger" onClick={handleBlockAll}>
          {t('rec.help.fraud.blockAll') || 'Block my card and UPI now'}
        </BigButton>
      )}

      {/* 24/7 National Cybercrime Helpline */}
      <Card style={{ marginTop: '8px', border: '1.5px solid var(--border)' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
          National Cyber Fraud Helpline (24/7 Free)
        </div>
        <div
          style={{
            fontSize: 'var(--font-size-display, 2rem)',
            fontWeight: 800,
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <PhoneIcon size={28} />
          <span>{config.helplines.cyber}</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
          Official portal: <strong>{config.helplines.site}</strong>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
          Reporting within 2-3 hours increases the chances of freezing stolen funds.
        </p>
      </Card>
    </Screen>
  );
}
