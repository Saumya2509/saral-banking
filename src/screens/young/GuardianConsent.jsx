import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Toggle from '../../components/ui/Toggle';
import Notice from '../../components/ui/Notice';
import { ShieldIcon } from '../../components/icons/Icons';
import { useStore } from '../../store/index.js';
import { useT } from '../../i18n/index.js';

export default function GuardianConsent() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const t = useT();

  const [agreed, setAgreed] = useState(state.young?.consent?.given || false);

  const handleGiveConsent = () => {
    dispatch({
      type: 'SET_CONSENT',
      payload: true,
    });
    navigate('/');
  };

  return (
    <Screen
      title={t('young.consent.title') || 'Guardian consent'}
      mainAction={{
        label: 'Give guardian consent',
        disabled: !agreed,
        onClick: handleGiveConsent,
      }}
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-soft)',
            color: 'var(--brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <ShieldIcon size={32} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
          Supervised Account for Aarav
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          As Aarav's mother (Priya Sharma), your permission is required to enable digital banking features.
        </p>
      </div>

      <Notice type="info">
        You can view Aarav's account transactions, set a daily spending limit (default ₹1,000), and approve requests that exceed the limit.
      </Notice>

      <Card>
        <Toggle
          label={t('young.consent.agree') || 'I agree to supervise Aarav’s digital bank account'}
          checked={agreed}
          onChange={setAgreed}
        />
      </Card>
    </Screen>
  );
}
