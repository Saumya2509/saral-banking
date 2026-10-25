import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Segmented from '../../components/ui/Segmented';
import Toggle from '../../components/ui/Toggle';
import ListRow from '../../components/ui/ListRow';
import BigButton from '../../components/ui/BigButton';
import banks from '../../data/banks.js';
import { getAllCustomers, getCustomer } from '../../data/customers.js';
import { ChevronRightIcon } from '../../components/icons/Icons';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { hasFingerprint, removeFingerprint, enableFingerprint } from '../../biometric/index.js';

export default function Settings() {
  const navigate = useNavigate();
  const { state, dispatch, resetDemo } = useStore();
  const { lang, t } = useI18n();

  const currentCustomerId = state.session.customerId || 'shankar';
  const allCustomers = getAllCustomers();
  const currentCustomer = getCustomer(currentCustomerId) || allCustomers[0];

  const [bioEnabled, setBioEnabled] = useState(() => hasFingerprint(currentCustomerId));

  useEffect(() => {
    setBioEnabled(hasFingerprint(currentCustomerId));
  }, [currentCustomerId]);

  const handleToggleBio = async (val) => {
    if (!val) {
      removeFingerprint(currentCustomerId);
      setBioEnabled(false);
    } else {
      try {
        await enableFingerprint(currentCustomer);
        setBioEnabled(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo data to initial state?')) {
      resetDemo();
      window.location.href = '/signin';
    }
  };

  return (
    <Screen title={t('core.settings.title') || 'Settings'}>
      {/* Profile & Account Quick Access Card */}
      <Card
        className="card-interactive"
        style={{
          border: '1.5px solid var(--brand-soft)',
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/profile')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              {(currentCustomer.name?.[lang] || currentCustomer.name?.en || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {currentCustomer.name?.[lang] || currentCustomer.name?.en}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--brand)', fontWeight: 600 }}>
                {lang === 'hi' ? 'प्रोफ़ाइल देखें, संपादित करें या नया जोड़ें' : lang === 'ta' ? 'சுயவிவரத்தைப் பார்க்கவும், விவரங்களை மாற்றவும்' : 'View Profile, Edit Info & Add New Account'}
              </div>
            </div>
          </div>
          <ChevronRightIcon size={20} color="var(--text-muted)" />
        </div>
      </Card>
      {/* Language */}
      <Card heading={t('core.settings.language') || 'Language'}>
        <Segmented
          value={state.settings.lang}
          onChange={(val) => dispatch({ type: 'SET_LANG', payload: val })}
          options={[
            { value: 'en', label: 'English' },
            { value: 'hi', label: 'हिन्दी (Hindi)' },
            { value: 'ta', label: 'தமிழ் (Tamil)' },
          ]}
        />
      </Card>

      {/* Text Size */}
      <Card heading={t('core.settings.textSize') || 'Text size'}>
        <Segmented
          value={state.settings.textSize}
          onChange={(val) => dispatch({ type: 'SET_TEXT_SIZE', payload: val })}
          options={[
            { value: 'normal', label: t('core.textSize.normal') || 'Normal' },
            { value: 'large', label: t('core.textSize.large') || 'Large' },
            { value: 'largest', label: t('core.textSize.largest') || 'Largest' },
          ]}
        />
      </Card>

      {/* Interface Mode */}
      <Card heading={t('core.settings.mode') || 'Display mode'}>
        <Segmented
          value={state.settings.mode}
          onChange={(val) => dispatch({ type: 'SET_MODE', payload: val })}
          options={[
            { value: 'standard', label: t('core.mode.standard') || 'Standard' },
            { value: 'simple', label: t('core.mode.simple') || 'Simple' },
            ...(currentCustomer.isMinor
              ? [{ value: 'young', label: t('core.mode.young') || 'Young Saver' }]
              : []),
          ]}
        />
      </Card>

      {/* Accessibility Toggles */}
      <Card heading="Accessibility & Privacy">
        <Toggle
          label={t('core.settings.contrast') || 'High contrast mode'}
          checked={state.settings.contrast}
          onChange={(val) => dispatch({ type: 'SET_CONTRAST', payload: val })}
        />
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '8px 0' }} />
        <Toggle
          label={t('core.settings.readAloud') || 'Read aloud enabled'}
          checked={state.settings.readAloud}
          onChange={(val) => dispatch({ type: 'SET_READ_ALOUD', payload: val })}
        />
        <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '8px 0' }} />
        <Toggle
          label={t('core.settings.hideBalance') || 'Hide balance on home'}
          checked={state.settings.hideBalance}
          onChange={(val) => dispatch({ type: 'SET_HIDE_BALANCE', payload: val })}
        />
      </Card>

      {/* Bank Theme Switcher */}
      <Card heading={t('core.settings.bank') || 'Bank theme'}>
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          {Object.entries(banks).map(([bankId, bank]) => {
            const isSelected = state.settings.bankId === bankId;
            return (
              <ListRow
                key={bankId}
                icon={
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: bank.brandHex,
                      border: isSelected ? '2px solid #000' : 'none',
                    }}
                  />
                }
                title={bank.name[lang] || bank.name.en}
                trailing={isSelected ? <span style={{ color: 'var(--brand)', fontWeight: 600 }}>✓</span> : null}
                onClick={() => dispatch({ type: 'SET_BANK_ID', payload: bankId })}
              />
            );
          })}
        </div>
      </Card>

      {/* Demo Customer Switcher */}
      <Card heading="Demo Customer Profile">
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          {allCustomers.map((c) => {
            const isSelected = c.id === currentCustomerId;
            return (
              <ListRow
                key={c.id}
                title={c.name[lang] || c.name.en}
                subtitle={`${c.age} years old · ${c.isMinor ? 'Minor account' : 'Standard account'}`}
                trailing={isSelected ? <span style={{ color: 'var(--brand)', fontWeight: 600 }}>Active</span> : null}
                onClick={() => {
                  dispatch({ type: 'SET_CUSTOMER', payload: c.id });
                  if (c.defaultMode) dispatch({ type: 'SET_MODE', payload: c.defaultMode });
                }}
              />
            );
          })}
        </div>
      </Card>

      {/* Biometric Unlock */}
      <Card heading={lang === 'hi' ? 'फ़िंगरप्रिंट सुरक्षा' : lang === 'ta' ? 'கைரேகை பாதுகாப்பு' : 'Fingerprint Security'}>
        <Toggle
          checked={bioEnabled}
          onChange={handleToggleBio}
          label={lang === 'hi' ? '1-टैप फ़िंगरप्रिंट लॉगिन' : lang === 'ta' ? '1-தொடுதலில் கைரேகை உள்நுழைவு' : '1-Tap Fingerprint Login'}
          description={
            bioEnabled
              ? (lang === 'hi' ? 'इस प्रोफ़ाइल के लिए सक्रिय है' : lang === 'ta' ? 'இந்த கணக்கிற்கு இயக்கப்பட்டுள்ளது' : 'Active for this profile')
              : (lang === 'hi' ? 'त्वरित लॉगिन के लिए चालू करें' : lang === 'ta' ? 'உடனடி உள்நுழைவுக்கு இயக்கவும்' : 'Enable for quick 1-tap sign in')
          }
        />
      </Card>

      {/* Reset Demo Button */}
      <div style={{ marginTop: '16px' }}>
        <BigButton variant="danger" onClick={handleResetDemo}>
          {t('core.settings.resetDemo') || 'Reset demo data'}
        </BigButton>
      </div>
    </Screen>
  );
}
