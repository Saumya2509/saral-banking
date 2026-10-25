import React from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ListRow from '../../components/ui/ListRow';
import SaralAiLogo from '../../components/ui/SaralAiLogo';
import { MessageCircleIcon, BookIcon, ShieldIcon, FileTextIcon } from '../../components/icons/Icons';
import { useT } from '../../i18n/index.js';

export default function HelpHome() {
  const navigate = useNavigate();
  const t = useT();

  return (
    <Screen title={t('rec.help.title') || 'Help'}>
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
        }}
      >
        <ListRow
          icon={<SaralAiLogo size={24} animated />}
          title={t('rec.help.askQuestion') || 'Ask a question'}
          subtitle="Get clear answers to any banking or app questions"
          chevron
          onClick={() => navigate('/help/chat')}
        />

        <ListRow
          icon={<BookIcon size={24} className="text-emerald-600" />}
          title={t('rec.help.learn') || 'Learn'}
          subtitle="Understand accounts, interest, UPI, and common scams"
          chevron
          onClick={() => navigate('/learn')}
        />

        <ListRow
          icon={<ShieldIcon size={24} className="text-red-600" />}
          title={t('rec.help.reportFraud') || 'Report fraud'}
          subtitle="One-tap emergency block for cards & 24/7 national helpline"
          chevron
          onClick={() => navigate('/help/fraud')}
        />

        <ListRow
          icon={<FileTextIcon size={24} className="text-purple-600" />}
          title={t('rec.help.theStandard') || 'The standard'}
          subtitle="Our 5 fundamental promises for predictable banking"
          chevron
          onClick={() => navigate('/help/standard')}
        />
      </div>
    </Screen>
  );
}
