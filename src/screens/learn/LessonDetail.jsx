import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Rich from '../../components/ui/Rich';
import ReadAloud, { useReadAloud } from '../../components/ui/ReadAloud';
import Notice from '../../components/ui/Notice';
import Amount from '../../components/ui/Amount';
import { getLesson } from '../../data/lessons.js';
import { findScam } from '../../data/scams.js';
import config from '../../data/config.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

export default function LessonDetail() {
  const { lessonId } = useParams();
  const { state } = useStore();
  const { lang } = useI18n();
  const { readAloud } = useReadAloud();

  const lesson = getLesson(lessonId);

  // If this is a scam lesson, get the full scam details
  const isSafetyLesson = lessonId?.startsWith('safety-');
  const scamId = isSafetyLesson ? lessonId.replace('safety-', '') : null;
  const scam = scamId ? findScam(scamId) : null;

  const title = lesson?.title?.[lang] || lesson?.title?.en || 'Lesson';
  const bodyText = lesson?.body?.[lang] || lesson?.body?.en || '';

  // Auto read-aloud in Simple mode
  useEffect(() => {
    if (state.settings.mode === 'simple' && bodyText) {
      readAloud(`${title}. ${bodyText}`);
    }
  }, [state.settings.mode, bodyText, title]);

  if (!lesson) {
    return (
      <Screen title="Lesson">
        <p>Lesson not found.</p>
      </Screen>
    );
  }

  const isChargesLesson = lessonId === 'sample-charges';

  return (
    <Screen title={title}>
      {/* Header card with Read Aloud */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {title}
          </h1>
          <ReadAloud text={`${title}. ${bodyText}`} />
        </div>
      </Card>

      {/* Main explanation with auto-detected terms */}
      <Card>
        <div style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
          <Rich text={bodyText} />
        </div>
      </Card>

      {/* Safety Scam Warning Checklist */}
      {scam && (
        <>
          <Card heading="Warning Signs to Watch For">
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(scam.signs?.[lang] || scam.signs?.en || []).map((sign, idx) => (
                <li key={idx} style={{ fontSize: '0.9375rem', lineHeight: 1.4 }}>
                  {sign}
                </li>
              ))}
            </ul>
          </Card>

          <Notice type="safety" title="What You Should Do">
            {scam.doThis?.[lang] || scam.doThis?.en}
          </Notice>
        </>
      )}

      {/* Sample Charges Breakdown */}
      {isChargesLesson && (
        <Card heading="Common Sample Charges">
          <Notice type="info">
            These are sample charges to help you understand banking fees. Your actual bank charges may differ.
          </Notice>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {config.sampleCharges.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.9375rem',
                }}
              >
                <span>{item.label[lang] || item.label.en}</span>
                <Amount paise={item.amountPaise} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </Screen>
  );
}
