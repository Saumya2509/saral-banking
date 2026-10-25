import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Sheet from '../../components/ui/Sheet';
import Field from '../../components/ui/Field';
import BigButton from '../../components/ui/BigButton';
import Amount from '../../components/ui/Amount';
import {
  CheckIcon,
  ZapIcon,
  SmartphoneIcon,
  TvIcon,
  ShieldIcon,
  HomeIcon,
  SearchIcon,
  ClockIcon,
} from '../../components/icons/Icons';
import { getBalances, addTransaction } from '../../utils/ledger.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatINR } from '../../utils/money.js';
import { playSuccessChime } from '../../utils/audio.js';

export default function BillPay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || '';

  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();
  const customerId = state.session.customerId || 'shankar';
  const balances = getBalances(customerId);

  const isYoung = state?.settings?.mode === 'young';

  if (isYoung) {
    return (
      <Screen title={lang === 'hi' ? 'बिल भुगतान' : 'Bill Payments'} showBack>
        <div style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            🛡️
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            {lang === 'hi' ? 'युवा बचतकर्ता खाता' : 'Young Saver Protection'}
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, maxWidth: '340px' }}>
            {lang === 'hi'
              ? 'उपयोगिता बिल भुगतान युवा खातों (18 वर्ष से कम) के लिए अक्षम हैं। कृपया अपनी माँ (प्रिया शर्मा) से संपर्क करें।'
              : 'Utility and bill payments are disabled for Young Saver accounts (under 18). Please ask your mother (Priya Sharma) to handle bills.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
            <BigButton variant="primary" onClick={() => navigate('/goals')}>
              {lang === 'hi' ? 'बचत लक्ष्य देखें' : 'View Savings Goals'}
            </BigButton>
            <BigButton variant="secondary" onClick={() => navigate('/')}>
              {lang === 'hi' ? 'होम पर लौटें' : 'Back to Home'}
            </BigButton>
          </div>
        </div>
      </Screen>
    );
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billerName, setBillerName] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [billAmount, setBillAmount] = useState('850');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 3x3 Category Grid matching Screen 6 in mockup
  const categories = [
    {
      id: 'electricity',
      name: lang === 'hi' ? 'बिजली' : 'Electricity',
      icon: '⚡',
      bg: '#fef3c7',
      color: '#d97706',
      sampleBiller: 'Jammu Power Distribution Corp (JPDCL)',
    },
    {
      id: 'water',
      name: lang === 'hi' ? 'पानी' : 'Water',
      icon: '💧',
      bg: '#e0f2fe',
      color: '#0284c7',
      sampleBiller: 'Jal Shakti Vibhag Jammu',
    },
    {
      id: 'dth',
      name: lang === 'hi' ? 'डीटीएच' : 'DTH Cable',
      icon: '📡',
      bg: '#f3e8ff',
      color: '#9333ea',
      sampleBiller: 'Tata Play DTH',
    },
    {
      id: 'mobile',
      name: lang === 'hi' ? 'मोबाइल' : 'Mobile Recharge',
      icon: '📱',
      bg: '#ffedd5',
      color: '#ea580c',
      sampleBiller: 'Airtel Prepaid / Postpaid',
    },
    {
      id: 'broadband',
      name: lang === 'hi' ? 'ब्रॉडबैंड' : 'Broadband',
      icon: '🌐',
      bg: '#e0e7ff',
      color: '#4f46e5',
      sampleBiller: 'JioFiber Broadband',
    },
    {
      id: 'gas',
      name: lang === 'hi' ? 'गैस सिलेंडर' : 'Gas Cylinder',
      icon: '🔥',
      bg: '#fee2e2',
      color: '#dc2626',
      sampleBiller: 'Indane Gas Bharat Petroleum',
    },
    {
      id: 'insurance',
      name: lang === 'hi' ? 'बीमा' : 'Insurance',
      icon: '🛡️',
      bg: '#ecfdf5',
      color: '#059669',
      sampleBiller: 'LIC of India Premium',
    },
    {
      id: 'landline',
      name: lang === 'hi' ? 'लैंडलाइन' : 'Landline',
      icon: '☎️',
      bg: '#ccfbf1',
      color: '#0d9488',
      sampleBiller: 'BSNL Landline Telephone',
    },
    {
      id: 'loan',
      name: lang === 'hi' ? 'लोन ईएमआई' : 'Loan EMI',
      icon: '🏦',
      bg: '#ffe4e6',
      color: '#e11d48',
      sampleBiller: 'Saral Home Loan EMI',
    },
  ];

  // Upcoming Bills matching Screen 6 in mockup
  const [upcomingBills, setUpcomingBills] = useState([
    {
      id: 'bill-1',
      biller: 'JPDCL Electricity',
      category: 'Electricity',
      icon: '⚡',
      color: '#d97706',
      dueDate: 'Due in 3 days',
      amountPaise: 145000, // ₹1,450.00
      consumerNo: 'CA-90481283',
    },
    {
      id: 'bill-2',
      biller: 'Airtel Postpaid Mobile',
      category: 'Mobile',
      icon: '📱',
      color: '#ea580c',
      dueDate: 'Due in 5 days',
      amountPaise: 79900, // ₹799.00
      consumerNo: '9876543210',
    },
    {
      id: 'bill-3',
      biller: 'JioFiber Broadband',
      category: 'Broadband',
      icon: '🌐',
      color: '#4f46e5',
      dueDate: 'Due in 8 days',
      amountPaise: 117900, // ₹1,179.00
      consumerNo: 'JF-50493810',
    },
  ]);

  const handleOpenCategory = (cat) => {
    setSelectedCategory(cat.id);
    setBillerName(cat.sampleBiller);
    setConsumerNumber('');
    setBillAmount(cat.id === 'mobile' ? '299' : '850');
    setPaymentSuccess(false);
    setIsModalOpen(true);
  };

  const handlePayUpcoming = (bill) => {
    setSelectedCategory(bill.category.toLowerCase());
    setBillerName(bill.biller);
    setConsumerNumber(bill.consumerNo);
    setBillAmount((bill.amountPaise / 100).toString());
    setPaymentSuccess(false);
    setIsModalOpen(true);
  };

  const handleConfirmPay = () => {
    const amt = parseFloat(billAmount);
    if (!amt || amt <= 0) return;
    const amountPaise = Math.round(amt * 100);

    setIsProcessing(true);

    setTimeout(() => {
      // Record transaction into ledger
      const txId = `tx_bill_${Date.now()}`;
      addTransaction({
        id: txId,
        customerId,
        date: new Date().toISOString(),
        direction: 'out',
        amountPaise,
        type: 'BILL',
        counterparty: billerName || 'Utility Biller',
        raw: `BILL/BBPS/${billerName?.toUpperCase() || 'UTILITY'}/${consumerNumber || 'DIRECT'}`,
        ref: `BBPS${Date.now().toString().slice(-8)}`,
        plain: {
          en: `Bill payment to ${billerName}`,
          hi: `${billerName} को बिल भुगतान`,
        },
      });

      // Remove from upcoming bills if it matches
      setUpcomingBills((prev) => prev.filter((b) => b.biller !== billerName));

      setIsProcessing(false);
      setPaymentSuccess(true);
      playSuccessChime();

      setTimeout(() => {
        setIsModalOpen(false);
        setPaymentSuccess(false);
      }, 1800);
    }, 900);
  };

  return (
    <Screen title={lang === 'hi' ? 'बिल भुगतान' : 'Bill Payments'}>
      {/* Search Biller Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          backgroundColor: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: '14px',
          marginBottom: '16px',
        }}
      >
        <SearchIcon size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder={lang === 'hi' ? 'बिलर या सेवा खोजें...' : 'Search biller or utility...'}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            flex: 1,
            fontSize: '0.9375rem',
            color: 'var(--text-primary)',
          }}
        />
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '2px 8px',
            borderRadius: '10px',
          }}
        >
          BBPS Assured
        </span>
      </div>

      {/* 3x3 Category Grid matching Screen 6 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {lang === 'hi' ? 'श्रेणियाँ' : 'Categories'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>9 Available</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleOpenCategory(cat)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 8px',
                borderRadius: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                textAlign: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              className="interactive-tap hover:border-blue-400"
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: cat.bg,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                }}
              >
                {cat.icon}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: '1.2',
                }}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Bills Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {lang === 'hi' ? 'आगामी देय बिल' : 'Upcoming Bills'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 600 }}>
            {upcomingBills.length} Pending
          </span>
        </div>

        {upcomingBills.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            🎉 All your bills are paid up to date!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingBills.map((bill) => (
              <div
                key={bill.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}
                  >
                    {bill.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {bill.biller}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {bill.dueDate} · ID: {bill.consumerNo}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {formatINR(bill.amountPaise)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePayUpcoming(bill)}
                    style={{
                      backgroundColor: 'var(--brand)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    className="interactive-tap"
                  >
                    {lang === 'hi' ? 'भुगतान करें' : 'Pay Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Pay Modal Sheet */}
      <Sheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={lang === 'hi' ? 'बिल भुगतान' : 'Pay Utility Bill'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {paymentSuccess ? (
            <div
              style={{
                textAlign: 'center',
                padding: '24px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {lang === 'hi' ? 'बिल भुगतान सफल!' : 'Bill Payment Successful!'}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                {formatINR(Math.round(parseFloat(billAmount || 0) * 100))} paid to {billerName}. Receipt generated with BBPS reference.
              </p>
            </div>
          ) : (
            <>
              <Field
                label={lang === 'hi' ? 'बिलर / सेवा प्रदाता' : 'Biller / Service Provider'}
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
              />

              <Field
                label={lang === 'hi' ? 'उपभोक्ता नंबर / खाता संख्या' : 'Consumer ID / Account No.'}
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="e.g. CA-98231023 or 9876543210"
              />

              <Field
                label={lang === 'hi' ? 'बिल राशि (₹)' : 'Bill Amount (₹)'}
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--surface-alt)',
                  fontSize: '0.8125rem',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>From Account:</span>
                <span style={{ fontWeight: 600 }}>Saral Savings (Bal: {formatINR(balances.availablePaise)})</span>
              </div>

              <BigButton
                variant="primary"
                onClick={handleConfirmPay}
                disabled={isProcessing}
              >
                {isProcessing
                  ? (lang === 'hi' ? 'प्रक्रिया चल रही है...' : 'Processing Payment...')
                  : (lang === 'hi' ? `₹${billAmount} का भुगतान करें` : `Pay ₹${billAmount}`)}
              </BigButton>
            </>
          )}
        </div>
      </Sheet>
    </Screen>
  );
}
