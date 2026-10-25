import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getStatementSummary } from '../../utils/ledger.js';
import { getToday, formatDate } from '../../utils/dates.js';
import { getCustomer } from '../../data/customers.js';
import banks from '../../data/banks.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';
import { ArrowLeft, PrinterIcon } from '../../components/icons/Icons';

export default function StatementPrint() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { state } = useStore();
  const { lang } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const bank = banks[state.settings.bankId] || banks.saral;

  const today = getToday();
  const defaultFrom = new Date(today);
  defaultFrom.setMonth(defaultFrom.getMonth() - 1);

  const fromDateStr = params.get('from') || defaultFrom.toISOString().split('T')[0];
  const toDateStr = params.get('to') || today.toISOString().split('T')[0];

  const summary = useMemo(() => {
    return getStatementSummary(customerId, fromDateStr, toDateStr);
  }, [customerId, fromDateStr, toDateStr]);

  // Compute running balance in chronological order
  const transactionsWithRunningBalance = useMemo(() => {
    // summary.transactions are newest first, let's reverse to compute forward
    const chronological = [...summary.transactions].reverse();
    let running = summary.openingPaise;

    const computed = chronological.map((tx) => {
      if (tx.direction === 'in') {
        running += tx.amountPaise;
      } else {
        running -= tx.amountPaise;
      }
      return { ...tx, runningBalancePaise: running };
    });

    return computed.reverse(); // back to newest first for display
  }, [summary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
      className="print-page"
    >
      {/* Top action bar (hidden during print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--brand)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          <ArrowLeft size={20} />
          <span>Back to app</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--brand)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <PrinterIcon size={18} />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Official Statement Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px 0' }}>
            {bank.name.en}
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#475569' }}>
            Branch: {customer.branch.en} · IFSC: {customer.ifsc}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
            Account Holder: <strong>{customer.name.en}</strong> · A/C: <strong>{customer.accountNumber}</strong>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 600 }}>Statement Period</div>
          <div style={{ color: '#475569' }}>
            {fromDateStr === '2020-01-01'
              ? `All History (up to ${formatDate(toDateStr, 'en')})`
              : `${formatDate(fromDateStr, 'en')} – ${formatDate(toDateStr, 'en')}`}
          </div>
        </div>
      </div>

      {/* Balance Summary Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '24px',
          backgroundColor: '#f8fafc',
          fontSize: '0.875rem',
        }}
      >
        <div>
          <div style={{ color: '#64748b' }}>Opening Balance</div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{formatINR(summary.openingPaise)}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Total Deposits (In)</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#059669' }}>
            +{formatINR(summary.inPaise)}
          </div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Total Withdrawals (Out)</div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>-{formatINR(summary.outPaise)}</div>
        </div>
        <div>
          <div style={{ color: '#64748b' }}>Closing Balance</div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{formatINR(summary.closingPaise)}</div>
        </div>
      </div>

      {/* Transaction Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #000000', textAlign: 'left' }}>
            <th style={{ padding: '8px 4px' }}>Date</th>
            <th style={{ padding: '8px 4px' }}>Description / Payee</th>
            <th style={{ padding: '8px 4px' }}>Ref / Mode</th>
            <th style={{ padding: '8px 4px', textAlign: 'right' }}>Withdrawal (₹)</th>
            <th style={{ padding: '8px 4px', textAlign: 'right' }}>Deposit (₹)</th>
            <th style={{ padding: '8px 4px', textAlign: 'right' }}>Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {transactionsWithRunningBalance.map((tx) => (
            <tr key={tx.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 4px', whiteSpace: 'nowrap' }}>{formatDate(tx.date, 'en')}</td>
              <td style={{ padding: '8px 4px' }}>
                <div style={{ fontWeight: 600 }}>{tx.counterparty}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.plain.en}</div>
              </td>
              <td style={{ padding: '8px 4px', fontFamily: 'monospace' }}>
                {tx.type} {tx.ref ? `· ${tx.ref}` : ''}
              </td>
              <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                {tx.direction === 'out' ? (tx.amountPaise / 100).toFixed(2) : '-'}
              </td>
              <td style={{ padding: '8px 4px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>
                {tx.direction === 'in' ? (tx.amountPaise / 100).toFixed(2) : '-'}
              </td>
              <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 600 }}>
                {(tx.runningBalancePaise / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #cbd5e1',
          fontSize: '0.75rem',
          color: '#64748b',
          textAlign: 'center',
        }}
      >
        This is a computer-generated statement from Saral Banking. For queries or fraud reporting, call National Cybercrime Helpline 1930.
      </div>
    </div>
  );
}
