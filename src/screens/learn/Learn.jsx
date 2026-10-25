import React from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ListRow from '../../components/ui/ListRow';
import { BookIcon, ShieldIcon } from '../../components/icons/Icons';
import { getLessons } from '../../data/lessons.js';
import { useI18n } from '../../i18n/index.js';

export default function Learn() {
  const navigate = useNavigate();
  const { lang, t } = useI18n();

  const allLessons = getLessons();
  const basics = allLessons.filter((l) => l.category === 'basics');
  const safety = allLessons.filter((l) => l.category === 'safety');

  return (
    <Screen title={t('rec.learn.title') || 'Learn'}>
      {/* Basics Section */}
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
          {t('rec.learn.basics') || 'Banking basics'}
        </h2>
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
          }}
        >
          {basics.map((lesson) => (
            <ListRow
              key={lesson.id}
              icon={<BookIcon size={20} />}
              title={lesson.title[lang] || lesson.title.en}
              chevron
              onClick={() => navigate(`/learn/${lesson.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Safety Section */}
      <div style={{ marginTop: '16px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
          {t('rec.learn.safety') || 'Stay safe from fraud'}
        </h2>
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
          }}
        >
          {safety.map((lesson) => (
            <ListRow
              key={lesson.id}
              icon={<ShieldIcon size={20} className="text-amber-600" />}
              title={lesson.title[lang] || lesson.title.en}
              chevron
              onClick={() => navigate(`/learn/${lesson.id}`)}
            />
          ))}
        </div>
      </div>
    </Screen>
  );
}
