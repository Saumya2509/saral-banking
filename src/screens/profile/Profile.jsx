import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import BigButton from '../../components/ui/BigButton';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import ListRow from '../../components/ui/ListRow';
import Segmented from '../../components/ui/Segmented';
import Sheet from '../../components/ui/Sheet';
import Amount from '../../components/ui/Amount';
import {
  UserIcon,
  CheckIcon,
  CopyIcon,
  ShieldIcon,
  PlusIcon,
  CreditCardIcon,
  LockIcon,
  HelpCircleIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '../../components/icons/Icons';
import {
  getCustomer,
  getAllCustomers,
  saveCustomCustomer,
  maskAccountNumber,
} from '../../data/customers.js';
import { getBalances, addTransaction } from '../../utils/ledger.js';
import { hasFingerprint, removeFingerprint, enableFingerprint } from '../../biometric/index.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { playSuccessChime } from '../../utils/audio.js';

export default function Profile() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId) || {
    id: customerId,
    name: { en: 'Customer', hi: 'उपभोक्ता' },
    age: 32,
    isMinor: false,
    accountNumber: '2048 1023 4821',
    ifsc: 'SBNK0001234',
    branch: { en: 'MG Road, Jammu', hi: 'एमजी रोड, जम्मू' },
    mobile: '98765 43210',
    email: 'user@example.com',
  };

  const contactOverrides = state.records.contactOverrides || {};
  const activeMobile = contactOverrides.mobile || customer.mobile || '98765 43210';
  const activeEmail = contactOverrides.email || customer.email || `${customerId}@example.com`;
  const activeAddress = contactOverrides.address || (lang === 'hi' ? 'एमजी रोड, जम्मू, 180001' : 'MG Road, Jammu, 180001');

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'edit' | 'add' | 'switch'
  const [personalDetailsSheet, setPersonalDetailsSheet] = useState(false);
  const [kycSheet, setKycSheet] = useState(false);
  const [changePinSheet, setChangePinSheet] = useState(false);
  const [aboutSheet, setAboutSheet] = useState(false);

  // Form states
  const [editNameEn, setEditNameEn] = useState(customer.name?.en || '');
  const [editNameHi, setEditNameHi] = useState(customer.name?.hi || '');
  const [editMobile, setEditMobile] = useState(activeMobile);
  const [editEmail, setEditEmail] = useState(activeEmail);
  const [editAddress, setEditAddress] = useState(activeAddress);
  const [newPin, setNewPin] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add profile state
  const [newNameEn, setNewNameEn] = useState('');
  const [newAge, setNewAge] = useState('28');
  const [newMobile, setNewMobile] = useState('');
  const [newMode, setNewMode] = useState('standard');

  const balances = getBalances(customerId);
  const allCustomers = getAllCustomers();
  const customerName = customer.name?.[lang] || customer.name?.en || 'Customer';
  const initial = (customerName || 'U').charAt(0).toUpperCase();

  const [bioOn, setBioOn] = useState(() => hasFingerprint(customerId));
  const handleToggleBiometric = async () => {
    if (bioOn) {
      removeFingerprint(customerId);
      setBioOn(false);
    } else {
      try {
        await enableFingerprint(customer);
        setBioOn(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogout = () => {
    try { sessionStorage.removeItem('saral_active_customer'); } catch {}
    dispatch({ type: 'SIGN_OUT' });
    navigate('/signin');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_CONTACT',
      payload: {
        mobile: editMobile,
        email: editEmail,
        address: editAddress,
      },
    });

    const updatedCust = {
      ...customer,
      name: {
        en: editNameEn || customer.name.en,
        hi: editNameHi || customer.name.hi || editNameEn,
      },
      mobile: editMobile,
      email: editEmail,
    };
    saveCustomCustomer(updatedCust);

    playSuccessChime();
    setSuccessMessage(lang === 'hi' ? 'प्रोफ़ाइल अपडेट सफल!' : 'Profile updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      setActiveTab('menu');
    }, 1200);
  };

  const handleSwitchCustomer = (c) => {
    dispatch({ type: 'SET_CUSTOMER', payload: c.id });
    if (c.defaultMode) {
      dispatch({ type: 'SET_MODE', payload: c.defaultMode });
    }
    playSuccessChime();
    setActiveTab('menu');
  };

  const menuItems = [
    {
      id: 'personal',
      title: lang === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details',
      subtitle: 'Name, DOB, PAN & Address',
      icon: '👤',
      onClick: () => setPersonalDetailsSheet(true),
    },
    {
      id: 'kyc',
      title: lang === 'hi' ? 'केवाईसी सत्यापन' : 'KYC Verification',
      subtitle: 'Status: Fully Verified (Tier 3)',
      icon: '🛡️',
      badge: 'Verified',
      onClick: () => setKycSheet(true),
    },
    {
      id: 'pin',
      title: lang === 'hi' ? 'पिन बदलें' : 'Change Password / PIN',
      subtitle: 'Update your 4-digit transaction PIN',
      icon: '🔑',
      onClick: () => setChangePinSheet(true),
    },
    {
      id: 'beneficiaries',
      title: lang === 'hi' ? 'लाभार्थी प्रबंधन' : 'Manage Beneficiaries',
      subtitle: 'Saved Payees & Quick Contacts',
      icon: '👥',
      onClick: () => navigate('/payees'),
    },
    ...(customerId === 'priya'
      ? [
          {
            id: 'guardian',
            title: lang === 'hi' ? 'अभिभावक डैशबोर्ड (आरव की निगरानी)' : 'Guardian Dashboard (Aarav Mehta)',
            subtitle: 'Supervise Aarav’s spending, limits & approvals',
            icon: '👨‍👦',
            onClick: () => navigate('/guardian'),
          },
        ]
      : []),
    {
      id: 'accounts',
      title: lang === 'hi' ? 'बैंक खाते' : 'Bank Accounts',
      subtitle: 'Savings, Current & Fixed Deposits',
      icon: '🏛️',
      onClick: () => navigate('/accounts'),
    },
    {
      id: 'cards',
      title: lang === 'hi' ? 'डेबिट व क्रेडिट कार्ड्स' : 'Cards Management',
      subtitle: 'Manage Limits & Block Cards',
      icon: '💳',
      onClick: () => navigate('/cards'),
    },
    {
      id: 'biometric',
      title: lang === 'hi' ? 'फ़िंगरप्रिंट अनलॉक' : lang === 'ta' ? 'கைரேகை மூலம் திறத்தல்' : 'Fingerprint Unlock',
      subtitle: bioOn
        ? (lang === 'hi' ? 'सक्रिय · बंद करने के लिए टैप करें' : lang === 'ta' ? 'இயங்குகிறது · நிறுத்த தட்டவும்' : 'Active · Tap to turn off')
        : (lang === 'hi' ? 'निष्क्रिय · चालू करने के लिए टैप करें' : lang === 'ta' ? 'முடக்கப்பட்டுள்ளது · இயக்க தட்டவும்' : 'Inactive · Tap to enable'),
      badge: bioOn ? (lang === 'hi' ? 'चालू' : lang === 'ta' ? 'இயக்கத்தில்' : 'Active') : null,
      icon: '🔒',
      onClick: handleToggleBiometric,
    },
    {
      id: 'settings',
      title: lang === 'hi' ? 'ऐप सेटिंग्स और सुलभता' : 'Settings & Accessibility',
      subtitle: 'Theme, Text Size, Simple Mode',
      icon: '⚙️',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'help',
      title: lang === 'hi' ? 'सहायता और संपर्क' : 'Help & Support',
      subtitle: 'FAQ, AI Support, Report Fraud',
      icon: '🎧',
      onClick: () => navigate('/help'),
    },
    {
      id: 'about',
      title: lang === 'hi' ? 'सरल बैंक के बारे में' : 'About Saral Bank',
      subtitle: 'Version 2.4.0 (Hackathon Edition)',
      icon: 'ℹ️',
      onClick: () => setAboutSheet(true),
    },
  ];

  return (
    <Screen title={lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile'} showBack={false}>
      {/* Segmented Top Switcher */}
      <div style={{ marginBottom: '14px' }}>
        <Segmented
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'menu', label: lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile' },
            { value: 'edit', label: lang === 'hi' ? 'संपादित' : 'Edit' },
            { value: 'switch', label: lang === 'hi' ? 'स्विच' : 'Switch' },
            { value: 'add', label: lang === 'hi' ? '+ नया' : '+ Add' },
          ]}
        />
      </div>

      {successMessage && (
        <Notice type="success" className="animate-fade-in" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckIcon size={18} />
            <span>{successMessage}</span>
          </div>
        </Notice>
      )}

      {/* VIEW: MAIN PROFILE MENU (Screen 8 in mockup) */}
      {activeTab === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User Profile Header Card matching Screen 8 */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '20px',
              padding: '20px 18px',
              border: '1.5px solid var(--border)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.875rem',
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)',
                border: '3px solid #ffffff',
                flexShrink: 0,
              }}
            >
              {initial}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {customerName}
                </h2>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  ✓ KYC Verified
                </span>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                +91 {activeMobile}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {activeEmail}
              </div>
            </div>
          </div>

          {/* Menu List matching Screen 8 in mockup */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '18px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                onClick={item.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: index < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                className="interactive-tap hover:bg-slate-50"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRightIcon size={18} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>

          {/* Logout Button matching Screen 8 in mockup */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: '#fee2e2',
              border: '1.5px solid #fca5a5',
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            className="interactive-tap"
          >
            <span>{lang === 'hi' ? 'लॉग आउट' : lang === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
          </button>
        </div>
      )}

      {/* VIEW: EDIT PROFILE */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Card heading={lang === 'hi' ? 'प्रोफ़ाइल जानकारी संपादित करें' : 'Edit Personal Info'}>
            <Field
              label="Full Name (English)"
              value={editNameEn}
              onChange={(e) => setEditNameEn(e.target.value)}
              required
            />
            <Field
              label="Full Name (Hindi)"
              value={editNameHi}
              onChange={(e) => setEditNameHi(e.target.value)}
            />
            <Field
              label="Mobile Number"
              type="tel"
              value={editMobile}
              onChange={(e) => setEditMobile(e.target.value)}
              required
            />
            <Field
              label="Email Address"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <Field
              label="Permanent Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />
          </Card>

          <BigButton type="submit" variant="primary">
            Save Changes
          </BigButton>
        </form>
      )}

      {/* VIEW: SWITCH PROFILE */}
      {activeTab === 'switch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '0 0 4px 0' }}>Select Demo Customer Persona</h3>
          {allCustomers.map((c) => {
            const isSelected = c.id === customerId;
            const name = c.name?.[lang] || c.name?.en || c.id;
            const cBalances = getBalances(c.id);
            return (
              <div
                key={c.id}
                onClick={() => handleSwitchCustomer(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--brand-soft)' : 'var(--surface)',
                  cursor: 'pointer',
                }}
                className="interactive-tap"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--brand)' : '#94a3b8',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.age} yrs · {c.defaultMode || (c.isMinor ? 'young' : 'standard')}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    <Amount paise={cBalances.totalPaise} />
                  </div>
                  {isSelected && <span style={{ fontSize: '0.6875rem', color: 'var(--brand)', fontWeight: 700 }}>✓ Active</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: ADD PROFILE */}
      {activeTab === 'add' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newNameEn) return;
            const numAge = parseInt(newAge, 10) || 28;
            const newCust = {
              id: `user_${Date.now().toString().slice(-4)}`,
              name: { en: newNameEn, hi: newNameEn },
              age: numAge,
              isMinor: numAge < 18,
              defaultMode: newMode,
              accountNumber: `2048 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
              mobile: newMobile || '9876543210',
              email: `${newNameEn.toLowerCase().replace(/\s/g, '')}@saral.com`,
            };
            saveCustomCustomer(newCust);
            dispatch({ type: 'SET_CUSTOMER', payload: newCust.id });
            dispatch({ type: 'SET_MODE', payload: newMode });
            playSuccessChime();
            setActiveTab('menu');
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <Card heading="Create New Customer Persona">
            <Field
              label="Full Name"
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              required
            />
            <Field
              label="Age"
              type="number"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              required
            />
            <Field
              label="Mobile Number"
              type="tel"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              placeholder="9876543210"
            />
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                Default Mode
              </label>
              <Segmented
                value={newMode}
                onChange={setNewMode}
                options={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'simple', label: 'Simple' },
                  { value: 'young', label: 'Young Saver' },
                ]}
              />
            </div>
          </Card>
          <BigButton type="submit" variant="primary">
            Create & Login
          </BigButton>
        </form>
      )}

      {/* Sheet: Personal Details */}
      <Sheet
        isOpen={personalDetailsSheet}
        onClose={() => setPersonalDetailsSheet(false)}
        title="Personal Information"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Legal Name</div>
            <div style={{ fontWeight: 700 }}>{customerName}</div>
          </div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PAN Number</div>
            <div style={{ fontWeight: 700, letterSpacing: '1px' }}>ABCDE1234F (Verified)</div>
          </div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Aadhaar Number</div>
            <div style={{ fontWeight: 700, letterSpacing: '1px' }}>•••• •••• 9812 (Masked)</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Address</div>
            <div style={{ fontWeight: 600 }}>{activeAddress}</div>
          </div>
        </div>
      </Sheet>

      {/* Sheet: KYC */}
      <Sheet
        isOpen={kycSheet}
        onClose={() => setKycSheet(false)}
        title="KYC Compliance Status"
      >
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
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
              margin: '0 auto 12px auto',
            }}
          >
            <CheckIcon size={32} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            Full KYC Verified (Tier 3)
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            Biometrics and documents verified on 14 Jan 2024. No transaction caps apply.
          </p>
        </div>
      </Sheet>

      {/* Sheet: Change PIN */}
      <Sheet
        isOpen={changePinSheet}
        onClose={() => setChangePinSheet(false)}
        title="Change 4-Digit Demo PIN"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field
            label="Enter New 4-Digit PIN"
            type="password"
            maxLength={4}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="1234"
          />
          <BigButton
            variant="primary"
            onClick={() => {
              playSuccessChime();
              alert('PIN updated successfully for this session!');
              setChangePinSheet(false);
              setNewPin('');
            }}
          >
            Update PIN
          </BigButton>
        </div>
      </Sheet>

      {/* Sheet: About */}
      <Sheet
        isOpen={aboutSheet}
        onClose={() => setAboutSheet(false)}
        title="About Saral Bank"
      >
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 4px 0', color: 'var(--brand)' }}>
            Saral Bank
          </h3>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Simple Banking. Better Tomorrow.
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            Designed for GEC Jammu Hackathon. Built with React, Vite, WCAG AA Accessibility, SHA-256 Auth, and Integer Paise precision.
          </p>
        </div>
      </Sheet>
    </Screen>
  );
}

