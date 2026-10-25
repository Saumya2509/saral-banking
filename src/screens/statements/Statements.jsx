import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Segmented from '../../components/ui/Segmented';
import Card from '../../components/ui/Card';
import Amount from '../../components/ui/Amount';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import EmptyState from '../../components/ui/EmptyState';
import DayGroupHeader from '../../components/records/DayGroupHeader';
import { DownloadIcon, PrinterIcon } from '../../components/icons/Icons';
import { getStatementSummary } from '../../utils/ledger.js';
import { getToday, formatDate, formatTime } from '../../utils/dates.js';
import { getCustomer } from '../../data/customers.js';
import banks from '../../data/banks.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';

export default function Statements() {
  const navigate = useNavigate();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const bank = banks[state.settings.bankId] || banks.saral;

  // Periods: 'all' | '1m' | '3m' | '6m' | 'custom'
  const [period, setPeriod] = useState('all');
  const today = getToday();

  const defaultFrom = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  }, [today]);

  const defaultTo = useMemo(() => {
    return today.toISOString().split('T')[0];
  }, [today]);

  const [customFrom, setCustomFrom] = useState(defaultFrom);
  const [customTo, setCustomTo] = useState(defaultTo);

  // Calculate actual from and to dates based on selection
  const { fromDateStr, toDateStr } = useMemo(() => {
    const end = today.toISOString().split('T')[0];
    const d = new Date(today);
    if (period === 'all') {
      return { fromDateStr: '2020-01-01', toDateStr: end };
    }
    if (period === '1m') {
      d.setMonth(d.getMonth() - 1);
    } else if (period === '3m') {
      d.setMonth(d.getMonth() - 3);
    } else if (period === '6m') {
      d.setMonth(d.getMonth() - 6);
    } else {
      return { fromDateStr: customFrom, toDateStr: customTo };
    }
    return { fromDateStr: d.toISOString().split('T')[0], toDateStr: end };
  }, [period, today, customFrom, customTo]);

  // Compute statement summary
  const summary = useMemo(() => {
    return getStatementSummary(customerId, fromDateStr, toDateStr);
  }, [customerId, fromDateStr, toDateStr]);

  // Group transactions by day YYYY-MM-DD
  const groupedByDay = useMemo(() => {
    const groups = {};
    for (const tx of summary.transactions) {
      const dayKey = tx.date.split('T')[0];
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(tx);
    }
    return groups;
  }, [summary.transactions]);

  // Download CSV logic with UTF-8 BOM
  const handleDownloadCsv = () => {
    const rows = [
      ['Date', 'Description', 'Reference', 'Money In (INR)', 'Money Out (INR)', 'Type'],
    ];

    for (const tx of summary.transactions) {
      const formattedDateStr = formatDate(tx.date, lang);
      const desc = tx.plain?.[lang] || tx.plain?.en || tx.counterparty;
      const ref = tx.ref || '';
      const inVal = tx.direction === 'in' ? (tx.amountPaise / 100).toFixed(2) : '';
      const outVal = tx.direction === 'out' ? (tx.amountPaise / 100).toFixed(2) : '';
      rows.push([formattedDateStr, desc, ref, inVal, outVal, tx.type]);
    }

    const csvContent =
      '\uFEFF' +
      rows
        .map((row) =>
          row
            .map((val) => {
              const str = String(val ?? '');
              return str.includes(',') || str.includes('"') || str.includes('\n')
                ? `"${str.replace(/"/g, '""')}"`
                : str;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Statement_${customer.name.en.replace(/\s+/g, '_')}_${period === 'all' ? 'All_History' : `${fromDateStr}_to_${toDateStr}`}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Screen
      title={t('rec.statements.title') || 'Statements'}
      mainAction={{
        label: t('rec.statements.downloadCsv') || 'Download CSV',
        icon: <DownloadIcon size={20} />,
        onClick: handleDownloadCsv,
      }}
      secondaryAction={{
        label: t('rec.statements.printPdf') || 'Print / Save as PDF',
        onClick: () =>
          navigate(
            `/statements/print?from=${encodeURIComponent(fromDateStr)}&to=${encodeURIComponent(
              toDateStr
            )}`
          ),
      }}
    >
      {/* Period Selector — Compact & Mobile-Optimized */}
      <Segmented
        value={period}
        onChange={setPeriod}
        options={[
          { value: 'all', label: lang === 'hi' ? 'सभी' : lang === 'ta' ? 'அனைத்தும்' : 'All' },
          { value: '1m', label: lang === 'hi' ? '1 माह' : lang === 'ta' ? '1 மாதம்' : '1 Month' },
          { value: '3m', label: lang === 'hi' ? '3 माह' : lang === 'ta' ? '3 மாதங்கள்' : '3 Months' },
          { value: '6m', label: lang === 'hi' ? '6 माह' : lang === 'ta' ? '6 மாதங்கள்' : '6 Months' },
          { value: 'custom', label: lang === 'hi' ? 'कस्टम' : lang === 'ta' ? 'விருப்பத் தேதி' : 'Custom' },
        ]}
      />

      {period === 'custom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field
            label={lang === 'hi' ? 'प्रारंभ तिथि' : lang === 'ta' ? 'தொடக்கத் தேதி' : 'From date'}
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
          />
          <Field
            label={lang === 'hi' ? 'अंतिम तिथि' : lang === 'ta' ? 'முடிவுத் தேதி' : 'To date'}
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
          />
        </div>
      )}

      {/* Statement Summary Card */}
      <Card heading={lang === 'hi' ? 'स्टेटमेंट सारांश' : lang === 'ta' ? 'கணக்கு அறிக்கை சுருக்கம்' : 'Statement Summary'}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {bank.name[lang] || bank.name.en} · A/C {customer.accountNumber}
          <br />
          {period === 'all'
            ? lang === 'hi'
              ? 'अवधि: खाता निर्माण से आज तक (सम्पूर्ण इतिहास)'
              : lang === 'ta'
              ? 'காலம்: கணக்கு தொடங்கியது முதல் இன்று வரை (முழு வரலாறு)'
              : 'Period: Account opening to date (All History)'
            : `Period: ${formatDate(fromDateStr, lang)} to ${formatDate(toDateStr, lang)}`}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lang === 'hi' ? 'आरंभिक शेष' : lang === 'ta' ? 'தொடக்க இருப்பு' : 'Opening balance'}
            </div>
            <div style={{ marginTop: '2px', fontWeight: 700 }}>
              <Amount paise={summary.openingPaise} />
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lang === 'hi' ? 'अंतिम शेष' : lang === 'ta' ? 'முடிவு இருப்பு' : 'Closing balance'}
            </div>
            <div style={{ marginTop: '2px', fontWeight: 700 }}>
              <Amount paise={summary.closingPaise} />
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lang === 'hi' ? 'कुल प्राप्त राशि (In)' : lang === 'ta' ? 'மொத்த வரவு (In)' : 'Total Received (In)'}
            </div>
            <div style={{ marginTop: '2px', fontWeight: 700, color: '#059669' }}>
              <Amount paise={summary.inPaise} direction="in" />
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-alt)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lang === 'hi' ? 'कुल खर्च राशि (Out)' : lang === 'ta' ? 'மொத்த செலவு (Out)' : 'Total Spent (Out)'}
            </div>
            <div style={{ marginTop: '2px', fontWeight: 700, color: 'var(--danger)' }}>
              <Amount paise={summary.outPaise} direction="out" />
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand)' }}>
          ✓ {summary.transactions.length}{' '}
          {lang === 'hi' ? 'लेन-देन इस अवधि में' : lang === 'ta' ? 'பரிவர்த்தனைகள் இந்த அறிக்கையில்' : 'transactions in this statement'}
        </div>
      </Card>

      {/* ALL TRANSACTION HISTORY IN STATEMENT */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>
            {lang === 'hi'
              ? `स्टेटमेंट इतिहास सूची (${summary.transactions.length})`
              : lang === 'ta'
              ? `அறிக்கை பரிவர்த்தனைகள் (${summary.transactions.length})`
              : `Statement History Entries (${summary.transactions.length})`}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'hi' ? 'नवीनतम पहले' : lang === 'ta' ? 'புதியவை முதலில்' : 'Newest first'}
          </span>
        </div>

        {summary.transactions.length === 0 ? (
          <EmptyState
            message={
              lang === 'hi'
                ? 'इस अवधि के लिए कोई लेन-देन नहीं मिला।'
                : 'No transactions found for this statement period.'
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(groupedByDay).map(([dayKey, txList]) => (
              <div
                key={dayKey}
                style={{
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }}
              >
                {/* Day Header with count */}
                <DayGroupHeader date={dayKey} lang={lang} count={txList.length} />

                {/* Transaction Rows for this day */}
                <div>
                  {txList.map((tx, idx) => {
                    const isLast = idx === txList.length - 1;
                    const isCredit = tx.direction === 'in';
                    const plainDesc = tx.plain?.[lang] || tx.plain?.en || '';
                    const txTime = formatTime(tx.date);

                    return (
                      <div
                        key={tx.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/history/${tx.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/history/${tx.id}`);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 14px',
                          borderBottom: isLast ? 'none' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        className="interactive-tap hover:bg-slate-50"
                      >
                        {/* Direction Arrow Badge */}
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: isCredit ? '#ecfdf5' : '#fee2e2',
                            color: isCredit ? '#059669' : '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            flexShrink: 0,
                            fontWeight: 700,
                            fontSize: '1.125rem',
                          }}
                        >
                          {isCredit ? '↓' : '↑'}
                        </div>

                        {/* Middle: Details */}
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                          <div
                            style={{
                              fontSize: '0.9375rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              lineHeight: 1.35,
                              wordBreak: 'break-word',
                            }}
                          >
                            {tx.counterparty}
                          </div>

                          {plainDesc && (
                            <div
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-muted)',
                                marginTop: '1px',
                                lineHeight: 1.3,
                              }}
                            >
                              {plainDesc}
                            </div>
                          )}

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '3px',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <span
                              style={{
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--surface-alt)',
                                border: '1px solid var(--border)',
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                              }}
                            >
                              {tx.type}
                            </span>
                            <span>{txTime}</span>
                            {tx.ref && <span>· #{tx.ref.slice(-4)}</span>}
                          </div>
                        </div>

                        {/* Right: Amount */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: isCredit ? '#059669' : 'var(--text-primary)',
                            }}
                          >
                            {isCredit ? '+' : '−'}{formatINR(tx.amountPaise)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Help Tip */}
      <div style={{ marginTop: '16px' }}>
        <Notice type="info" title={lang === 'hi' ? 'पीडीएफ कैसे सुरक्षित करें' : 'How to save as PDF'}>
          {lang === 'hi'
            ? 'नीचे "Print / Save as PDF" पर टैप करें। प्रिंट विंडो में "Save as PDF" चुनें।'
            : 'Tap "Print / Save as PDF" below. In the print dialog, select "Save as PDF" as the destination printer.'}
        </Notice>
      </div>
    </Screen>
  );
}
