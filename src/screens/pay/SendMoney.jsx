import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Segmented from '../../components/ui/Segmented';
import Field from '../../components/ui/Field';
import ListRow from '../../components/ui/ListRow';
import EmptyState from '../../components/ui/EmptyState';
import QrScanner from '../../components/ui/QrScanner';
import BigButton from '../../components/ui/BigButton';
import {
  QrCodeIcon,
  UserIcon,
  PlusIcon,
  SendIcon,
  BookIcon,
  SparklesIcon,
} from '../../components/icons/Icons';
import { getPayeesForCustomer } from '../../data/payees.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';

export default function SendMoney() {
  const navigate = useNavigate();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const initialPayees = getPayeesForCustomer(customerId);
  const userAddedPayees = state.pay?.payees?.filter((p) => p.customerId === customerId) || [];
  const allPayees = [...initialPayees, ...userAddedPayees];

  // Transfer Mode: 'upi' | 'bank' | 'self' (matching Screen 5 in mockup)
  const [transferType, setTransferType] = useState('upi');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleScanSuccess = (scannedPayee) => {
    navigate('/pay/amount', {
      state: {
        payee: scannedPayee,
        amountPaise: scannedPayee.amountPaise,
      },
    });
  };

  // Recent circular contacts matching Screen 5 in mockup
  const recentContacts = [
    { id: 'c1', initials: 'RS', name: 'Ramesh Sharma', upiId: 'ramesh@upi', bg: '#dbeafe', color: '#1d4ed8' },
    { id: 'c2', initials: 'PS', name: 'Pooja Singh', upiId: 'pooja@oksbi', bg: '#dcfce7', color: '#15803d' },
    { id: 'c3', initials: 'AK', name: 'Aarav Kumar', upiId: 'aarav@saral', bg: '#f3e8ff', color: '#7e22ce' },
    { id: 'c4', initials: 'RK', name: 'Rohit K.', upiId: 'rohit@icici', bg: '#ffedd5', color: '#c2410c' },
    { id: 'c5', initials: 'KP', name: 'Kavita P.', upiId: 'kavita@paytm', bg: '#fee2e2', color: '#b91c1c' },
  ];

  const handleSelectRecent = (contact) => {
    setRecipient(contact.upiId || contact.name);
  };

  const handleProceedSend = () => {
    const amtNum = parseFloat(amount);
    if (!amtNum || amtNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const targetPayee = {
      id: `payee_${Date.now()}`,
      name: recipient || (transferType === 'self' ? 'My Own Account' : 'UPI Payee'),
      upiId: recipient.includes('@') ? recipient : `${recipient}@upi`,
      accountNumber: transferType === 'bank' ? recipient : '918234019283',
      bank: transferType === 'bank' ? 'State Bank of India' : 'Saral Bank',
    };

    navigate('/pay/amount', {
      state: {
        payee: targetPayee,
        amountPaise: Math.round(amtNum * 100),
        note: note,
        transferType,
      },
    });
  };

  const quickAmounts = ['500', '1000', '2000', '5000'];

  const filteredPayees = allPayees.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.bank && p.bank.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Screen
      title={lang === 'hi' ? 'पैसे भेजें' : 'Send Money'}
      mainAction={{
        label: t('payees.addNew') || '+ Add Payee',
        onClick: () => navigate('/payees/new'),
        icon: <PlusIcon size={18} />,
      }}
    >
      {/* Segmented Transfer Mode: [ UPI | Bank Transfer | Self ] matching Screen 5 */}
      <div style={{ marginBottom: '14px' }}>
        <Segmented
          value={transferType}
          onChange={setTransferType}
          options={[
            { value: 'upi', label: 'UPI' },
            { value: 'bank', label: lang === 'hi' ? 'बैंक ट्रांसफर' : 'Bank Transfer' },
            { value: 'self', label: lang === 'hi' ? 'स्वयं' : 'Self' },
          ]}
        />
      </div>

      {/* Main Transfer Form Card matching Screen 5 in mockup */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '18px',
          padding: '18px 16px',
          border: '1.5px solid var(--border)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          marginBottom: '20px',
        }}
      >
        {/* "To" Field with Contact Book Icon */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {transferType === 'upi'
              ? (lang === 'hi' ? 'प्राप्तकर्ता (To)' : 'To (UPI ID or Phone)')
              : transferType === 'bank'
              ? (lang === 'hi' ? 'खाता संख्या या IFSC' : 'Account Number / IFSC')
              : (lang === 'hi' ? 'मेरा खाता चुनें' : 'Transfer to My Account')}
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-alt)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '0 12px',
            }}
          >
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={
                transferType === 'upi'
                  ? 'e.g. mobile number or name@upi'
                  : transferType === 'bank'
                  ? 'e.g. 2048 1023 9182'
                  : 'Saral Savings A/C (•••• 4589)'
              }
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                padding: '12px 0',
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="button"
              onClick={() => setIsQrOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Scan QR or Pick Contact"
            >
              <QrCodeIcon size={20} />
            </button>
          </div>
        </div>

        {/* "Amount" Field */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {lang === 'hi' ? 'राशि' : 'Amount'}
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-alt)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '0 14px',
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '8px' }}>
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                padding: '12px 0',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Quick Amount Chips */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '8px',
                  backgroundColor: amount === q ? 'var(--brand-soft)' : 'var(--surface-alt)',
                  border: amount === q ? '1px solid var(--brand)' : '1px solid var(--border)',
                  color: amount === q ? 'var(--brand)' : 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                +₹{q}
              </button>
            ))}
          </div>
        </div>

        {/* "Add Note" Field */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {lang === 'hi' ? 'नोट जोड़ें (वैकल्पिक)' : 'Add Note (Optional)'}
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Rent, Dinner, Gift..."
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-alt)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        {/* Big Send Money Button matching Screen 5 */}
        <BigButton
          variant="primary"
          onClick={handleProceedSend}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <SendIcon size={18} />
          <span>{lang === 'hi' ? 'पैसे भेजें' : 'Send Money'}</span>
        </BigButton>
      </div>

      {/* Recent Contacts Section with Circular Avatars matching Screen 5 in mockup */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
          {lang === 'hi' ? 'हाल के संपर्क' : 'Recent Contacts'}
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {recentContacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => handleSelectRecent(contact)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                minWidth: '60px',
              }}
              className="interactive-tap"
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: contact.bg,
                  color: contact.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                {contact.initials}
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  maxWidth: '64px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {contact.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Payees Header & List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: 'var(--text-muted)' }}>
            {t('payees.title') || 'Saved Payees'} ({filteredPayees.length})
          </h2>
        </div>

        {/* Search Field */}
        <div style={{ marginBottom: '10px' }}>
          <Field
            placeholder={t('rec.history.search') || 'Search saved payees...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredPayees.length === 0 ? (
          <EmptyState
            message="No payees found. Add a payee or transfer via UPI ID above."
            action={{
              label: t('payees.addNew') || 'Add new payee',
              onClick: () => navigate('/payees/new'),
            }}
          />
        ) : (
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              overflow: 'hidden',
            }}
          >
            {filteredPayees.map((payee) => (
              <ListRow
                key={payee.id}
                icon={<UserIcon size={20} />}
                title={payee.name}
                subtitle={`${payee.bank || 'Bank'} · ${payee.accountNumber || payee.upiId || ''}`}
                chevron
                onClick={() => navigate('/pay/amount', { state: { payee } })}
              />
            ))}
          </div>
        )}
      </div>

      {/* QR Scanner Sheet */}
      <QrScanner
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </Screen>
  );
}
