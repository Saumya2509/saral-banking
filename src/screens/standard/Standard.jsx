import React from 'react';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Rich from '../../components/ui/Rich';
import { useI18n } from '../../i18n/index.js';

export default function Standard() {
  const { lang, t } = useI18n();

  const rules = [
    {
      num: 1,
      title: lang === 'hi' ? 'हर स्क्रीन पर वही पांच टैब' : 'Same five tabs on every screen',
      desc:
        lang === 'hi'
          ? 'होम, पे, हिस्ट्री, सर्विसेज और हेल्प हमेशा एक ही जगह पर नीचे उपलब्ध रहते हैं।'
          : 'Home, Pay, History, Services, and Help are always at the bottom in the exact same order.',
    },
    {
      num: 2,
      title: lang === 'hi' ? 'हर चीज़ की अपनी तय जगह' : 'Same place for the same thing',
      desc:
        lang === 'hi'
          ? 'बैलेंस हमेशा स्क्रीन के सबसे ऊपर दिखता है, और मुख्य एक्शन बटन हमेशा सबसे नीचे।'
          : 'Your total balance is always at the top of the screen. The primary action button is always at the bottom.',
    },
    {
      num: 3,
      title: lang === 'hi' ? 'आसान और जाने-पहचाने शब्द' : 'Same clear words',
      desc:
        lang === 'hi'
          ? '"फंड ट्रांसफर" की जगह "पैसे भेजें" (Send money) लिखा होता है। कठिन बैंकिंग शब्दों पर टैप करके अर्थ देख सकते हैं।'
          : 'We use everyday words like "Send money" instead of confusing terms like "Fund Transfer". Tap any underlined banking term to see its plain meaning.',
    },
    {
      num: 4,
      title: lang === 'hi' ? 'हमेशा तीन कदम' : 'Same three steps',
      desc:
        lang === 'hi'
          ? 'कोई भी भुगतान केवल 3 कदमों में होता है: 1. विवरण भरें → 2. समीक्षा करें → 3. पिन डालें।'
          : 'Every payment follows the predictable flow: Step 1 Fill in → Step 2 Review → Step 3 Confirm with PIN.',
    },
    {
      num: 5,
      title: lang === 'hi' ? 'बैंक बदलने पर सिर्फ रंग बदलते हैं' : 'Bank switcher changes only colours',
      desc:
        lang === 'hi'
          ? 'चाहे सरल बैंक हो, जनता बैंक या देश बैंक - लेआउट और नियम बिल्कुल समान रहते हैं।'
          : 'Whether you use Saral Bank, Janata Bank, or Desh Bank, the layout and buttons stay identical. Only brand colors adapt.',
    },
  ];

  return (
    <Screen title={t('rec.help.theStandard') || 'The standard'}>
      <div style={{ marginBottom: '8px' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {lang === 'hi'
            ? 'सरल बैंकिंग का मानक सुनिश्चित करता है कि बैंकिंग हर नागरिक के लिए सहज, सुरक्षित और आसान हो।'
            : 'The Saral Banking Standard guarantees consistent, accessible, and safe banking for all users.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rules.map((rule) => (
          <Card key={rule.num}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand)',
                  color: 'var(--brand-contrast, #ffffff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  flexShrink: 0,
                }}
              >
                {rule.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {rule.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <Rich text={rule.desc} />
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
