import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ReviewList from '../../components/ui/ReviewList';
import Notice from '../../components/ui/Notice';
import Amount from '../../components/ui/Amount';
import BigButton from '../../components/ui/BigButton';
import { useT } from '../../i18n/index.js';

export default function PayRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const t = useT();

  // Demo incoming request data
  const request = {
    id: id || 'req_1',
    from: 'Unknown Contact (Online Seller)',
    amountPaise: 250000, // ₹2,500
    note: 'Payment requested for lottery prize delivery charges',
  };

  const handleDecline = () => {
    alert('Payment request declined safely.');
    navigate('/');
  };

  const handleProceedToPay = () => {
    navigate('/pay/amount', {
      state: {
        payee: {
          name: request.from,
          bank: 'UPI Request',
          accountNumber: 'request@upi',
        },
      },
    });
  };

  const items = [
    { label: 'Requested by', value: request.from },
    {
      label: 'Amount requested',
      value: <Amount paise={request.amountPaise} size="large" />,
    },
    { label: 'Message', value: request.note },
  ];

  return (
    <Screen title="Payment request">
      {/* Scam alert notice */}
      <Notice type="safety" title="Be careful with payment requests">
        Never approve payment requests from people you do not know. Scammers often send requests claiming you won a prize or asking for delivery fees.
      </Notice>

      <ReviewList items={items} />

      {/* Exception rule: DECLINE is the primary big button */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <BigButton variant="danger" onClick={handleDecline}>
          {t('core.btn.decline') || 'Decline request (Recommended)'}
        </BigButton>

        <BigButton variant="secondary" onClick={handleProceedToPay}>
          Pay {request.from}
        </BigButton>
      </div>
    </Screen>
  );
}
