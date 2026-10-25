import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import Amount from '../../components/ui/Amount';
import BigButton from '../../components/ui/BigButton';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import EmptyState from '../../components/ui/EmptyState';
import { getBalances, getTransactions, addTransaction } from '../../utils/ledger.js';
import { rupeesToPaise, formatINR } from '../../utils/money.js';
import { useStore } from '../../store/index.js';
import { useT } from '../../i18n/index.js';

export default function GuardianView() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const t = useT();

  const childId = 'aarav';
  const childBalances = getBalances(childId);
  const childTransactions = getTransactions(childId).slice(0, 5);

  const pendingRequests = state.pay?.guardianRequests?.filter(
    (r) => (r.customerId === childId || r.childId === childId) && r.status === 'pending'
  ) || [];

  const [limitInput, setLimitInput] = useState(
    String((state.young?.dailyLimitPaise || 100000) / 100)
  );

  const handleApprove = (req) => {
    // 1. Dispatch approve
    dispatch({ type: 'APPROVE_GUARDIAN_REQUEST', payload: req.id });

    const txRef = String(Math.floor(100000000000 + Math.random() * 900000000000));
    const now = new Date().toISOString();

    if (req.type === 'add_money') {
      // existing add_money handling

      // 1. Debit from Mom Priya
      addTransaction({
        id: `tx_priya_${Date.now()}`,
        customerId: 'priya',
        date: now,
        direction: 'out',
        amountPaise: req.amountPaise,
        type: 'TRANSFER',
        counterparty: 'Aarav Mehta (Son)',
        raw: `UPI/DR/FAMILY/AARAV_MEHTA`,
        ref: txRef,
        plain: {
          en: `Pocket money sent to Aarav (${req.note})`,
          hi: `आरव को पॉकेट मनी भेजी (${req.note})`,
        },
      });

      // 2. Credit to Son Aarav
      addTransaction({
        id: `tx_${childId}_${Date.now()}`,
        customerId: childId,
        date: now,
        direction: 'in',
        amountPaise: req.amountPaise,
        type: 'DEPOSIT',
        counterparty: 'Priya Sharma (Mom)',
        raw: `DEP/CR/FAMILY/PRIYA_SHARMA`,
        ref: txRef,
        plain: {
          en: `Received from Mom (${req.note})`,
          hi: `माँ से प्राप्त हुए (${req.note})`,
        },
      });
      alert('Money request approved and added to Aarav account.');
      return;
    }

    // Standard outgoing transaction approval
    if (req.type === 'upi_limit') {      // Update child's daily limit after mom's approval
      dispatch({ type: 'SET_DAILY_LIMIT', payload: req.requestedLimitPaise });
      alert(`Daily UPI limit updated to ${formatINR(req.requestedLimitPaise)}`);
      return;
    }

    // payment type — Aarav sent money above ₹5,000, awaiting mom approval
    if (req.type === 'payment') {
      const counterparty = req.counterparty || 'Unknown';
      const newTx = {
        id: `tx_${childId}_${Date.now()}`,
        customerId: childId,
        date: now,
        direction: 'out',
        amountPaise: req.amountPaise,
        type: 'UPI',
        counterparty,
        raw: `UPI/DR/${txRef}/${counterparty.toUpperCase().replace(/\s+/g, '')}/BANK`,
        ref: txRef,
        plain: {
          en: `Approved by Mom — payment to ${counterparty}`,
          hi: `माँ द्वारा स्वीकृत — ${counterparty} को भुगतान`,
        },
        parts: [
          { token: 'UPI', key: 'upi' },
          { token: 'DR', key: 'dr' },
          { token: txRef, key: 'ref' },
        ],
        note: req.note,
      };
      addTransaction(newTx);
      alert(`Payment of ${formatINR(req.amountPaise)} to ${counterparty} approved and processed!`);
      return;
    }

    const counterpartyFallback = req.counterparty || 'Unknown';
    const newTx = {
      id: `tx_${childId}_${Date.now()}`,
      customerId: childId,
      date: now,
      direction: 'out',
      amountPaise: req.amountPaise,
      type: 'UPI',
      counterparty: counterpartyFallback,
      raw: `UPI/DR/${txRef}/${counterpartyFallback.toUpperCase().replace(/\s+/g, '')}/BANK`,
      ref: txRef,
      plain: {
        en: `Approved payment to ${counterpartyFallback}`,
        hi: `${counterpartyFallback} को स्वीकृत भुगतान`,
      },
      parts: [
        { token: 'UPI', key: 'upi' },
        { token: 'DR', key: 'dr' },
        { token: txRef, key: 'ref' },
      ],
      note: req.note,
    };
    addTransaction(newTx);
    alert('Payment approved and processed.');
  };

  const handleDecline = (req) => {
    dispatch({ type: 'DECLINE_GUARDIAN_REQUEST', payload: req.id });
    alert('Payment declined.');
  };

  const handleSaveLimit = () => {
    const paise = rupeesToPaise(limitInput);
    if (paise > 0) {
      dispatch({ type: 'SET_DAILY_LIMIT', payload: paise });
      alert(`Daily spending limit updated to ${formatINR(paise)}`);
    }
  };

  const handleSwitchToAarav = () => {
    dispatch({ type: 'SET_CUSTOMER', payload: 'aarav' });
    dispatch({ type: 'SET_MODE', payload: 'young' });
    navigate('/');
  };

  return (
    <Screen
      title="Guardian Dashboard (Priya Sharma)"
      mainAction={{
        label: 'Switch to Aarav’s view',
        variant: 'secondary',
        onClick: handleSwitchToAarav,
      }}
    >
      <Notice type="info">
        Managing Aarav’s Minor Account (15 yrs) · Supervised by Mom (Priya Sharma)
      </Notice>

      {/* Aarav's Balance */}
      <Card heading="Aarav's Account Balance">
        <Amount paise={childBalances.totalPaise} size="display" />
        {childBalances.heldPaise > 0 && (
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ₹{(childBalances.heldPaise / 100).toFixed(0)} held in pending requests
          </div>
        )}
      </Card>

      {/* Pending Approvals */}
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>
          Pending Approvals ({pendingRequests.length})
        </h2>

        {pendingRequests.length === 0 ? (
          <EmptyState message="No pending payment requests from Aarav." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingRequests.map((req) => (
              <Card key={req.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    {/* Label by request type */}
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: req.type === 'payment' ? '#d97706' : req.type === 'add_money' ? '#059669' : '#6366f1', marginBottom: '2px' }}>
                      {req.type === 'payment' ? '💸 Payment Request' : req.type === 'add_money' ? '➕ Add Money Request' : '🔒 UPI Limit Request'}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                      {req.type === 'payment' ? `To: ${req.counterparty || 'Unknown'}` : req.type === 'upi_limit' ? `New limit: ${formatINR(req.requestedLimitPaise)}` : req.note}
                    </div>
                    {req.note && req.type !== 'add_money' && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Note: {req.note}</div>}
                  </div>
                  {req.amountPaise > 0 && <Amount paise={req.amountPaise} size="large" />}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <BigButton variant="primary" onClick={() => handleApprove(req)}>
                    ✓ Approve
                  </BigButton>
                  <BigButton variant="danger" onClick={() => handleDecline(req)}>
                    ✗ Decline
                  </BigButton>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Daily Spending Limit Control — removed; limit is set via Aarav's UPI limit request flow */}

      {/* Aarav's Recent Activity */}
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>
          Aarav’s Recent Activity
        </h2>
        <div style={{ borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {childTransactions.map((tx) => (
            <ListRow
              key={tx.id}
              title={tx.counterparty}
              subtitle={tx.plain.en}
              trailing={<Amount paise={tx.amountPaise} direction={tx.direction} />}
            />
          ))}
        </div>
      </div>
    </Screen>
  );
}
