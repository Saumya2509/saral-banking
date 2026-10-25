import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ThreeStepFlow from '../../components/ui/ThreeStepFlow';
import Field from '../../components/ui/Field';
import ReviewList from '../../components/ui/ReviewList';
import ChoicePrompt from '../../components/ui/ChoicePrompt';
import { useStore } from '../../store/index.js';
import { useT } from '../../i18n/index.js';
import { rupeesToPaise, formatINR } from '../../utils/money.js';

export default function ServiceRequest() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const t = useT();

  const isYoung = state?.settings?.mode === 'young' || state?.session?.customerId === 'aarav';

  const [inputVal, setInputVal] = useState('');
  const [extraVal, setExtraVal] = useState('');
  const [extraVal2, setExtraVal2] = useState('');

  const isContactUpdate = type === 'mobile' || type === 'email';
  const isBlockCard = type === 'block-card';
  const isUnblockCard = type === 'unblock-card';

  const titles = {
    mobile: 'Update mobile number',
    email: 'Update email address',
    address: 'Update address',
    cheque: 'Request cheque book',
    'block-card': 'Block debit card',
    'unblock-card': 'Unblock debit card',
    'upi-limits': 'Set UPI daily limit',
    nominee: 'Add / Change nominee',
  };

  const handleConfirm = () => {
    const reqId = `SR-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isBlockCard) {
      dispatch({ type: 'BLOCK_CARD' });
    } else if (isUnblockCard) {
      dispatch({ type: 'UNBLOCK_CARD' });
    } else if (type === 'upi-limits') {
      const paise = rupeesToPaise(inputVal);
      if (isYoung) {
        // Aarav sends approval request to his mom Priya Sharma
        dispatch({
          type: 'ADD_GUARDIAN_REQUEST',
          payload: {
            id: `greq_lim_${Date.now()}`,
            type: 'upi_limit',
            childId: 'aarav',
            childName: 'Aarav Mehta',
            guardianId: 'priya',
            amountPaise: paise,
            requestedLimitPaise: paise,
            note: `Daily UPI limit increase to ₹${inputVal}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        });
      } else {
        dispatch({ type: 'SET_UPI_LIMITS', payload: { dailyPaise: paise } });
      }
    } else if (type === 'mobile') {
      dispatch({ type: 'UPDATE_CONTACT', payload: { mobile: inputVal } });
    } else if (type === 'email') {
      dispatch({ type: 'UPDATE_CONTACT', payload: { email: inputVal } });
    } else if (type === 'address') {
      dispatch({ type: 'UPDATE_CONTACT', payload: { address: inputVal } });
    } else if (type === 'nominee') {
      dispatch({
        type: 'SET_NOMINEE',
        payload: { name: inputVal, relationship: extraVal, dob: extraVal2 },
      });
    }

    dispatch({
      type: 'ADD_SERVICE_REQUEST',
      payload: {
        id: reqId,
        type,
        status: 'open',
        details: { inputVal, extraVal, extraVal2 },
        createdAt: new Date().toISOString(),
      },
    });

    // Auto-advance service request through pipeline in demo mode
    // open → in_progress (after 1s) → done (after 3s)
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_SERVICE_REQUEST',
        payload: { id: reqId, status: 'in_progress' },
      });
    }, 1000);

    setTimeout(() => {
      dispatch({
        type: 'UPDATE_SERVICE_REQUEST',
        payload: { id: reqId, status: 'done' },
      });
    }, 3000);
  };

  const getFillContent = () => {
    if (type === 'mobile') {
      return (
        <Field
          label="New mobile number"
          placeholder="98765 00000"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          hint="A verification OTP will be sent to confirm this number."
        />
      );
    }
    if (type === 'email') {
      return (
        <Field
          label="New email address"
          placeholder="yourname@example.com"
          type="email"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          hint="We will send your monthly statements to this email."
        />
      );
    }
    if (type === 'address') {
      return (
        <Field
          label="New residential address"
          type="textarea"
          placeholder="House no., Street, City, Pincode"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
      );
    }
    if (type === 'cheque') {
      return (
        <div style={{ padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: '12px' }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
            A new cheque book with 25 leaves will be dispatched to your registered address via registered post.
          </p>
        </div>
      );
    }
    if (type === 'upi-limits') {
      return (
        <Field
          label="New daily limit (₹)"
          placeholder="50000"
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          hint="Maximum amount you can transfer via UPI per calendar day."
        />
      );
    }
    if (type === 'nominee') {
      return (
        <div>
          <Field
            label="Nominee full name"
            placeholder="Kavita Prasad"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <Field
            label="Relationship"
            placeholder="Daughter / Son / Spouse"
            value={extraVal}
            onChange={(e) => setExtraVal(e.target.value)}
          />
          <Field
            label="Date of birth"
            type="date"
            value={extraVal2}
            onChange={(e) => setExtraVal2(e.target.value)}
          />
        </div>
      );
    }
    return (
      <div style={{ padding: '16px' }}>
        <p>Please review and confirm to complete this service request.</p>
      </div>
    );
  };

  const getReviewItems = () => {
    if (type === 'mobile') return [{ label: 'New mobile', value: inputVal }];
    if (type === 'email') return [{ label: 'New email', value: inputVal }];
    if (type === 'address') return [{ label: 'New address', value: inputVal }];
    if (type === 'cheque') return [{ label: 'Cheque book', value: '25 leaves' }];
    if (type === 'upi-limits') return [{ label: 'Daily limit', value: formatINR(rupeesToPaise(inputVal)) }];
    if (type === 'nominee')
      return [
        { label: 'Nominee name', value: inputVal },
        { label: 'Relationship', value: extraVal },
        { label: 'Date of birth', value: extraVal2 },
      ];
    return [{ label: 'Service', value: titles[type] || type }];
  };

  const canReview = type === 'cheque' || isBlockCard || isUnblockCard || Boolean(inputVal.trim());

  const receiptData = {
    title: 'Service request submitted',
    subtitle: 'We have received your request and will process it shortly.',
    reference: `SR-${Math.floor(100000 + Math.random() * 900000)}`,
    items: getReviewItems(),
  };

  return (
    <Screen title={titles[type] || 'Service request'} hideTabBar>
      <ThreeStepFlow
        fillContent={getFillContent()}
        reviewContent={<ReviewList items={getReviewItems()} />}
        canReview={canReview}
        extraVerify={isContactUpdate ? 'otp' : null}
        onConfirm={handleConfirm}
        receiptData={receiptData}
        onDone={() => navigate('/services')}
      />
    </Screen>
  );
}
