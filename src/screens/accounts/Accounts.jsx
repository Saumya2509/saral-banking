import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Amount from '../../components/ui/Amount';
import Sheet from '../../components/ui/Sheet';
import Field from '../../components/ui/Field';
import BigButton from '../../components/ui/BigButton';
import {
  CreditCardIcon,
  CheckIcon,
  PlusIcon,
  ShieldIcon,
  SparklesIcon,
} from '../../components/icons/Icons';
import { getBalances } from '../../utils/ledger.js';
import { getCustomer, maskAccountNumber } from '../../data/customers.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';

export default function Accounts() {
  const navigate = useNavigate();
  const { state } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const balances = getBalances(customerId);

  const [openAccountSheet, setOpenAccountSheet] = useState(false);
  const [accountType, setAccountType] = useState('fd');
  const [fdAmount, setFdAmount] = useState('25000');
  const [successNote, setSuccessNote] = useState('');

  const accountsList = [
    {
      id: 'savings',
      title: lang === 'hi' ? 'बचत खाता (Savings)' : 'Savings Account',
      number: customer.accountNumber || '2048 1023 4821',
      balancePaise: balances.totalPaise,
      type: 'savings',
      isPrimary: true,
      interest: '3.50% p.a.',
    },
    {
      id: 'current',
      title: lang === 'hi' ? 'चालू खाता (Current)' : 'Current Account',
      number: '3072 5610 5678',
      balancePaise: 1243000, // ₹12,430.00
      type: 'current',
      isPrimary: false,
      interest: '0.00% (Overdraft Active)',
    },
    {
      id: 'fd',
      title: lang === 'hi' ? 'सावधि जमा (Fixed Deposit)' : 'Fixed Deposit',
      number: '9182 3401 9012',
      balancePaise: 10000000, // ₹1,00,000.00
      type: 'deposit',
      isPrimary: false,
      maturity: '12 Jan 2027',
      interest: '7.10% p.a.',
    },
  ];

  const handleCreateAccount = () => {
    setSuccessNote(
      lang === 'hi'
        ? 'नया खाता सफलतापूर्वक स्वीकृत और सक्रिय किया गया!'
        : 'New digital account approved and activated successfully!'
    );
    setTimeout(() => {
      setOpenAccountSheet(false);
      setSuccessNote('');
    }, 1500);
  };

  return (
    <Screen title={lang === 'hi' ? 'खाते' : lang === 'ta' ? 'கணக்குகள்' : 'Accounts'} showBack={true} onBack={() => navigate('/')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. Primary Savings Account Card (matches Screen 4 in mockup) */}
        <div
          onClick={() => navigate('/statements')}
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #0f2e82 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '22px 20px',
            boxShadow: '0 8px 24px rgba(29, 78, 216, 0.28)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          className="interactive-tap"
        >
          {/* Subtle background curved wave */}
          <div
            style={{
              position: 'absolute',
              right: '-30px',
              bottom: '-30px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                🏛️
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                  {accountsList[0].title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {maskAccountNumber(accountsList[0].number)}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '1.25rem', color: '#ffffff' }}>›</span>
          </div>

          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2px' }}>
              {lang === 'hi' ? 'उपलब्ध शेष राशि' : 'Available Balance'}
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {formatINR(accountsList[0].balancePaise)}
            </div>
          </div>
        </div>

        {/* 2. Current Account Card */}
        <div
          onClick={() => navigate('/statements')}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: '18px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
          }}
          className="interactive-tap hover:border-blue-400"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                🏦
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  {accountsList[1].title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {maskAccountNumber(accountsList[1].number)}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>›</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '6px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {lang === 'hi' ? 'उपलब्ध शेष राशि' : 'Available Balance'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatINR(accountsList[1].balancePaise)}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
              {accountsList[1].interest}
            </span>
          </div>
        </div>

        {/* 3. Fixed Deposit Card */}
        <div
          onClick={() => navigate('/statements')}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: '18px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
          }}
          className="interactive-tap hover:border-emerald-400"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                📋
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  {accountsList[2].title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {maskAccountNumber(accountsList[2].number)}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>›</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '6px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {lang === 'hi' ? 'जमा राशि' : 'Deposit Amount'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatINR(accountsList[2].balancePaise)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                {accountsList[2].interest}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Maturity: {accountsList[2].maturity}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Open New Account Button */}
        <button
          type="button"
          onClick={() => setOpenAccountSheet(true)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            backgroundColor: 'var(--surface)',
            border: '2px dashed var(--brand)',
            color: 'var(--brand)',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px',
          }}
          className="interactive-tap hover:bg-blue-50"
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            +
          </div>
          <span>{lang === 'hi' ? 'नया खाता खोलें' : 'Open New Account'}</span>
        </button>
      </div>

      {/* Instant Digital Account Opening Modal */}
      <Sheet
        isOpen={openAccountSheet}
        onClose={() => setOpenAccountSheet(false)}
        title={lang === 'hi' ? 'नया खाता खोलें' : 'Open New Account'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
              {lang === 'hi' ? 'खाता प्रकार चुनें' : 'Select Account Type'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setAccountType('fd')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: accountType === 'fd' ? '2px solid var(--brand)' : '1px solid var(--border)',
                  backgroundColor: accountType === 'fd' ? 'var(--brand-soft)' : 'var(--surface)',
                  color: accountType === 'fd' ? 'var(--brand)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Fixed Deposit (7.1%)
              </button>
              <button
                type="button"
                onClick={() => setAccountType('rd')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: accountType === 'rd' ? '2px solid var(--brand)' : '1px solid var(--border)',
                  backgroundColor: accountType === 'rd' ? 'var(--brand-soft)' : 'var(--surface)',
                  color: accountType === 'rd' ? 'var(--brand)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Recurring Deposit (6.8%)
              </button>
            </div>
          </div>

          <Field
            label={lang === 'hi' ? 'जमा राशि (₹)' : 'Deposit Amount (₹)'}
            type="number"
            value={fdAmount}
            onChange={(e) => setFdAmount(e.target.value)}
          />

          {successNote && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #059669',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              ✓ {successNote}
            </div>
          )}

          <BigButton variant="primary" onClick={handleCreateAccount}>
            {lang === 'hi' ? 'तुरंत खाता शुरू करें' : 'Open Account Instantly'}
          </BigButton>
        </div>
      </Sheet>
    </Screen>
  );
}
