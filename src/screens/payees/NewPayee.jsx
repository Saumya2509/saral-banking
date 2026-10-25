import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ThreeStepFlow from '../../components/ui/ThreeStepFlow';
import Field from '../../components/ui/Field';
import Notice from '../../components/ui/Notice';
import ReviewList from '../../components/ui/ReviewList';
import config from '../../data/config.js';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';

export default function NewPayee() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';

  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bank, setBank] = useState('');

  const canReview = Boolean(name.trim() && accountNumber.trim() && ifsc.trim());

  const handleConfirm = () => {
    const newPayee = {
      id: `payee_${customerId}_${Date.now()}`,
      customerId,
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      ifsc: ifsc.trim().toUpperCase(),
      bank: bank.trim() || 'Beneficiary Bank',
      addedAt: new Date().toISOString(),
      isNew: true,
    };

    dispatch({ type: 'ADD_PAYEE', payload: newPayee });
  };

  const fillContent = (
    <div>
      <Notice type="info">
        {config.newPayeeRule[lang] || config.newPayeeRule.en}
      </Notice>

      <Field
        label={t('payees.name') || 'Full Name'}
        placeholder="Ramesh Kumar"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Field
        label={t('payees.account') || 'Account Number'}
        placeholder="123456789012"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
      />

      <Field
        label={t('payees.ifsc') || 'IFSC Code'}
        placeholder="SBIN0001234"
        value={ifsc}
        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
        required
      />

      <Field
        label={t('payees.bank') || 'Bank Name (optional)'}
        placeholder="State Bank of India"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
      />
    </div>
  );

  const reviewContent = (
    <div>
      <ReviewList
        items={[
          { label: 'Name', value: name },
          { label: 'Account number', value: accountNumber },
          { label: 'IFSC', value: ifsc },
          { label: 'Bank', value: bank || 'Not specified' },
        ]}
      />
    </div>
  );

  const receiptData = {
    title: 'Payee added successfully',
    subtitle: `${name} has been added to your payees.`,
    reference: `PAYEE-${Math.floor(100000 + Math.random() * 900000)}`,
    items: [
      { label: 'Payee name', value: name },
      { label: 'Account number', value: accountNumber },
      { label: 'IFSC', value: ifsc },
    ],
  };

  return (
    <Screen title={t('payees.addNew') || 'Add payee'} hideTabBar>
      <ThreeStepFlow
        fillContent={fillContent}
        reviewContent={reviewContent}
        canReview={canReview}
        onConfirm={handleConfirm}
        receiptData={receiptData}
        onDone={() => navigate('/pay')}
      />
    </Screen>
  );
}
