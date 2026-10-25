import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import DayGroupHeader from '../../components/records/DayGroupHeader';
import Amount from '../../components/ui/Amount';
import Field from '../../components/ui/Field';
import Segmented from '../../components/ui/Segmented';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import {
  ArrowDown,
  ArrowUp,
  SendIcon,
  CreditCardIcon,
  ChevronRightIcon,
  ShieldIcon,
  ClockIcon,
} from '../../components/icons/Icons';
import { getTransactions } from '../../utils/ledger.js';
import { formatTime } from '../../utils/dates.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

export default function History() {
  const navigate = useNavigate();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const allTransactions = getTransactions(customerId);

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'in' | 'out'

  // Filtered transactions
  const filtered = useMemo(() => {
    return allTransactions.filter((tx) => {
      // Direction filter
      if (filterType === 'in' && tx.direction !== 'in') return false;
      if (filterType === 'out' && tx.direction !== 'out') return false;

      // Text query filter
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesCounterparty = tx.counterparty?.toLowerCase().includes(q);
        const matchesPlainEn = tx.plain?.en?.toLowerCase().includes(q);
        const matchesPlainHi = tx.plain?.hi?.toLowerCase().includes(q);
        const matchesRaw = tx.raw?.toLowerCase().includes(q);
        const matchesRef = tx.ref?.toLowerCase().includes(q);
        const matchesType = tx.type?.toLowerCase().includes(q);
        return matchesCounterparty || matchesPlainEn || matchesPlainHi || matchesRaw || matchesRef || matchesType;
      }
      return true;
    });
  }, [allTransactions, filterType, query]);

  // Group by day YYYY-MM-DD
  const groupedByDay = useMemo(() => {
    const groups = {};
    for (const tx of filtered) {
      const dayKey = tx.date.split('T')[0];
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(tx);
    }
    return groups;
  }, [filtered]);

  // Totals for filtered transactions
  const totalIn = useMemo(() => {
    return filtered
      .filter((tx) => tx.direction === 'in')
      .reduce((sum, tx) => sum + tx.amountPaise, 0);
  }, [filtered]);

  const totalOut = useMemo(() => {
    return filtered
      .filter((tx) => tx.direction === 'out')
      .reduce((sum, tx) => sum + tx.amountPaise, 0);
  }, [filtered]);

  // Helper for visual badge icon based on transaction method & direction
  const renderTxIcon = (tx) => {
    const isCredit = tx.direction === 'in';
    const typeUpper = (tx.type || '').toUpperCase();

    if (typeUpper === 'PENSION') {
      return (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Pension Credit"
        >
          <ShieldIcon size={20} />
        </div>
      );
    }

    if (typeUpper === 'ATM') {
      return (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#f3e8ff',
            color: '#7e22ce',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="ATM Cash Withdrawal"
        >
          <CreditCardIcon size={20} />
        </div>
      );
    }

    if (typeUpper === 'POS') {
      return (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Point of Sale / Card"
        >
          <CreditCardIcon size={20} />
        </div>
      );
    }

    if (isCredit) {
      return (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Credit"
        >
          <ArrowDown size={20} />
        </div>
      );
    }

    // Default Debit / UPI
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title="Payment"
      >
        <SendIcon size={18} />
      </div>
    );
  };

  return (
    <Screen
      title={t('rec.history.title') || 'Transaction History'}
      mainAction={{
        label: t('core.btn.getStatement') || 'Download Statement',
        onClick: () => navigate('/statements'),
      }}
    >
      {/* Search Field with Clear Button */}
      <div style={{ position: 'relative' }}>
        <Field
          placeholder={t('rec.history.search') || 'Search name, reference, or type...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.125rem',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <Segmented
        value={filterType}
        onChange={setFilterType}
        options={[
          { value: 'all', label: `${t('rec.history.filterAll') || 'All'} (${allTransactions.length})` },
          { value: 'in', label: t('rec.history.filterIn') || 'Money in' },
          { value: 'out', label: t('rec.history.filterOut') || 'Money out' },
        ]}
      />

      {/* Financial Summary Card */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.875rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('core.label.moneyIn') || 'Total Received'}
            </div>
            <div style={{ marginTop: '2px' }}>
              <Amount paise={totalIn} direction="in" />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('core.label.moneyOut') || 'Total Spent'}
            </div>
            <div style={{ marginTop: '2px' }}>
              <Amount paise={totalOut} direction="out" />
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Stream Grouped By Day */}
      {Object.keys(groupedByDay).length === 0 ? (
        <EmptyState
          message={
            query
              ? `No transactions matching "${query}".`
              : 'No transactions match the selected filter.'
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
              }}
            >
              {/* Day Header with count */}
              <DayGroupHeader date={dayKey} lang={lang} count={txList.length} />

              {/* Transactions for this day */}
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
                      {/* Left: Icon Badge */}
                      <div style={{ marginRight: '12px', flexShrink: 0 }}>
                        {renderTxIcon(tx)}
                      </div>

                      {/* Middle: Name, Type Pill, Description, and Time */}
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        {/* Top Line: Counterparty */}
                        <div
                          style={{
                            fontSize: 'var(--font-size-label, 0.9375rem)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                            wordBreak: 'break-word',
                          }}
                        >
                          {tx.counterparty}
                        </div>

                        {/* Bottom Line: Method Pill + Plain Description + Time */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginTop: '3px',
                            fontSize: 'var(--font-size-small, 0.8125rem)',
                            color: 'var(--text-muted)',
                            lineHeight: 1.3,
                          }}
                        >
                          {/* Method Badge Pill */}
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--surface-alt)',
                              border: '1px solid var(--border)',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: isCredit ? '#15803d' : 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.4px',
                            }}
                          >
                            {tx.type || (isCredit ? 'CREDIT' : 'DEBIT')}
                          </span>

                          {/* Time */}
                          {txTime && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {txTime}
                            </span>
                          )}

                          {/* Description summary */}
                          {plainDesc && (
                            <>
                              <span style={{ color: 'var(--border)' }}>•</span>
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '160px',
                                }}
                              >
                                {plainDesc}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Amount & Status */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          flexShrink: 0,
                          marginLeft: 'auto',
                        }}
                      >
                        <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                          <Amount paise={tx.amountPaise} direction={tx.direction} />
                        </div>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: isCredit ? 'var(--success)' : 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {isCredit ? (lang === 'hi' ? 'प्राप्त' : 'Received') : (lang === 'hi' ? 'भुगतान' : 'Paid')}
                        </span>
                      </div>

                      {/* Chevron affordance */}
                      <div style={{ marginLeft: '6px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        <ChevronRightIcon size={16} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Screen>
  );
}
