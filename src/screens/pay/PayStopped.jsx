import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import BigButton from '../../components/ui/BigButton';
import { ShieldIcon, PhoneIcon } from '../../components/icons/Icons';
import config from '../../data/config.js';
import { useI18n } from '../../i18n/index.js';

export default function PayStopped() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t } = useI18n();

  return (
    <Screen
      title={t('safety.stopped.title') || 'Payment stopped'}
      showBack={false}
      mainAction={{
        label: t('core.tab.home') || 'Go to home',
        onClick: () => navigate('/'),
      }}
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fffbeb',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <ShieldIcon size={36} />
        </div>

        <h2
          style={{
            fontSize: 'var(--font-size-title, 1.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          {t('safety.stopped.title') || 'We stopped this payment for your safety'}
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '360px', margin: '0 auto' }}>
          {lang === 'hi'
            ? 'यदि किसी अनजान व्यक्ति ने आपको कॉल या मैसेज पर पैसे भेजने को कहा था, तो यह एक धोखाधड़ी हो सकती है। कोई भी वास्तविक बैंक या अधिकारी आपसे तुरंत पैसे ट्रांसफर करने को नहीं कहता।'
            : 'If someone asked you to make this payment, it may be a scam. Real banks and officials will never pressure you to transfer money.'}
        </p>
      </div>

      {/* Official Helpline Card */}
      <Card style={{ backgroundColor: '#fffbeb', border: '1.5px solid var(--warning)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <PhoneIcon size={24} className="text-amber-700" />
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#92400e' }}>
            Call {config.helplines.cyber}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.4 }}>
          National Cyber Crime Helpline (available 24/7). If you shared your PIN or OTP, report it immediately.
        </p>
        <div style={{ marginTop: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#92400e' }}>
          Website: {config.helplines.site}
        </div>
      </Card>

      {/* Learn more link */}
      <div style={{ marginTop: '12px' }}>
        <BigButton variant="secondary" onClick={() => navigate('/learn')}>
          Learn how to spot common scams
        </BigButton>
      </div>
    </Screen>
  );
}
